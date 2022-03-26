import {ADD_COUNTER, ADD_TO_CART} from "@/store/mutation-types";
// export const ADD_COUNTER = 'add_counter'
// export const ADD_TO_CART = 'addToCart'
export default {
  [ADD_COUNTER](state, payload) {
    payload.count++
  },
  [ADD_TO_CART](state, payload) {
    //记录添加到购物车的状态
    payload.checked = true
    state.cartList.push(payload)
  }
}
