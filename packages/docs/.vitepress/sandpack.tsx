import {defineComponent} from 'vue';
import {Sandbox, sandboxProps} from 'vitepress-plugin-sandpack';

export const Sandpack = defineComponent({
    name: 'Sandpack',
    props: sandboxProps,
    setup(props, {slots}) {
        return () => (
            <Sandbox
                {...props}
                template='vanilla-ts'
                showTabs={false}
                lightTheme='githubLight'
                options={{
                    showLineNumbers: true,
                    coderHeight:500,
                    previewHeight:600,
                }}
                customSetup={{
                    deps: {
                        'pixi.js': '^8.9.1',
                        'pixi-dragonbones-runtime': '^8.0.1',
                    },
                }}
            >
                {slots?.default ? slots.default() : null}
            </Sandbox>
        );
    },
});