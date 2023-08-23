import LanguagesJsonData from '../lang';

const win = window as any;

export const languages = {
    ...LanguagesJsonData.pt
};

if (!win.languages) {
    win.languages = {};
}

win.languages.pt = languages;
