import i18next, {changeLanguage, i18n} from 'i18next';
import {DefaultTheme} from "vitepress";

export async function i18nInit() {
    await i18next.init({
        resources: {
            zh: {
                translation: {
                    "quickstart": "快速开始",
                    "event": "事件",
                    "advanced": "进阶",
                    "dataformat": "数据格式",
                    "tools": "工具",
                    "resources": "资源",
                    "Guide": "指南",
                    "Other": "其他",

                    "Enumerations": "枚举",
                    "Classes": "类",
                    "Interfaces": "接口",
                    "Functions": "函数",

                    "Create a new application": "创建一个Application",
                    "Initialize the application": "初始化Application",
                    "Append the application canvas to the document body": "将application添加到document body",
                    "Add the assets to load": "添加及加载资源",
                    "asset alias or JSON Object": "资源别名或对象",
                    "add to stage": "添加到舞台",
                    "play animation": "播放动画",
                    "add event listener": "添加事件监听",
                }
            }
        }
    });
}

export const t: i18n['t'] = i18next.t;


const guideSideBar: { [key: string]: DefaultTheme.SidebarItem } = {}

export async function getGuideSideBar(lang: string = 'en') {
    if (guideSideBar[lang]) {
        return guideSideBar[lang];
    }

    await changeLanguage(lang);

    let urlPrefix = '';
    if (lang !== 'en') urlPrefix = `/${lang}`;

    guideSideBar[lang] = {
        text: t('Guide'),
        collapsed: false,
        items: [
            {text: t('quickstart'), link: `${urlPrefix}/guide/`},
            {text: t('event'), link: `${urlPrefix}/guide/event`},
            {text: t('advanced'), link: `${urlPrefix}/guide/advanced`},
            {text: t('dataformat'), link: `${urlPrefix}/guide/dataformat`},
        ]
    };
    return guideSideBar[lang];
}

const otherSideBar: { [key: string]: DefaultTheme.SidebarItem } = {}

export async function getOtherSideBar(lang: string = 'en') {
    if (otherSideBar[lang]) {
        return otherSideBar[lang];
    }

    await changeLanguage(lang);

    let urlPrefix = '';
    if (lang !== 'en') urlPrefix = `/${lang}`;
    otherSideBar[lang] = {
        text: t('Other'),
        collapsed: false,
        items: [
            {text: t('tools'), link: `${urlPrefix}/other/tools`},
            {text: t('resources'), link: `${urlPrefix}/other/resources`},
        ]
    };
    return otherSideBar[lang];
}

import dataJSON_8x from '../../api/8.x/doc.json';

const sidebar_8x: { [key: string]: DefaultTheme.SidebarItem } = {
    'en': {text: 'API', link: "/api/8.x/", items: []},
    'zh': {text: 'API', link: "/zh/api/8.x/", items: []}
};

export async function getAPISideBar(lang: string = 'en') {
    // if (sidebar_8x[lang]) {
    //     return sidebar_8x[lang];
    // }

    await changeLanguage(lang);

    let urlPrefix = '';
    if (lang !== 'en') urlPrefix = `/${lang}`;

    dataJSON_8x.groups.forEach(group => {
        const obj = {text: t(group.title), items: []};
        sidebar_8x[lang].items.push(obj);

        group.children.forEach(childId => {
            const child = getPageById(dataJSON_8x.children, childId);

            obj.items.push({
                text: child.name,
                link: `${urlPrefix}/api/8.x/` + group.title.toLowerCase() + "/" + child.name
            });
        });
    });

    return sidebar_8x[lang];
}


function getPageById(obj: any[], childId: number): any {
    for (let i = 0; i < obj.length; i++) {
        if (obj[i].id !== childId) continue;
        return obj[i];
    }
}
