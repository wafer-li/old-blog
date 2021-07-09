const { sidebarConfig } = require("vuepress-theme-hope");

module.exports = sidebarConfig([
    "",
    {
        title: "Decoration",
        icon: "storage",
        prefix: "Decoration/",
        children: require("./Decoration"),
    },
    {
        title: "CodeConvention",
        icon: "storage",
        prefix: "CodeConvention/",
        children: require("./CodeConvention"),
    },
    {
        title: "Plan",
        icon: "storage",
        prefix: "Plan/",
        children: require("./Plan"),
    },
    {
        title: "DHT",
        icon: "storage",
        prefix: "DHT/",
        children: require("./DHT"),
    },
    {
        title: "Projects",
        icon: "storage",
        prefix: "Projects/",
        children: require("./Projects"),
    },
    {
        title: "HTML",
        icon: "storage",
        prefix: "HTML/",
        children: require("./HTML"),
    },
    {
        title: "PHP",
        icon: "storage",
        prefix: "PHP/",
        children: require("./PHP"),
    },
    {
        title: "Solidity",
        icon: "storage",
        prefix: "Solidity/",
        children: require("./Solidity"),
    },
    {
        title: "GitHub",
        icon: "storage",
        prefix: "GitHub/",
        children: require("./GitHub"),
    },
    {
        title: "Homework",
        icon: "storage",
        prefix: "Homework/",
        children: require("./Homework"),
    },
    {
        title: "Linux",
        icon: "storage",
        prefix: "Linux/",
        children: require("./Linux"),
    },
    {
        title: "Android",
        icon: "storage",
        prefix: "Android/",
        children: require("./Android"),
    },
    {
        title: "Rxjava",
        icon: "storage",
        prefix: "Rxjava/",
        children: require("./Rxjava"),
    },
    {
        title: "Mono",
        icon: "storage",
        prefix: "Mono/",
        children: require("./Mono"),
    },
    {
        title: "IntelliJ",
        icon: "storage",
        prefix: "IntelliJ/",
        children: require("./IntelliJ"),
    },
    {
        title: "material-design",
        icon: "storage",
        prefix: "material-design/",
        children: require("./material-design"),
    },
    {
        title: "Coursera",
        icon: "storage",
        prefix: "Coursera/",
        children: require("./Coursera"),
    },
    {
        title: "Kancolle",
        icon: "storage",
        prefix: "Kancolle/",
        children: require("./Kancolle"),
    },
    {
        title: "Reviews",
        icon: "storage",
        prefix: "Reviews/",
        children: require("./Reviews"),
    },
]);