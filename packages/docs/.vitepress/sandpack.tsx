import {defineComponent, RendererElement, RendererNode, VNode} from 'vue';
import {Sandbox, sandboxProps} from 'vitepress-plugin-sandpack';
import {i18nInit, t} from "./i18n";
import {changeLanguage} from "i18next";
import {useData} from "vitepress";


i18nInit();

export const Sandpack = defineComponent({
    name: 'Sandpack',
    props: sandboxProps,
    setup(props:typeof sandboxProps, {slots}) {


        const {lang} = useData();

        const langStr = lang.value.split('-')[0];
        console.log(langStr);
        changeLanguage(langStr);


        const slotDefault = slots?.default ? slots.default() : null;
        translate( ...slotDefault);

        return () => (

            <Sandbox
                {...props}
                template='vanilla-ts'
                showTabs={false}
                lightTheme='githubLight'
                options={{
                    showLineNumbers: true,
                    coderHeight: 500,
                    previewHeight: 600,
                }}
                customSetup={{
                    deps: {
                        'pixi.js': '^8.9.1',
                        'pixi-dragonbones-runtime': '^8.0.2',
                    },
                }}
            >
                {slotDefault}
            </Sandbox>
        );
    },
});

function translate(...vnode: VNode<RendererNode, RendererElement>[]) {
    vnode.forEach(n => {
        if ((typeof n.children) === 'string') {
            const index = n.children.lastIndexOf('/');
            if (index >= 0) {
                const str = n.children.substring(index + 1).trim();
                const tstr = t(str);
                if (str !== tstr){
                    n.children = n.children.substring(0, index + 1) + ' ' + tstr;
                }
            }

            return;
        }

        if (!n.children || n.children.length == 0) return;
        translate(...n.children as VNode[])
    })
}