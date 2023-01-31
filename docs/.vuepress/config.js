module.exports = {
    theme: "@vuepress/theme-blog",
    title: "Big Rice 🍚",
    // base 必须与 github.io 仓库同名 /[Repository-Name]/
    base: "/blog/",
    head: [
        // 设置 favor.ico，.vuepress/public 下
        ["link", { rel: "icon", href: "favicon.ico" }],
    ],
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
            {
                id: "vite",
                dirname: "Vite",
                path: "/Vite/",
                title: "Vite",
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
};
