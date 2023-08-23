import LanguagesJsonData from '../lang';

const win = window as any;

export const languages = {
    ...LanguagesJsonData.zh_cn
};

if (!win.languages) {
    win.languages = {};
}

win.languages.zhcn = languages;
