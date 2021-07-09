const { config } = require("vuepress-theme-hope");
const navbarConfig = require("./config/navbars");
const sidebarConfig = require("./config/sideBar")

module.exports = config({
  title: "Wafer Li's Notes",
  description: "Wafer Li 的知识库，请随便浏览",

  dest: "./dist",

  head: [
    [
      "script",
      { src: "https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js" },
    ],
    [
      "script",
      {
        src: "https://cdn.jsdelivr.net/npm/react-dom/umd/react-dom.production.min.js",
      },
    ],
    [
      "script",
      { src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js" }
    ],
    [
      "script",
      { src: "https://cdn.jsdelivr.net/npm/@babel/standalone/babel.min.js" },
    ],
  ],

  locales: {
    "/": {
      lang: "zh-CN",
    },

  },

  themeConfig: {
    logo: "/images/waifu.png",
    hostname: "https://wafer.li",

    author: "Wafer Li",
    repo: "https://github.com/wafer-li/wafer-li.github.io",

    nav: navbarConfig,

    sidebar: sidebarConfig,

    blog: {
      intro: "/about/",
      sidebarDisplay: "mobile",
      links: {
        Email: "mailto:omyshokami@gmail.com",
        Github: "https://github.com/wafer-li",
      },
    },

    footer: {
      display: true,
      content: "用心再出发",
      copyright: '<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="知识共享许可协议" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png" /></a> Wafer Li 2016-2021'
    },

    comment: {
      type: "waline",
      serverURL: "https://blog-comment-theta.vercel.app",
    },

    copyright: {
      status: "global",
      minLength: 50,
    },

    git: {
      timezone: "Asia/Shanghai",
    },

    mdEnhance: {
      enableAll: true,
      presentation: {
        plugins: [
          "highlight",
          "math",
          "search",
          "notes",
          "zoom",
          "anything",
          "audio",
          "chalkboard",
        ],
      },
    },

    pwa: false 
  },
});
