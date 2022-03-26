import {ADD_COUNTER, ADD_TO_CART} from "@/store/mutation-types";

export default {
  addCart(context, payload) {
    // state.cartList.push(payload)
    // payload新添加的商品
    // let oldproduct = null
    // for (let item of state.cartList){
    //   if (item.iid === payload.iid){
    //     oldProduct = item;
    //   }
    // }
    return new Promise((resolve, reject) => {
      // 1.查找之前数组中是否有给商品
      // count在cartList没有这个商品的时候直接给payload一个count属性这样来的
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
      // 2.判断oldProduct
      if (oldProduct) { // 数量加一
        // oldProduct.count += 1
        context.commit(ADD_COUNTER, oldProduct)
        resolve('购物车 +1')
      } else { // 添加新商品
        payload.count = 1
        // state.cartList.push(payload)
        context.commit(ADD_TO_CART, payload)
        resolve('添加到购物车')
      }
    })

  }
}
