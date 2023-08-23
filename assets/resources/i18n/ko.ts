import LanguagesJsonData from '../lang';

const win = window as any;

export const languages = {
    ...LanguagesJsonData.ko
};

if (!win.languages) {
    win.languages = {};
}

win.languages.ko = languages;
