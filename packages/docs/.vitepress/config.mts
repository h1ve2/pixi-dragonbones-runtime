import {defineConfig} from 'vitepress';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx'
import {groupIconMdPlugin, groupIconVitePlugin} from 'vitepress-plugin-group-icons';
import container from 'markdown-it-container';
import {renderSandbox} from 'vitepress-plugin-sandpack';

import {getAPISideBar, getGuideSideBar, getOtherSideBar, i18nInit} from "./i18n";

await i18nInit();

// const isDev = process.env.NODE_ENV === 'development';
const base = '/pixi-dragonbones-runtime/';

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "pixi-dragonbones-runtime",
    description: "DragonBones Runtime for Pixi.js",
    cleanUrls: true,
    lang: 'en-US',
    base: base,
    lastUpdated: true,
    mpa: true,
    locales: {
        root: {
            label: 'English',
        },
        zh: {
            label: '简体中文',
            lang: 'zh-CN',
            themeConfig: {
                nav: [
                    {text: '首页', link: '/zh/'},
                    {text: '指南', link: '/zh/guide/'},
                    {text: 'API', link: '/zh/api/8.x/'}
                ],
                sidebar: {
                    "/zh/guide": [await getGuideSideBar('zh'), await getOtherSideBar('zh'), {
                        text: 'API',
                        link: '/zh/api/8.x/'
                    }],
                    "/zh/other": [await getGuideSideBar('zh'), await getOtherSideBar('zh'), {
                        text: 'API',
                        link: '/zh/api/8.x/'
                    }],
                    "/zh/api": [
                        {...await getGuideSideBar('zh'), collapsed: true},
                        {...await getOtherSideBar('zh'), collapsed: true},
                        await getAPISideBar('zh')
                    ],
                },
            }
        }
    },
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
            {text: 'Guide', link: '/guide/'},
            {text: 'API', link: '/api/8.x/'}
        ],

        sidebar: {
            "/guide": [await getGuideSideBar('en'), await getOtherSideBar('en'), {text: 'API', link: '/api/8.x/'}],
            "/other": [await getGuideSideBar('en'), await getOtherSideBar('en'), {text: 'API', link: '/api/8.x/'}],
            "/api": [
                {...await getGuideSideBar('en'), collapsed: true},
                {...await getOtherSideBar('en'), collapsed: true},
                await getAPISideBar()
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
        outline: [2, 3],
        editLink: {
            pattern: ({filePath}) => {
                return `https://github.com/h1ve2/pixi-dragonbones-runtime/tree/main/packages/docs/${filePath}`
            }
        }
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
    },
    sitemap: {
        hostname: 'https://h1ve2.github.io/pixi-dragonbones-runtime/'
    }
})
