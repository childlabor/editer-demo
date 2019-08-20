<template>
  <div class="home">
    <div class="edit-box">
      <!-- 组件区 -->
      <div class="left">
        组件
        <div class="list">
          <draggable
            class="list-group"
            :list="componentsList"
            :sort="false"
            :group="{ name: 'g1', pull: 'clone', put: false }"
            :clone="onClone"
          >
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
        <!-- 多重嵌套 -->
        <nested-draggable
          :componentsRenderData="componentsRender" />
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
            @propertyChange="onPropertyChange" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import draggable from 'vuedraggable';
import nestedDraggable from "../components/draggable/NestedDraggable";
import { mapState, mapMutations } from 'vuex';

export default {
  name: "home",
  components: {
    draggable,
    nestedDraggable
  },

  data() {
    return {
      drag: false,
      group: {
        name: 'g1'
      },
      activeComps: null, // 当前移动组件
      activeCompsIndex: null, // 当前移动组件层级
      activeCompsRenderId: null, // 当前配置组件的渲染id
      componentsList: [ // 组件区  组件库信息数据截取 固定数据
        {
          name: "HelloWorld",
          id: 1,
          property: {
            msg: '123',
            styleObject: {
              background: '#fff',
            }
          },
          // 有此字段的内部才能嵌套子组件
          childs: []
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
          },
          childs: [
            {
              renderId: '1',
              name: "Title",
              id: 2,
              property: {
                msg: '标题改',
                styleObject: {
                  color: 'red',
                  fontSize: '14px'
                }
              },
              childs: [
                {
                  renderId: '2',
                  name: "Title",
                  id: 2,
                  property: {
                    msg: '标题改2',
                    styleObject: {
                      color: 'red',
                      fontSize: '14px'
                    }
                  },
                  childs: []
                },
              ]
            },
          ]
        },
      ]
    }
  },

  computed: {
    ...mapState([
      'isChange',
      'renderData',
      'activeRenderData',
      'activeComponentsOptions'
    ]),
  },

  watch: {
    // 布局变化
    isChange(newValue) {
      if(newValue) {
        this.cacheComponentsRender(this.componentsRender);
      }
    },

    // 目标（当前组件渲染数据）变化
    activeRenderData(newValue) {
      // console.log('active',newValue);
      this.onActiveComponentsOptions(newValue)
    },

  },

  created () {
    this.requireComps(this.componentsRender);
    this.cacheComponentsRender(this.componentsRender);
  },

  methods: {
    ...mapMutations([
      'cacheComponentsRender',
      'stateChange',
      'matchTargetData',
      'setActiveComponentsOptions'
    ]),

    // 拖拽复制回调 custom clone
    onClone(evt) {
      // 为新增项添加唯一标识
      // 深拷贝 否则同一组件指向相同，赋予的值永远为最后一次的赋值
      let cloneComps = JSON.parse(JSON.stringify(evt))
      Object.assign(cloneComps, {
        renderId: `${new Date().getTime()}`,
        comps: function(resolve) {
          require([`../assets/demo_h5_lib/src/components/labs/${evt.name}.vue`], resolve)
        }
      })
      return cloneComps
    },

    // 处理数据渲染组件配置项
    onActiveComponentsOptions(item) {
      // 初始 清空配置项
      this.setActiveComponentsOptions([]);
      this.activeComps = item;
      // 记录当前操作组件渲染id
      this.activeCompsRenderId = item.renderId;
      if(item.property) {
        let activeCompsObj = item.property.styleObject || '';
        // 将单样式键值对展开，方便独立渲染 样式配置组件
        for (let [key, val] of Object.entries(activeCompsObj)) {
          let optionsItem = {
            name: key,
            value: val
          }
          this.setActiveComponentsOptions(optionsItem);
        }
        // 注册配置项组件
        this.requireOptionsComps();
      }
    },

    // 动态加载组件-视窗
    requireComps(renderObj) {
      renderObj.forEach(item => {
        // 存在组件名则动态加载组件
        if(item.name) {
          this.$set(item, 'comps',
            function(resolve) {
              require([`../assets/demo_h5_lib/src/components/labs/${item.name}.vue`], resolve)
            }
          )
        }
        // 存在嵌套 递归
        if(item.childs) {
          this.requireComps(item.childs);
        }
        // console.log(item);
      })
    },

    // 动态注册加载组件-配置区
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

    // 配置值修改双向绑定 传递
    onPropertyChange(data, obj=this.componentsRender) {
      for (let item of obj) {
        if (this.activeComps.name === item.name && this.activeComps.renderId === item.renderId) {
          // 处理数据
          let styleObject = item.property.styleObject;
          // 覆盖
          Object.assign(styleObject, data);
          break;
        } else if(item.childs) {
          this.onPropertyChange(data, item.childs);
        }
      }
    },

    logData() {
      console.log('提交数据', JSON.stringify(this.componentsRender))
    }

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
.edit-box {
  display: flex;
  height: 80vh;
  .center {
    flex: 2;
    border: 1px solid skyblue;
    height: 100%;
    padding-bottom: 50px;
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
