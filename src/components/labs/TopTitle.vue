<template>
  <div
    class="top-title"
    :style="options.styleObject">
    {{options.msg || '默认头部标题栏'}}
  </div>
</template>

<script>
export default {
  name: "TopTitle",
  props: ['options']

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
