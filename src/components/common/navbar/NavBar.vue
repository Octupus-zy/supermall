<template>
  <div class="nav-bar">
    <div class="left">
      <slot name="left"></slot>
    </div>
    <div class="center">
      <slot name="center"></slot>
    </div>
    <div class="right">
      <slot class="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavBar"
}
</script>

<style scoped>

.nav-bar {
  display: flex;
  /*高度,line-height可以直接将导航撑起来*/
  line-height: 44px;
  height: 44px;
  text-align: center;
  box-shadow: 0 1px 1px rgba(100, 100, 100, 0.1);
}

.left, .right {
  width: 60px;
}

.center {
  /*占据全部剩余部分*/
  flex: 1;
}

</style>
