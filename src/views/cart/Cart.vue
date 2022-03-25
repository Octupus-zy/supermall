<template>
  <div class="cart">
    <!--导航-->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{ length }})</div>
    </nav-bar>
    <!--商品的列表-->
    <cart-list/>
    <!--底部汇总-->
    <cart-bottom-bar/>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";

import CartList from "@/views/cart/childComps/CartList";
import CartBottomBar from "@/views/cart/childComps/CartBottomBar";
// mapGetters:辅助函数仅仅是将 store 中的 getter 映射到局部计算属性
import {mapGetters} from 'vuex'

export default {
  name: "Cart",
  data() {
    return {
      count: 0
    }
  },
  components: {
    NavBar,
    CartList,
    CartBottomBar,
  },
  computed: {
    //第一种写法
    // ...mapGetters(['CartLength', 'cartList']),
    //第二种写法(自定义名称)
    ...mapGetters({
      length: 'CartLength'
    }),
  }
}
</script>

<style scoped>
.nav-bar {
  background-color: var(--color-tint);
  color: #fff;
  /*加粗*/
  /*font-weight: 708;*/
}

</style>
