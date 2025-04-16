---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: <span class='bigtext'>DragonBones Runtime</span><br/><span class='text_for'>for</span> <img class='pixilogo' src='./images/pixijs-logo-transparent-dark.svg'/>
  tagline: supports Pixi.js@7~8.x
  image:
    src: ./images/pic.png
    alt: pixi-dragonbones-runtime
  actions:
    - theme: brand
      text: quickstart
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
    title: Multi version
    details: supports Pixi.js@7~8.x
    link: https://pixijs.com/
    linkText: pixi.js
  - title: Mesh
    icon: 🕸
    details: support FFD mesh animate
  - title: ES6
    icon:
      src: ./images/es6-icon-128.svg
    details: Use ES6 imports to take advantage of Tree Shaking
    link: /guide/
    linkText: quick start
  - title: opensource
    icon: 🎉
    details: Released under the MIT License
---

