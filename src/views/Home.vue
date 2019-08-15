<template>
  <div class="home">
    <!-- 组件区 -->
    <div class="left">
      组件
      <div class="list">
        <draggable
          class="list-group"
          :list="componentsList"
          :sort="false"
          :group="{ name: 'people', pull: 'clone', put: false }"
          :clone="onClone"
          @change="onChange">
          <div
            class="list-group-item li"
            v-for="element in componentsList"
            :key="element.name"
          >
            {{ element.name }}
          </div>
        </draggable>
      </div>
    </div>
    <!-- 视窗区 -->
    <div class="center">
      视窗
        <!-- group要一致 -->
        <draggable
          class="list-group"
          v-bind="dragOptions"
          :list="componentsRender"
          group="people"
          @change="onChange"
          @add="onAdd"
          @choose="onChoose">
          <transition-group type="transition" :name="!drag ? 'flip-list' : null">
            <div
              class="list-group-item li view-li"
              v-for="(element, index) in componentsRender"
              :key="`${index}+1`"
            >
              <i class="close" @click="handleClose"> X </i>
              <component v-if="isComps(element.name)" :is="element.comps" :options="element.property" :isEdit="true"></component>
              <span v-else>{{ element.name }}</span>
            </div>
          </transition-group>
      </draggable>
    </div>
    <!-- 配置区 -->
    <div class="right">
      配置
      <div
        class="list-group-item li"
        v-for="(element, index) in activeComponentsOptions"
        :key="index"
      >
        <component
          :is="element.comps"
          :value="element.value"
          :renderId="element.renderId"
          @propertyChange="onPropertyChange"></component>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import draggable from 'vuedraggable';
let idGlobal = 8;
export default {
  name: "home",
  components: {
    draggable,
  },

  data() {
    return {
      drag: false,
      activeComps: null, // 当前移动组件
      activeCompsIndex: null, // 当前移动组件层级
      activeComponentsOptions: [], // 当前移动组件的配置信息
      activeCompsRenderId: null, // 当前配置组件的渲染id
      allComponentsList: ['TopTitle', 'HelloWorld', 'Title', 'other1', 'other2'], // 组件库信息数据遍历取name 固定数据
      componentsList: [ // 组件区  组件库信息数据截取 固定数据
        {
          name: "HelloWorld",
          id: 1,
          property: {
            msg: '123',
            styleObject: {
              background: '#fff',
            }
          }
        },
        {
          name: "Title",
          id: 2,
          property: {
            msg: '标题改',
            styleObject: {
              color: 'red',
              fontSize: '14px'
            }
          }
        },
        { name: "凑数1", id: 3 },
        { name: "凑数2", id: 4 },
        { name: "凑数3", id: 5 },
        { name: "凑数4", id: 6 },
        { name: "凑数5", id: 7 },
        { name: "凑数6", id: 8 },
      ],
      componentsRender: [ // 拖拽后需要渲染的组件
        {
          renderId: '0',
          name: "TopTitle",
          id: 100,
          property: {
            msg: '',
            styleObject: {
              color: 'black',
              fontSize: '18px',
              background: '#f2f2f2',
              padding: '10px'
            }
          }
        }
      ]
    }
  },

  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    }
  },

  created () {
    this.requireComps();
  },

  methods: {
    onChange(evt) {
      // console.log(evt);
    },

    // 视窗区-监听拖拽内容增加
    onAdd(evt) {
      // 处理数据渲染配置项
      this.onActiveComponentsOptions(evt.newIndex);
      this.requireComps()
    },

    // 拖拽复制回调 custom clone
    onClone(evt) {
      // 为新增项添加唯一标识
      // 深拷贝 否则同一组件指向相同，赋予的值永远为最后一次的赋值
      let cloneComps = JSON.parse(JSON.stringify(evt))
      Object.assign(cloneComps, {
        renderId: `${new Date().getTime()}`
      })
      return cloneComps
    },

    // 选中
    onChoose(evt) {
      // console.log('chose', evt, this.componentsRender[evt.oldIndex].renderId);
      this.activeCompsIndex = evt.oldIndex;
      this.onActiveComponentsOptions(evt.oldIndex);
    },

    // 计算当前组件有的配置项
    onActiveComponentsOptions(index) {
      // 处理数据渲染配置项
      // 初始 清空配置项
      this.activeComponentsOptions = [];
      let catchActiveComps = this.activeComps = this.componentsRender[index];
      // 记录当前操作组件渲染id
      this.activeCompsRenderId = catchActiveComps.renderId;
      if(catchActiveComps.property) {
        let activeCompsObj = catchActiveComps.property.styleObject || '';
        // 将单样式键值对展开，方便独立渲染 样式配置组件
        for (let [key, val] of Object.entries(activeCompsObj)) {
          let optionsItem = {
            name: key,
            value: val
          }
          this.activeComponentsOptions.push(optionsItem)
        }

        this.requireOptionsComps();
      }
    },

    // 动态加载组件-视窗
    requireComps() {
      this.componentsRender.forEach(item => {
        this.$set(item, 'comps',
          function(resolve) {
            require([`../components/labs/${item.name}.vue`], resolve)
          }
        )
        // console.log(item);
      })
    },

    // 动态加载组件-配置区
    requireOptionsComps() {
      this.activeComponentsOptions.forEach(item => {
        this.$set(item, 'comps',
          function(resolve) {
            require([`../components/options/${item.name}.vue`], resolve)
          }
        )
        // console.log(item);
      })
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

    // 配置值修改双向绑定 传递
    onPropertyChange(obj) {
      for (let item of this.componentsRender) {
        if (this.activeComps.name === item.name && this.activeCompsRenderId === item.renderId) {
          // 处理数据
          let styleObject = item.property.styleObject;
          // 覆盖
          Object.assign(styleObject, obj);
          break;
        }
      }
    },

    // 删除组件
    handleClose() {
      // console.log('delete');
      this.componentsRender.splice(this.activeCompsIndex, 1);
      // 初始 清空配置项
      this.activeComponentsOptions = [];
    },

  }
};
</script>

<style lang="scss">
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.home {
  display: flex;
  height: 80vh;
  .center {
    flex: 2;
    border: 1px solid skyblue;
    height: 100%;
    box-sizing: border-box;
    overflow-y: scroll;
  }
  .right, .left {
    flex: 1;
    border: 1px dashed #a0a0a0;
  }
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
    margin: 0;
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
