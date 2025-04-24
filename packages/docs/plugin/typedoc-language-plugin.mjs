// @ts-check
import {Application, Converter, Context, Comment, ReflectionKind} from 'typedoc';

export function load({application}) {
    application.options.addDeclaration({
        name: 'language',
        help: 'Specify the language for parsing comments (e.g., en, zh).',
        defaultValue: 'en',
    });

    const lang = application.options.getValue('lang');

    application.converter.on(Converter.EVENT_CREATE_DECLARATION, (context, reflection, node) => {
        if (!reflection.comment) return;

        mergeCommentsPart(reflection.comment?.summary);
        reflection.comment?.summary.forEach(n => n.text = getTextByLang(n.text, lang));


        for (let i = 0; i < reflection.comment?.blockTags?.length; i++) {
            const n = reflection.comment.blockTags[i];
            if (!n.name) continue
            if (n.name.trim() !== lang) {
                n.skipRendering = true;
                reflection.comment.blockTags.splice(i, 1);
                i--;
            }
        }
    });


    const langCheckExp = new RegExp(`.*\\[${lang}\\].*`, 'ig');

    application.converter.on(Converter.EVENT_CREATE_SIGNATURE, (context, reflection, node) => {
        if (!reflection.comment) return;

        mergeCommentsPart(reflection.comment?.summary);
        reflection.comment?.summary?.forEach(n => n.text = getTextByLang(n.text, lang));

        for (let i = 0; i < reflection.comment?.blockTags?.length; i++) {
            const n = reflection.comment.blockTags[i];
            if (!n.content) continue;

            if (langCheckExp.test(n?.content[0]?.text)) {
                n.content[0].text = getTextByLang(n.content[0].text, lang);
            } else if (/.*(\[en\]|\[zh\]).*/ig.test(n?.content[0]?.text)) {
                n.skipRendering = true;
                reflection.comment?.blockTags?.splice(i, 1);
                i--;
            }
        }
    });
}

function getTextByLang(text, lang) {
    if (!text) return;

    if (!/(\[en\]|\[zh\])/ig.test(text)) {
        return text;
    }
    const regExp = new RegExp(`\\[${lang}\\](.+?)(\\[zh\\]|\\[en\\]|$)+?`, 'igs');
    const mat = regExp.exec(text);
    if (mat && mat.length > 1) {
        text = mat[1];
    }

    return text.trim();

}

function mergeCommentsPart(comments) {
    if (!comments || comments.length <= 1) return;
    for (let i = 1; i < comments.length; i++) {
        comments[0].text += comments[i].text;
        comments.splice(i,1);
        i--;
    }

}