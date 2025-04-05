// https://vitepress.dev/guide/custom-theme
import {h} from 'vue'
import type {Theme} from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import 'virtual:group-icons.css'

export default {
    extends: DefaultTheme,
    Layout: () => {
        return h(DefaultTheme.Layout, null, {
            // https://vitepress.dev/guide/extending-default-theme#layout-slots
        })
    },
    enhanceApp({app, router, siteData}) {
        initStatistics();

        router.onAfterRouteChange = (to) => {
            const {aplus_queue} = window;

            if (typeof aplus_queue !== 'undefined') {
                aplus_queue.push({
                    action: 'aplus.sendPV',
                    arguments: [{ is_auto: false }]
                });
            }
        };
    }
} satisfies Theme;


function initStatistics(){
    (function(w, d, s, q, i) {
        w[q] = w[q] || [];
        var f = d.getElementsByTagName(s)[0],j = d.createElement(s) as HTMLScriptElement;
        j.async = true;
        j.id = 'beacon-aplus';
        j.src = 'https://d.alicdn.com/alilog/mlog/aplus/' + i + '.js';
        f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'aplus_queue', '203467608');

    //集成应用的appKey
    window.aplus_queue.push({
        action: 'aplus.setMetaInfo',
        arguments: ['appKey', '67f14cfd65c707471a3faf07']
    });
}