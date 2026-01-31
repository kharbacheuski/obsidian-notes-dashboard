import { EN } from "./locale/en";
import { RU } from "./locale/ru";

export type Locale = typeof EN;

export const Locales: { [k: string]: Locale } = {
    en: EN,
    ru: RU
};

let langCode: string = window.localStorage.getItem("language")
    ?.toLowerCase()
    ?.split("-")[0] || "en";

export let CURRENT_LOCALE: Locale = Locales[langCode]; 