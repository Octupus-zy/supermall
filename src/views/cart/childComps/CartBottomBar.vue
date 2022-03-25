<template>
  <div class="bottom-bar">

    <div class="check-content">
      <check-button
        class="check-button"
        :is-checked="isSelectAll"
        @click.native="checkClick"/>
      <span>全选</span>
    </div>

    <div class="price">
      合计: {{ totalPrice }}
    </div>

    <div class="calculate">
      去计算({{ checkLength }})
    </div>

  </div>
</template>

<script>

import CheckButton from "@/components/common/checkButton/CheckButton";
import {mapGetters} from 'vuex'

export default {
  name: "CartBottomBar",
  components: {
    CheckButton,
  },
  computed: {
    ...mapGetters(["cartList"]),
    totalPrice() {
      return '￥' + this.cartList.filter(item => {
        return item.checked
      }).reduce((preValue, item) => {
        return preValue + item.price * item.count
      }, 0)
    },
    checkLength() {
      return this.cartList.filter(item => item.checked).length
    },
    isSelectAll() {
      // 1.使用filter
      // return !(this.cartList.filter(item => !item.checked).length)

      // 2.使用find
      // if (this.cartList.length === 0) return false
      // return !this.cartList.find(item => !item.checked)

      // 3.循环遍历
      for (let item of this.cartList) {
        if (!item.checked) {
          return false
        }
      }
      return true
    }
  },
  methods: {
    checkClick() {
      if (this.isSelectAll) { //全部选中
        this.cartList.forEach(item => item.checked = false)
      } else { //全部未选或者部分未选
        this.cartList.forEach(item => item.checked = true)
      }
    }
  }
}
</script>

<style scoped>
.bottom-bar {
  position: fixed;
  height: 40px;
  bottom: 49px;
  right: 0;
  left: 0;
  line-height: 40px;
  background-color: #eee;
  display: flex;

}

.check-content {
  display: flex;
  align-items: center;
  font-size: 13px;
  margin-left: 10px;
  width: 60px;
}

.check-button {
  width: 20px;
  height: 20px;
  line-height: 20px;
  margin-right: 10px;
}

.price {
  margin-left: 20px;
  flex: 1;
}

.calculate {
  width: 100px;
  background-color: var(--color-tint);
  text-align: center;
  color: #fff;
}

</style>
