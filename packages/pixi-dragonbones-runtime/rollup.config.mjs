import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

function genOption(format) {
    const ext = format === 'esm' ? 'mjs' : format;

    return {
        dir: 'lib',
        preserveModules: true,
        sourcemap: true,
        format: format,
        entryFileNames: `[name].${ext}`,
        chunkFileNames: `[name].${ext}`,
    }
}

export default (async () => ({
    input: 'src/index.ts',
    output: [
        genOption('esm'),
        genOption('cjs'),
    ],
    plugins: [
        typescript(),
        terser()
    ],

}))();