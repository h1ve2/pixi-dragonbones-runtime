// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
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
  enhanceApp({ app, router, siteData }) {
    router.onBeforeRouteChange = (to) => {
      if (typeof _hmt !== 'undefined') {
        _hmt.push(['_trackPageview', to]);
      }
    };
  }
} satisfies Theme

declare const _hmt:any[];
