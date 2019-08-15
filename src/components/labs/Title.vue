<template>
  <div
    class="title"
    :style="options.styleObject">
    {{options.msg || '这是标题这是标题这是标题'}}
  </div>
</template>

<script>
export default {
  name: "Title",
  props: ['options']
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
