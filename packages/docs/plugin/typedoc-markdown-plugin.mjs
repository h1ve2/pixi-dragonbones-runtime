/**
 * @param {import('typedoc-plugin-markdown').MarkdownApplication} app
 */
export function load(app) {
    app.renderer.markdownHooks.on(
        'page.begin',
        () => `---\neditLink: false\n---`,
    );
}