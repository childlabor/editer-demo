<template>
  <div
    class="background-color"
    >
    背景颜色：<input type="text" v-model="bgColorValue">
  </div>
</template>

<script>
export default {
  name: "background",
  props: ['value'],

  data() {
    return {
      newBgColorValue: null
    }
  },

  computed: {
    bgColorValue: {
      get: function () {
        return this.value
      },
      set: function (newValue) {
        this.newBgColorValue = newValue
        let obj = {
          background: newValue
        }
        this.$emit('propertyChange', obj)
      }
    }
  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.color {
  width: 80%;
  margin: 0 auto 20px;
}
</style>
