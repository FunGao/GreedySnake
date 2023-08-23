
import LanguagesJsonData from '../lang';
const win = window as any;

export const languages = {
    ...LanguagesJsonData.ar
};

if (!win.languages) {
    win.languages = {};
}

win.languages.ar = languages;
