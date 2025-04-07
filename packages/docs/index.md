---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: <span class='bigtext'>DragonBones Runtime</span><br/><span class='text_for'>for</span> <img class='pixilogo' src='./images/pixijs-logo-transparent-dark.svg'/>
  tagline: 支持 Pixi.js@7~8.x
  image:
    src: ./images/pic.png
#    alt: VitePress
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/
    - theme: alt
      text: API
      link: /api/8.x
    - theme: alt
      text: Github
      link: https://github.com/h1ve2/pixi-dragonbones-runtime
      target: _blank

features:
  - icon:
      src: ./images/pixijs-logo-mark-dark.svg
    title: 多版本支持
    details: 支持Pixi.js@7~8.x版本
    link: https://pixijs.com/
    linkText: pixi.js
  - title: 网格
    icon: 🕸
    details: 支持FFD网格动画
  - title: es6
    icon:
      src: ./images/es6-icon-128.svg
    details: 使用import导入及TreeShaking
    link: /guide/
    linkText: 快速开始
  - title: free
    icon: 🎉
    details: 你自由了!🫢 <br/>(基于MIT许可发布)
---

