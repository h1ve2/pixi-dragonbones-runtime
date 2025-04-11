import {defineConfig} from 'vitepress';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx'
import {groupIconMdPlugin, groupIconVitePlugin} from 'vitepress-plugin-group-icons';
import container from 'markdown-it-container';
import {renderSandbox} from 'vitepress-plugin-sandpack';

import dataJSON_8x from '../api/8.x/doc.json';

const isDev = process.env.NODE_ENV === 'development';
const base = isDev ? '/' : '/pixi-dragonbones-runtime/';

const sidebar_8x = {text: 'API', link: "/api/8.x/", items: []};

if (dataJSON_8x) {
    dataJSON_8x.groups.forEach(group => {
        const obj = {text: group.title, items: []};
        sidebar_8x.items.push(obj);

        group.children.forEach(childId => {
            const child = getPageById(dataJSON_8x.children, childId);

            obj.items.push({text: child.name, link: "/api/8.x/" + group.title.toLowerCase() + "/" + child.name});
        })
    })
}

function getPageById(obj: any[], childId: number): any {
    for (let i = 0; i < obj.length; i++) {
        if (obj[i].id !== childId) continue;
        return obj[i];
    }
}

const guideSidebar = {
    text: '指南',
    collapsed: false,
    items: [
        {text: '快速开始', link: '/guide/'},
        {text: '事件', link: '/guide/event'},
        {text: '进阶', link: '/guide/advanced'},
        {text: '数据格式', link: '/guide/dataformat'},
    ]
};
const otherSidebar = {
    text: '其他',
    collapsed: false,
    items: [
        {text: 'tools', link: '/other/tools'},
        {text: '资源', link: '/other/resources'},
    ]
};


// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "pixi-dragonbones-runtime",
    description: "DragonBones Runtime for Pixi.js",
    cleanUrls: true,
    lang: 'zh-CN',
    base: base,
    head: [
        ['meta', {name: 'google-site-verification', content: 'rUeF22MNNzMhe5S8sOS5k50Km-zLsFQAG777yjXW61U'}],
        ['link', {rel: 'icon', href: base + 'images/logo.png'}],
        [
            'script',
            {},
            `
              (function(w, d, s, q, i) {
                    w[q] = w[q] || [];
                    var f = d.getElementsByTagName(s)[0],j = d.createElement(s);
                    j.async = true;
                    j.id = 'beacon-aplus';
                    j.src = 'https://d.alicdn.com/alilog/mlog/aplus/' + i + '.js';
                    f.parentNode.insertBefore(j, f);
                })(window, document, 'script', 'aplus_queue', '203467608');
              window.aplus_queue.push({
                    action: 'aplus.setMetaInfo',
                    arguments: ['appKey', '67f14cfd65c707471a3faf07']
                });
      `,
        ],
    ],
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        logo: "/images/logo.png",
        siteTitle: false,
        nav: [
            {text: 'Home', link: '/'},
            {text: '指南', link: '/guide/'},
            {text: 'API', link: '/api/8.x/'}
        ],

        sidebar: {
            "/guide": [guideSidebar, otherSidebar, {text: 'API', link: '/api/8.x/'}],
            "/other": [guideSidebar, otherSidebar, {text: 'API', link: '/api/8.x/'}],
            "/api": [
                {...guideSidebar, collapsed: true},
                {...otherSidebar, collapsed: true},
                sidebar_8x
            ],
        },

        socialLinks: [
            {icon: 'github', link: 'https://github.com/h1ve2/pixi-dragonbones-runtime'},
            {icon: 'npm', link: 'https://www.npmjs.com/package/pixi-dragonbones-runtime'}
        ],
        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2025-present <a href="https://h1v.cn" target="_blank">h1ve2</a>'
        },
        outline: [2, 3]
    },
    markdown: {
        config(md) {
            md
                // .use(container, 'sandbox', {
                //     render(tokens, idx) {
                //         return renderSandbox(tokens, idx, 'sandbox');
                //     },
                // })
                .use(container, 'sandpack', {
                    render(tokens, idx) {
                        return renderSandbox(tokens, idx, 'sandpack');
                    },
                })
                .use(groupIconMdPlugin);
        },
    },
    vite: {
        plugins: [
            vueJsx(),
            groupIconVitePlugin()
        ],
    }
})
