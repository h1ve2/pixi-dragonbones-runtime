/** @type {Partial<import("typedoc").TypeDocOptions>} */
const config = {
    name: 'API',
    logLevel:'Error',
    cleanOutputDir:false,
    "plugin": ["typedoc-plugin-markdown",'./plugin/typedoc-markdown-plugin.mjs','./plugin/typedoc-language-plugin.mjs'],
    "entryPoints": ["../pixi-dragonbones-runtime/src/index.ts"],
    "tsconfig": '../pixi-dragonbones-runtime/tsconfig.json',
    "readme": 'none',
    "router": "member",
    "entryFileName": "index",
    "hidePageHeader": true,
    "useCodeBlocks": true,
    "excludeTags": ["@version", "@see", "@language"],
    // disableSources: true,
    sourceLinkTemplate: 'https://github.com/h1ve2/pixi-dragonbones-runtime/blob/{gitRevision}/{path}#L{line}',
    excludePrivate: true,
    excludeProtected: true,
    excludeExternals: true,
    "expandObjects": false,
    "expandParameters": true,
    indexFormat:'table',
    parametersFormat:'table',
    // propertyMembersFormat:'table',
    // interfacePropertiesFormat:'table',
    typeDeclarationFormat:'table',
    // classPropertiesFormat:'table',
    typeAliasPropertiesFormat:'table',
    enumMembersFormat:'table',
    "tableColumnSettings": {
        "hideSources": true,
        "hideOverrides": true,
        "hideInherited": true,
    },
    basePath:'../../packages/pixi-dragonbones-runtime/src/',
    // intentionallyNotExported:'/'
    jsDocCompatibility:{

    }
};

export default config;