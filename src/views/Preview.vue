<template>
  <div class="about">
    <h1>This is an preview page</h1>
    <iframe
      :src="src"
      rameborder="1"
      width="392"
      height="667"
      ref="iframe"
      @load="sendMessage"></iframe>
    <div @click="sendMessage">刷新</div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default {
  data() {
    return {
      src: 'http://localhost:8081/#/'
    }
  },

  computed: {
    ...mapState([
      'renderData',
    ]),
  },

  created() {
    // 没有数据传递时，取本地缓存数据
    if(this.renderData.length === 0 && localStorage.getItem('previewRenderData')) {
      let data = JSON.parse(localStorage.getItem('previewRenderData'))
      this.cacheComponentsRender(data);
    }
  },

  methods: {
    ...mapMutations([
      'cacheComponentsRender',
    ]),

    // 给iframe发送数据
    sendMessage() {
      let data = JSON.stringify(this.renderData);
      console.log('send:', data);
      this.$refs.iframe.contentWindow.postMessage(data, this.src);
    }
  }
}
</script>
