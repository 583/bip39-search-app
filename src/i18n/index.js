import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    appTitle: 'BIP39 Search',
    searchPlaceholder: 'Enter word or binary string',
    position: 'Position',
    binary: 'Binary',
    word: 'Word',
    noResult: 'No result found',
    close: 'Close'
  },
  zh: {
    appTitle: 'BIP39 搜索',
    searchPlaceholder: '输入单词或二进制字符串',
    position: '位置',
    binary: '二进制',
    word: '单词',
    noResult: '未找到结果',
    close: '关闭'
  }
};

export const i18n = createI18n({
  legacy: false,
  locale: 'zh', // 默认语言
  messages,
});

// 导出一个修改语言的方法
export function setLocale(locale) {
  i18n.global.locale.value = locale;
}