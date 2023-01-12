module.exports = {
    theme: "@vuepress/theme-blog",
    title: "Big Rice 🍚",
    base: "/bigRiceRice.io/dist/",
    themeConfig: {
        smoothScroll: true,
        dateFormat: "YYYY-MM-DD",
        directories: [
            {
                id: "javascript",
                dirname: "JavaScript",
                path: "/JavaScript/",
                title: "JavaScript",
            },
            {
                id: "framework",
                dirname: "FrameWork",
                path: "/FrameWork/",
                title: "框架",
            },
            {
                id: "api",
                dirname: "API",
                path: "/API/",
                title: "Api",
            },
            {
                id: "css",
                dirname: "Css",
                path: "/Css/",
                title: "Css",
            },
        ],
        nav: [
            {
                text: "框架",
                link: "/FrameWork/",
            },
            {
                text: "Css",
                link: "/Css/",
            },
            {
                text: "API",
                link: "/API/",
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
                    text: "该网站使用 vuepress + @vuepress/theme-blog 搭建 —— by: Big Rice © 2023",
                    link: "",
                },
            ],
        },
    },
    plugins: [
        [
            "@vuepress/search",
            {
                searchMaxSuggestions: 10,
            },
        ],
    ],
};
