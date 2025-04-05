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

        router.onAfterRouteChange = (to) => {
            if (typeof aplus_queue !== 'undefined') {
                aplus_queue.push({
                    action: 'aplus.sendPV',
                    arguments: [{ is_auto: false }]
                });
            }
        };
    }
} satisfies Theme;

declare const aplus_queue:any[];