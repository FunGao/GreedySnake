import LanguagesJsonData from '../lang';

const win = window as any;

export const languages = {
    ...LanguagesJsonData.zh_tw
};

if (!win.languages) {
    win.languages = {};
}

win.languages.zhtw = languages;
