<template>
  <div class="app">
    <div class="header">
      <van-nav-bar :title="t('appTitle')">
        <template #right>
          <van-button size="small" @click="toggleLanguage">
            {{ settingsStore.currentLanguage === 'zh' ? 'English' : '中文' }}
          </van-button>
        </template>
      </van-nav-bar>
    </div>
    
    <div class="search-container">
      <van-search
        v-model="searchText"
        :placeholder="t('searchPlaceholder')"
        clearable
        @search="onSearch"
        @input="onSearch"
        @click="showKeyboard = true"
      />
      
      <div v-if="wordsStore.isLoading" class="loading">
        <van-loading type="spinner" />
      </div>
      
      <div class="result" v-else-if="wordsStore.searchResult">
        <van-cell-group>
          <van-cell :title="t('position')" :value="wordsStore.searchResult.position" />
          <van-cell :title="t('binary')" :value="wordsStore.searchResult.binary" />
          <van-cell :title="t('word')" :value="wordsStore.searchResult.word" />
        </van-cell-group>
      

      <!-- 添加二进制详细显示 -->
      <div class="binary-detail">
          <div class="binary-string">
            <span 
              v-for="(bit, index) in wordsStore.searchResult.binary" 
              :key="index"
              :class="bit === '0' ? 'bit-zero' : 'bit-one'"
            >
              {{ bit }}
            </span>
          </div>
          <div class="binary-count">
            <template v-for="(count, index) in getBinaryCounts(wordsStore.searchResult.binary)" :key="index">
              <span :class="count.bit === '0' ? 'count-zero' : 'count-one'" :style="'box-shadow: 0 0 2px 2px #000000 ;margin:0;display:inline-block;width:'+count.count*30+'px;background-color:'+(count.bit==='0'?'#ffffff':'#000000')+';color:'+(count.bit==='0'?'#000000':'#ffffff')">
                {{ count.count }}
              </span>
            </template>
          </div>
          <div class="word-detail">
            <div class="word-detail-word">{{ wordsStore.searchResult.word }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 自定义全键盘 -->
    <div class="custom-keyboard" v-show="showKeyboard">
      <div class="keyboard-row">
        <van-button 
          v-for="key in '1234567890'"
          :key="key"
          size="small"
          @click="onKeyboardInput(key)"
        >{{ key }}</van-button>
      </div>
      <div class="keyboard-row">
        <van-button 
          v-for="key in 'qwertyuiop'"
          :key="key"
          size="small"
          @click="onKeyboardInput(key)"
        >{{ key }}</van-button>
      </div>
      <div class="keyboard-row">
        <van-button 
          v-for="key in 'asdfghjkl'"
          :key="key"
          size="small"
          @click="onKeyboardInput(key)"
        >{{ key }}</van-button>
      </div>
      <div class="keyboard-row">
        <van-button 
          v-for="key in 'zxcvbnm'"
          :key="key"
          size="small"
          @click="onKeyboardInput(key)"
        >{{ key }}</van-button>
        <van-button 
          size="small"
          @click="onKeyboardDelete"
        >DEL</van-button>
      </div>
      <div class="keyboard-row">
        <van-button 
          size="small" 
          block 
          @click="showKeyboard = false"
        >{{ t('close') }}</van-button>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useWordsStore } from './stores/words';
import { useSettingsStore } from './stores/settings';

const { t } = useI18n();
const searchText = ref('');
const wordsStore = useWordsStore();
const settingsStore = useSettingsStore();
const showKeyboard = ref(false);

onMounted(async () => {
  // 等待 store 初始化完成
  await Promise.resolve();
  wordsStore.loadWords();
  settingsStore.setLanguage(settingsStore.currentLanguage);
});

const onSearch = () => {
  wordsStore.search(searchText.value);
};

const toggleLanguage = () => {
  settingsStore.toggleLanguage();
};

// 键盘输入处理
const onKeyboardInput = (key) => {
  searchText.value += key;
  onSearch();
};

// 删除键处理
const onKeyboardDelete = () => {
  searchText.value = searchText.value.slice(0, -1);
  onSearch();
};

// 添加计算连续位数的函数
const getBinaryCounts = (binary) => {
  const counts = [];
  let currentBit = binary[0];
  let count = 1;

  for (let i = 1; i < binary.length; i++) {
    if (binary[i] === currentBit) {
      count++;
    } else {
      counts.push({ bit: currentBit, count });
      currentBit = binary[i];
      count = 1;
    }
  }
  counts.push({ bit: currentBit, count });
  
  return counts;
};
</script>

<style scoped>
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.search-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.result {
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
}
/* 自定义键盘样式 */
.custom-keyboard {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #f5f5f5;
  padding: 10px;
  z-index: 999;
}

.keyboard-row {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-bottom: 4px;
}

.keyboard-row .van-button {
  flex: 1;
  height: 44px;
  max-width: 40px;
  text-transform: uppercase;
}

.keyboard-row:last-child .van-button {
  max-width: none;
}

.search-container :deep(.van-search) {
  width: 100%;
  height: 44px;
}


.binary-detail {
  margin-top: 20px;
  text-align: center;
}

.binary-string {
  font-size: 24px;
  letter-spacing: 4px;
  margin-bottom: 16px;
  
}

.bit-zero, .bit-one {
  width: 30px;
  height: 30px;
  line-height: 30px;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  margin: 0;  /* 移除外边距 */
  box-shadow: 0 0 2px 2px #000000;  /* 添加阴影 */
}

.bit-zero {
  color: #000000;
  background-color: #ffffff;
}

.bit-one {
  color: #ffffff;
  background-color: #000000;
}

.binary-count {
  font-size: 10px;
}

.count-zero {
  color: #aaaaaa;
  margin: 0 2px;
}

.count-one {
  color: #000000;
  margin: 0 2px;
}

.word-detail-word{
  font-size: 36px;
  font-weight: bold;
  color: #000000;
  margin-top: 16px;
  text-align: center;
}
</style> 
