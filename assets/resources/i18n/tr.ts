import LanguagesJsonData from '../lang';

const win = window as any;

export const languages = {
    ...LanguagesJsonData.tr
};

if (!win.languages) {
    win.languages = {};
}

win.languages.tr = languages;
