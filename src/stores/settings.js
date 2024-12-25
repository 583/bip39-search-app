import { defineStore } from 'pinia';
import { setLocale } from '../i18n';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    currentLanguage: 'zh'
  }),

  actions: {
    toggleLanguage() {
      const newLang = this.currentLanguage === 'zh' ? 'en' : 'zh';
      this.currentLanguage = newLang;
      setLocale(newLang);
    },

    setLanguage(lang) {
      this.currentLanguage = lang;
      setLocale(lang);
    }
  },

  persist: {
    key: 'settings',
    storage: localStorage
  }
}); 
