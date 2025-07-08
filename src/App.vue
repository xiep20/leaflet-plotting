<template>
  <div id="app">
    <router-view v-if="getFinished" />
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      getFinished: false
    };
  },
  mounted() {
    //调整根fontsize
    const computed = function () {
      let desW = 1024;
      const devW = document.documentElement.clientWidth
      document.documentElement.style.fontSize = devW / desW * 37.5 + 'px'
    }
    computed()
    window.addEventListener('resize', computed, false)
    this.configlist(); // 获取配置数据
  },
  methods: {
    // 获取配置数据
    async configlist() {
      let url = `config/config.json`;
      let res = await axios.get(url)
      if (res) {
        window.mapConfig = res.data
        this.getFinished = true
      }
    },
  },
};
</script>

<style lang="less">
html,
body {
  width: 100%;
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  // text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;

  .van-tabbar--fixed {
    z-index: 9999;
  }
}
</style>
