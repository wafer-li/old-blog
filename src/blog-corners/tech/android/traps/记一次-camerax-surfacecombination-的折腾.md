---
title: "记一次 CameraX SurfaceCombination 的折腾"
author: "Wafer Li"
date: "2021-07-15 12:18"
category: Android
tags:
  - 技术开发
  - 踩坑记录
  - Android
  - CameraX
---

CameraX 是 Google 新推出的相机操作库，用起来倒是很好用的，用各种 UseCase 对相机的使用目的进行区分，同时也加入了生命周期的处理。

但是，CameraX 似乎对现今设备的性能估计太过保守了，所以就有一些不是很必要的限制。

这里就来谈一下我在最近开发遇到的一个 SurfaceCombination 的限制问题。

<!-- more -->

## 1. 产品需求

最近在公司接手了智能设备的开发，就是非手机的 Android 设备的开发工作；该智能设备具有前后两个屏幕，以及一个摄像头。

在使用此智能设备开发图像识别功能的时候，产品需求摄像头所拍摄到的图像要在两个屏幕上都显示，同时还需要对图像进行智能分析。

## 2. 坑点来了

那么我在采用 CameraX 进行开发的时候，想当然的就是开两个 `Preview` UseCase 加上一个 `ImageAnalysis` UseCase，然后直接各自处理就完事了。

但是很奇怪的是，它们三个并不能同时开！经过多重排列组合的测试之后，我发现：

1. 只有 2 `Preview` 是正常的
2. 1 `Preview` + 1 `ImageAnalysis` 也是正常的
3. 1 `Preview` + 1 `ImageAnalysis` + 1 `Preview`，后来开的 `Preview` 直接黑屏无法显示

然后我尝试先开两个 `Preview`，再开 `ImageAnalysis`；

乍一眼看上去两个 `Preview` 都打开，能够正常显示了，但是图像预览一点也不卡，图像分析一点结果都没有；

这引起了我的怀疑，查看日志之后发现：

```
java.lang.IllegalArgumentException:
No supported surface combination is found for camera device - Id : 0.
May be attempting to bind too many use cases.
```

好家伙，结果最后还是没绑上去嘛！

于是，我就不得不踏上了漫漫的踩坑之路。

## 3. 源码摸索

既然有特定的报错信息，而且看起来还是 Java 层报的错误，所以可以初步的去寻找报错的位；

在经过一番查找之后，我找到了：

::: details 代码有点长这里就折叠一下
```java {28}
// androidx.camera.camera2.internal.Camera2DeviceSurfaceManager.java

    public Map<UseCaseConfig<?>, Size> getSuggestedResolutions(
            @NonNull String cameraId,
            @NonNull List<SurfaceConfig> existingSurfaces,
            @NonNull List<UseCaseConfig<?>> newUseCaseConfigs) {
        Preconditions.checkArgument(!newUseCaseConfigs.isEmpty(), "No new use cases to be bound.");

        // Use the small size (640x480) for new use cases to check whether there is any possible
        // supported combination first
        List<SurfaceConfig> surfaceConfigs = new ArrayList<>(existingSurfaces);

        for (UseCaseConfig<?> useCaseConfig : newUseCaseConfigs) {
            surfaceConfigs.add(
                    transformSurfaceConfig(cameraId,
                            useCaseConfig.getInputFormat(),
                            new Size(640, 480)));
        }

        SupportedSurfaceCombination supportedSurfaceCombination =
                mCameraSupportedSurfaceCombinationMap.get(cameraId);

        if (supportedSurfaceCombination == null) {
            throw new IllegalArgumentException("No such camera id in supported combination list: "
                    + cameraId);
        }

        if (!supportedSurfaceCombination.checkSupported(surfaceConfigs)) {
            throw new IllegalArgumentException(
                    "No supported surface combination is found for camera device - Id : "
                            + cameraId + ".  May be attempting to bind too many use cases. "
                            + "Existing surfaces: " + existingSurfaces + " New configs: "
                            + newUseCaseConfigs);
        }

        return supportedSurfaceCombination.getSuggestedResolutions(existingSurfaces,
                newUseCaseConfigs);
    }

```
:::

从这里我们可以知道，是因为 `supportedSurfaceCombination.checkSupported()` 没有通过，所以才会报错。

那么继续往下看，我们可以发现，实际上 Camera2 自定义了一套各种级别的相机设备所支持的 `SurfaceCombination`。

::: details `checkSupported` 源码
```java
// SupportedSurfaceCombination.java
boolean checkSupported(List<SurfaceConfig> surfaceConfigList) {
    boolean isSupported = false;

    for (SurfaceCombination surfaceCombination : mSurfaceCombinations) {
        isSupported = surfaceCombination.isSupported(surfaceConfigList);

        if (isSupported) {
            break;
        }
    }

    return isSupported;
}
```
:::

![Camera2 支持的 SurfaceCombination](/images/记一次-camerax-surfacecombination-的折腾/camera2-支持的-surfacecombination.png)

断点查询了一下，这里我所使用的相机设备是最低级的 Legacy 设备，那么 Legacy 所支持的 SurfaceCombination 有哪些呢？

::: details Legacy 所支持的 `SurfaceCombination`
```java
    List<SurfaceCombination> getLegacySupportedCombinationList() {
        List<SurfaceCombination> combinationList = new ArrayList<>();

        // (PRIV, MAXIMUM)
        SurfaceCombination surfaceCombination1 = new SurfaceCombination();
        surfaceCombination1.addSurfaceConfig(
                SurfaceConfig.create(ConfigType.PRIV, ConfigSize.MAXIMUM));
        combinationList.add(surfaceCombination1);

        // (JPEG, MAXIMUM)
        SurfaceCombination surfaceCombination2 = new SurfaceCombination();
        surfaceCombination2.addSurfaceConfig(
                SurfaceConfig.create(ConfigType.JPEG, ConfigSize.MAXIMUM));
        combinationList.add(surfaceCombination2);

        // (YUV, MAXIMUM)
        SurfaceCombination surfaceCombination3 = new SurfaceCombination();
        surfaceCombination3.addSurfaceConfig(
                SurfaceConfig.create(ConfigType.YUV, ConfigSize.MAXIMUM));
        combinationList.add(surfaceCombination3);

        // Below two combinations are all supported in the combination
        // (PRIV, PREVIEW) + (JPEG, MAXIMUM)
        SurfaceCombination surfaceCombination4 = new SurfaceCombination();
        surfaceCombination4.addSurfaceConfig(
                SurfaceConfig.create(ConfigType.PRIV, ConfigSize.PREVIEW));
        surfaceCombination4.addSurfaceConfig(
                SurfaceConfig.create(ConfigType.JPEG, ConfigSize.MAXIMUM));
        combinationList.add(surfaceCombination4);

        // (YUV, PREVIEW) + (JPEG, MAXIMUM)
        SurfaceCombination surfaceCombination5 = new SurfaceCombination();
        surfaceCombination5.addSurfaceConfig(
                SurfaceConfig.create(ConfigType.YUV, ConfigSize.PREVIEW));
        surfaceCombination5.addSurfaceConfig(
                SurfaceConfig.create(ConfigType.JPEG, ConfigSize.MAXIMUM));
        combinationList.add(surfaceCombination5);

        // (PRIV, PREVIEW) + (PRIV, PREVIEW)
        SurfaceCombination surfaceCombination6 = new SurfaceCombination();
        surfaceCombination6.addSurfaceConfig(
                SurfaceConfig.create(ConfigType.PRIV, ConfigSize.PREVIEW));
        surfaceCombination6.addSurfaceConfig(
                SurfaceConfig.create(ConfigType.PRIV, ConfigSize.PREVIEW));
        combinationList.add(surfaceCombination6);

        // (PRIV, PREVIEW) + (YUV, PREVIEW)
        SurfaceCombination surfaceCombination7 = new SurfaceCombination();
        surfaceCombination7.addSurfaceConfig(
                SurfaceConfig.create(ConfigType.PRIV, ConfigSize.PREVIEW));
        surfaceCombination7.addSurfaceConfig(
                SurfaceConfig.create(ConfigType.YUV, ConfigSize.PREVIEW));
        combinationList.add(surfaceCombination7);

        // (PRIV, PREVIEW) + (PRIV, PREVIEW) + (JPEG, MAXIMUM)
        SurfaceCombination surfaceCombination8 = new SurfaceCombination();
        surfaceCombination8.addSurfaceConfig(
                SurfaceConfig.create(ConfigType.PRIV, ConfigSize.PREVIEW));
        surfaceCombination8.addSurfaceConfig(
                SurfaceConfig.create(ConfigType.YUV, ConfigSize.PREVIEW));
        surfaceCombination8.addSurfaceConfig(
                SurfaceConfig.create(ConfigType.JPEG, ConfigSize.MAXIMUM));
        combinationList.add(surfaceCombination8);

        return combinationList;
    }
```
:::

查看之后发现，它最多只支持两个 `Preview`，或者一个 `Preview` 一个 `YUV`（即 `ImageAnalysis` 所使用的格式）。

于是，这就解释了为什么之前我死活不能完成两个 `Preview` + `ImageAnalysis`。

## 4. 解决办法

问题的成因是找到了，那么我们就可以对症下药；

有没有什么办法能改写掉这个 Legacy 的默认支持列表，让它能支持我们需求所需要的三个 Surface 呢？

首先，我们可以将 Camera2 的源码自己拷贝一份，然后重新编译。这个办法当然是万金油，但是侵入性太大了，于是我就摸索起了 CameraX 库针对 `SupportedSurfaceCombination` 的导入形式。

![CameraX 中 SupportedSurfaceCombination 的调用方](/images/记一次-camerax-surfacecombination-的折腾/camerax-中-supportedsurfacecombination-的调用方.png)

从这里，我们可以发现，实际上 `SupportedSurfaceCombination` 是由 `Camera2DeviceSurfaceManager`

然而，`Camera2DeviceSurfaceManager` 是通过 `CameraXConfig` 进行 **配置** 的！

```java
// Camera2Config.java
CameraXConfig.Builder appConfigBuilder =
                new CameraXConfig.Builder()
                        .setCameraFactoryProvider(cameraFactoryProvider)
                        .setDeviceSurfaceManagerProvider(surfaceManagerProvider)
                        .setUseCaseConfigFactoryProvider(configFactoryProvider);
```

那么，我们如果有办法配置 `CameraXConfig`，就可以配置 `Camera2DeviceSurfaceManager`，进而可以配置 `SupportedSurfaceCombination`。

那么我们怎么样可以配置 `CameraXConfig` 呢？

通过查询[文档](https://developer.android.com/reference/androidx/camera/core/CameraXConfig)，我们可以通过将 `Application` 继承 `CameraXConfig.Provider` 来配置我们自己的 `CameraXConfig` ！

那么解决办法就自然而然的出炉了：

1. `Application` 继承 `CameraXConfig.Provider`
2. 构造新的 `CameraXConfig`，指定一个修改过的 `Camera2DeviceSurfaceManager`
3. 修改过后的 `Camera2DeviceSurfaceManager` 使用一个修改过的 `SupportedSurfaceCombination`
4. 修改过后的 `SupportedSurfaceCombination` 增加我们所需要的 `SurfaceCombination` 即可。

经过修改之后，发现确实可行，三个 `Surface` 都成功的绑定上了。

## 5. 代码

这里附上修改过后的[源码](https://gist.github.com/wafer-li/5c2c5565dbfea669174341fb5567a2df)。

使用 [MIT 协议](https://opensource.org/licenses/MIT)分发。
