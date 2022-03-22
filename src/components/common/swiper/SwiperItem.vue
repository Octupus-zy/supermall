<template>
  <div class="slide">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Slide",
}
</script>

<style scoped>
.slide {
  width: 100%;
  /*用来“吸收”超出的空间*/
  flex-shrink: 0;
}

.slide img {
  width: 100%;
}

</style>
