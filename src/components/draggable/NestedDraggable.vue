<template>
  <draggable
    class="list-group"
    :list="componentsRenderData"
    :group="{ name: 'g1' }"
    @choose="handleChoose"
    @change="handleChange"
  >
    <div
      class="list-group-item li view-li"
      v-for="(element, index) in componentsRenderData"
      :key="`${index}+1`"
      :data-renderid="element.renderId"
    >
      <i v-if="isClose" class="close" @click="handleClose"> X </i>
      <p style="text-align: left;">{{`组件树：${element.name}`}}</p>
      <component
      v-if="isComps(element.name)"
        :is="element.comps"
        :options="element.property"
        :isEdit="true" />
      <span v-else>{{ element.name }}</span>
      <nested-draggable
        :componentsRenderData="element.childs" />
    </div>
    <!-- <transition-group type="transition" :name="!drag ? 'flip-list' : null">
    </transition-group> -->
  </draggable>
</template>
<script>
import draggable from "vuedraggable";
import { mapState, mapMutations } from 'vuex';

export default {
  name: "nested-draggable",

  props: {
    componentsRenderData: {
      required: true
    }
  },

  components: {
    draggable
  },

  data() {
    return {
      drag: false,
      isClose: true,
      allComponentsList: ['TopTitle', 'HelloWorld', 'Title', 'other1', 'other2'], // 组件库信息数据遍历取name 固定数据
    }
  },

  computed: {
    ...mapState([
      'renderData',
      'activeRenderData',
      'activeComponentsOptions'
    ]),
  },

  created() {
    // console.log(this.componentsRenderData)
  },

  methods: {
    ...mapMutations([
      'matchTargetData',
      'stateChange',
      'setActiveRenderData',
      'setActiveComponentsOptions'
    ]),

    // 渲染时将renderid以自定义属性存入div中，回调能获取到数据
    handleChoose(evt) {
      this.matchTargetData(evt.item.dataset.renderid);
    },

    // 删除组件 evt拖拽插件自带需要占位 否则会覆盖第一个参数
    handleClose(evt, arr=this.renderData) {
      for (let [index, item] of Object.entries(arr)) {
          if (this.activeRenderData.renderId === item.renderId) {
            arr.splice(index, 1)
            break;
          }
          else if(item.childs) {
            this.handleClose(evt, item.childs)
          }
        }
      // 清空配置项
      this.setActiveComponentsOptions([]);
    },

    handleChange(evt) {
      // console.log('change', evt);
      // 新增
      if(evt.added) {
        this.setActiveRenderData(evt.added.element);
      }
      this.stateChange();
    },

    // 匹配是否有该组件
    isComps(val) {
      for (let item of this.allComponentsList) {
        if (val === item) {
          return true
          break; // 匹配到后立马跳出 减少计算
        }
      }
    },
  }

};
</script>
<style lang="scss" scoped>
.list-group {
  padding-left: 20px;
  min-height: 50px;
  box-sizing: border-box;
  .li {
    list-style: none;
    // float: left;
    margin: 10px;
    padding: 10px;
    border: 1px solid #a0a0a0;
    cursor: pointer;
  }
  .view-li {
    position: relative;
    padding: 0;
    border-style: dashed;
    .close {
      visibility: hidden;
      display: inline-block;
      position: absolute;
      width: 20px;
      height: 20px;
      top: 0;
      right: 0;
      z-index: 999;
    }
    &:hover {
      .close {
        visibility: visible;
      }
    }
  }
}
</style>