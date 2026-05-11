import { I18n } from 'i18n-js';
import hi from './hi.json';
import en from './en.json';

const i18n = new I18n({
  hi,
  en,
});

i18n.defaultLocale = 'hi';
i18n.locale = 'hi';
i18n.enableFallback = true;

export default i18n;