import LanguagesJsonData from '../lang';

const win = window as any;

export const languages = {
    ...LanguagesJsonData.de
};

if (!win.languages) {
    win.languages = {};
}

win.languages.de = languages;
