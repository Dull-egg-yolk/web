import Vue from 'vue';
import VueI18n from 'vue-i18n';
import en from './lang/en';
import { getUrlCountry } from '@/util/config';

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: 'en', // 设置语言环境
  fallbackLocale: 'en',
  messages: { en }, // 设置语言环境信息
});

// 自动根据浏览器系统语言设置语言
function getLang () {
  const navLang = navigator.language;
  let locale = navLang.toLocaleLowerCase();
  locale = locale.split('-');
  locale = locale[0];
  console.log('-----当前使用的语言------', locale);
  return getUrlCountry() || locale;
}

const loadedLanguages = ['en']; // 我们的预装默认语言

function setI18nLanguage (lang) {
  i18n.locale = lang;
  document.querySelector('html').setAttribute('lang', lang);
  return lang;
}

export function loadLanguageAsync (lang) {
  lang = lang || getLang();

  // 如果语言相同
  if (i18n.locale === lang) {
    return Promise.resolve(setI18nLanguage(lang));
  }

  // 如果语言已经加载
  if (loadedLanguages.includes(lang)) {
    return Promise.resolve(setI18nLanguage(lang));
  }

  // 如果尚未加载语言
  return import(
    /* webpackChunkName: "lang-[request]" */ `./lang/${lang}.js`
  ).then((messages) => {
    i18n.setLocaleMessage(lang, messages.default);
    loadedLanguages.push(lang);
    return setI18nLanguage(lang);
  });
}

loadLanguageAsync();

export default i18n;
