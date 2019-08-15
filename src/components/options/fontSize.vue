<!-- 因为数据格式通用 此处组件名格式统一单驼峰 -->
<template>
  <div
    class="font-size"
    >
    字体大小：<input type="text" v-model="sizeValue">px
  </div>
</template>

<script>
export default {
  name: "fontSize",

  props: ['value'],

  data() {
    return {
      newSizeValue: null
    }
  },

  computed: {
    sizeValue: {
      get: function () {
        return this.value.replace('px', '')
      },
      set: function (newValue) {
        this.newSizeValue = newValue
        let obj = {
          fontSize: `${this.newSizeValue}px`
        }        
        this.$emit('propertyChange', obj)
      }
    }
  },


};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.font-size {
  width: 80%;
  margin: 0 auto 20px;
}
</style>
