import LanguagesJsonData from '../lang';

const win = window as any;

export const languages = {
    ...LanguagesJsonData.fr
};

if (!win.languages) {
    win.languages = {};
}

win.languages.fr = languages;
