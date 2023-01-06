module.exports = {
    theme: "@vuepress/theme-blog",
    title: "Big Rice 🍚",
    themeConfig: {
        smoothScroll: true,
        dateFormat: "YYYY-MM-DD",
        directories: [
            {
                id: "arrayMethods",
                dirname: "arrayMethods",
                title: "arrayMethods",
            },
            {
                id: "css",
                dirname: "css",
                title: "css",
            },
            {
                id: "objectMethods",
                dirname: "objectMethods",
                title: "objectMethods",
            },
        ],
        nav: [
            {
                text: "Array",
                link: "/arrayMethods/",
            },
            {
                text: "Css",
                link: "/css/",
            },
        ],
        footer: {
            contact: [
                {
                    type: "github",
                    link: "https://github.com/bigRiceRice",
                },
            ],
            copyright: [
                {
                    text: "Big Rice © 2023",
                    link: "",
                },
            ],
        },
    },
    plugins: [["vuepress-plugin-code-copy", true]],
};
