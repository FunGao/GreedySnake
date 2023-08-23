import LanguagesJsonData from '../lang';

const win = window as any;

export const languages = {
    ...LanguagesJsonData.ja
};

if (!win.languages) {
    win.languages = {};
}

win.languages.ja = languages;
