import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    renderData: [], // 当前渲染的所有组件数据
    activeComponentsOptions: [], // 当前组件的配置(样式)信息
    isChange: false, // 渲染组件发生变化
    activeRenderData: null // 选中的渲染组件数据
  },

  mutations: {
    // 缓存所有组件数据
    cacheComponentsRender(state, payload) {
      state.renderData = payload
      state.isChange = false
      // console.log('cacheRenderData', state.renderData);
    },

    stateChange(state) {
      state.isChange = true
    },

    setActiveRenderData(state, payload) {
      state.activeRenderData = payload
    },

    setActiveComponentsOptions(state, payload) {
      // 传入空数组则清空，否则为追加
      if(payload.length === 0) { 
        state.activeComponentsOptions = []
      } else {
        state.activeComponentsOptions.push(payload)
      }
    },

    // 通过唯一值匹配数据
    matchTargetData(state, renderid, obj = state.renderData ) {
      recursive(state, renderid, obj);
      function recursive(state, renderid, obj) {
        if(obj.length === 0) return
        for (let item of obj) {
          if (renderid === item.renderId) {
            state.activeRenderData = item;
            // console.log('match', state.activeRenderData);
            break;
          }
          else if(item.childs) { // 递归
            recursive(state, renderid, item.childs);
          }
        }
      }
    },
  },

  actions: {}
});
