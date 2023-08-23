import LanguagesJsonData from '../lang';

const win = window as any;

export const languages = {
    // "staterank": "State Leaderboard"
    ...LanguagesJsonData.en
};

if (!win.languages) {
    win.languages = {};
}

win.languages.en = languages;
