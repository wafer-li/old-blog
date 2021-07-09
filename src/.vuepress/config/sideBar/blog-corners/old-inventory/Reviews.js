const { sidebarConfig } = require("vuepress-theme-hope");

module.exports = sidebarConfig([
    {
        title: "TSPi",
        icon: "storage",
        prefix: "TSPi/",
        children: require("./TSPi"),
    },
    {
        title: "Automata",
        icon: "storage",
        prefix: "Automata/",
        children: require("./Automata"),
    },
    {
        title: "Probability",
        icon: "storage",
        prefix: "Probability/",
        children: require("./Probability"),
    },
    {
        title: "COA",
        icon: "storage",
        prefix: "COA/",
        children: require("./COA"),
    },
    {
        title: "AdvancedMathmatics",
        icon: "storage",
        prefix: "AdvancedMathmatics/",
        children: require("./AdvancedMathmatics"),
    },
    {
        title: "LinearAlgebra",
        icon: "storage",
        prefix: "LinearAlgebra/",
        children: require("./LinearAlgebra"),
    },
    {
        title: "MaoTheory",
        icon: "storage",
        prefix: "MaoTheory/",
        children: require("./MaoTheory"),
    },
    {
        title: "OS",
        icon: "storage",
        prefix: "OS/",
        children: require("./OS"),
    },
    {
        title: "ComputerNetwork",
        icon: "storage",
        prefix: "ComputerNetwork/",
        children: require("./ComputerNetwork"),
    },
]);