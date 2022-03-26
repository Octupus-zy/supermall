<template>
  <grid-view>
    <goods-list-item v-for="(item,index) in categoryData" :goods-item="item" :key="index"/>
  </grid-view>
</template>

<script>
import GoodsListItem from "@/components/content/goods/GoodsListItem";
import GridView from "@/components/common/gridView/GridView";

export default {
  name: "CategoryDetail",
  props: {
    categoryData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  components: {
    GoodsListItem,
    GridView
  }
}
</script>

<style scoped>

</style>
