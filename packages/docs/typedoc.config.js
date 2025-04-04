/** @type {Partial<import("typedoc").TypeDocOptions>} */
const config = {
    name: 'API',
    "plugin": ["typedoc-plugin-markdown"],
    "entryPoints": ["../pixi-dragonbones-runtime/src/index.ts"],
    "tsconfig": '../pixi-dragonbones-runtime/tsconfig.json',
    "readme": 'none',
    "router": "member",
    "entryFileName": "index",
    "hidePageHeader": true,
    "useCodeBlocks": true,
    "excludeTags": ["@version", "@see", "@language"],
    disableSources: true,
    excludePrivate: true,
    excludeProtected: true,
};

export default config;