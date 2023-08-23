import LanguagesJsonData from '../lang';

const win = window as any;

export const languages = {
    ...LanguagesJsonData.ru
};

if (!win.languages) {
    win.languages = {};
}

win.languages.ru = languages;
