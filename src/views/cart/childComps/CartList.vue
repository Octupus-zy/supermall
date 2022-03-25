<template>
  <div class="cart-list" :isFCount="isCount">
    <scroll class="content" ref="scroll">
      <cart-list-item v-for="(item,index) in list"
                      :itemInfo="item"
                      :key="index"/>
    </scroll>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Scroll from "@/components/common/scroll/Scroll";
import CartListItem from "@/views/cart/childComps/CartListItem";

export default {
  name: "CartList",
  components: {
    Scroll,
    CartListItem,
  },
  data() {
    return {
      isCount: false
    }
  },
  computed: {
    ...mapGetters({
      list: 'cartList'
    })
  },
  activated() {
    // console.log('视口刷新');
    this.$refs.scroll.refresh()
  },
}
</script>

<style scoped>

.cart-list {
  height: calc(100% - 44px - 49px - 40px);
  width: 100%;
  position: fixed;
}

.content {
  height: 100%;
  overflow: hidden;
}
</style>
