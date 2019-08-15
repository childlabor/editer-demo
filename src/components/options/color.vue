<template>
  <div
    class="color"
    >
    颜色：<input type="text" v-model="colorValue">
  </div>
</template>

<script>
export default {
  name: "color",
  props: ['value'],

  data() {
    return {
      newColorValue: null
    }
  },

  computed: {
    colorValue: {
      get: function () {
        return this.value
      },
      set: function (newValue) {
        this.newColorValue = newValue
        let obj = {
          color: newValue
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
