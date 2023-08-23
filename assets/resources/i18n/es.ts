import LanguagesJsonData from '../lang';

const win = window as any;

export const languages = {
    ...LanguagesJsonData.es
};

if (!win.languages) {
    win.languages = {};
}

win.languages.es = languages;
