import {defineConfig} from 'vitepress'
import {groupIconMdPlugin, groupIconVitePlugin} from 'vitepress-plugin-group-icons'

import dataJSON_8x from '../api/8.x/doc.json';

const sidebar_8x = {text: 'API', items: []};

if (dataJSON_8x) {
    dataJSON_8x.groups.forEach(group => {
        const obj = {text: group.title, items: []};
        sidebar_8x.items.push(obj);

        group.children.forEach(childId => {
            const child = getPageById(dataJSON_8x.children, childId);

            obj.items.push({text:child.name,link:"/api/8.x/"+group.title.toLowerCase()+"/"+child.name});
        })
    })
}

function getPageById(obj: any[], childId: number): any {
    for (let i = 0; i < obj.length; i++) {
        if (obj[i].id !== childId) continue;
        return obj[i];
    }
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "pixi-dragonbones-runtime",
    description: "DragonBones Runtime for Pixi.js",
    cleanUrls: true,
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        logo:"/images/logo.png",
        siteTitle:"",
        nav: [
            {text: 'Home', link: '/'},
            {text: '指南', link: '/guide/'},
            {
                text: 'API',link: '/api/8.x/'
                // items: [
                    // {text: "8.x", link: '/api/8.x/'},
                    // {text: "7.x", link: '/api/7.x/'}
                // ]
            }
        ],

        sidebar: {
            "/guide": [{
                text: '指南',
                items: [
                    {text: '快速入门', link: '/guide/'},
                    {text: '事件', link: '/guide/event'},
                    {text: '资源', link: '/guide/resources'},
                ]
            }, {
                text: '其他',
                items: [
                    {text: 'API', link: '/api/8.x/'}
                ]
            }],
            // "/api/7.x": sidebar_7x,
            "/api/8.x": [sidebar_8x],
        },

        socialLinks: [
            {icon: 'github', link: 'https://github.com/h1ve2/pixi-dragonbones-runtime'}
        ],
        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2025-present <a href="https://h1v.cn" target="_blank">h1ve2</a>'
        },
        outline: [2, 3]
    },
    markdown: {
        config(md) {
            md.use(groupIconMdPlugin)
        },
    },
    vite: {
        plugins: [
            groupIconVitePlugin()
        ],
    }
})
