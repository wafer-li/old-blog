---
title: "Flutter Android 集成步骤"
author: "Wafer Li"
date: "2019-07-18 17:57"
---

1. 生成 `flutter_module`

```bash
flutter create -a kotlin -i swift --androidx -t module flutter_module
```

2. 编辑 `settings.gradle`

```gradle
include ':app'

Process process = "flutter packages get".execute(
    System.getenv().collect { key, value -> "$key=$value" },
    new File("<FLUTTER_MODULE_PATH>"))
process.waitForProcessOutput(System.out, System.err)

setBinding(new Binding([gradle: this]))
evaluate(new File(
        settingsDir,
        "<FLUTTER_MODULE_PATH>/.android/include_flutter.groovy"
))
```

3. 编辑 `app/build.gradle`

```gradle
implementation project(':flutter')
```

4. 加入混淆配置

```proguard
#Flutter Wrapper
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.**  { *; }
-keep class io.flutter.util.**  { *; }
-keep class io.flutter.view.**  { *; }
-keep class io.flutter.**  { *; }
-keep class io.flutter.plugins.**  { *; }
```

5. 建立 Flutter 宿主 Activity

6. `main.dart` 用于判断路由

5 和 6 详见 https://github.com/flutter/flutter/wiki/Add-Flutter-to-existing-apps#use-the-flutter-module-from-your-java-code
