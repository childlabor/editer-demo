<template>
  <div
    class="padding"
    >
    padding：<input type="text" v-model="cValue">px
  </div>
</template>

<script>
export default {
  name: "padding",
  props: ['value'],

  data() {
    return {
      newValue: null
    }
  },

  computed: {
    cValue: {
      get: function () {
        return this.value.replace('px', '')
      },
      set: function (newVal) {
        this.newValue = newVal
        let obj = {
          padding: `${newVal}px`
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
