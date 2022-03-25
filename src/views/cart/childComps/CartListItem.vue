<template>
  <div id="shop-item" @click.prevent="countNotShow">
    <div class="item-selector">
      <check-button :is-check="itemInfo.checked" @click.native="checkClick"/>
    </div>
    <div class="item-img">
      <img :src="itemInfo.image" alt="商品图片">
    </div>
    <div class="item-info">
      <div class="item-title">{{ itemInfo.title }}</div>
      <div class="item-desc">商品描述: {{ itemInfo.desc }}</div>
      <div class="info-bottom">
        <div class="item-price left">{{ itemInfo.price }}</div>
        <!--购物车加减按钮显示-->
        <div class="item-count right">
          <div v-if="isCount" @click.stop="countShow">
            <span class="text-count txt">x{{ itemInfo.count }}</span>
          </div>
          <div v-else>
            <button class="btn-sub" @click.stop="sub" :disabled="itemInfo.count <= 1">-</button>
            <span class="text-count">x{{ itemInfo.count }}</span>
            <button class="btn-add" @click.stop="add">+</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import CheckButton from "@/components/common/checkButton/CheckButton";

export default {
  name: "CartListItem",
  components: {
    CheckButton
  },
  props: {
    itemInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      isCount: true,
      adds: false,
      subs: false,
      shows: false,
    }
  },
  methods: {
    add() {
      this.itemInfo.count++
    },
    sub() {
      this.itemInfo.count--
    },
    checkClick() {
      this.itemInfo.checked = !this.itemInfo.checked
    },
    countShow() {
      this.isCount = false
      console.log('切换');
    },
    countNotShow() {
      this.isCount = true
    }
  }
}
</script>

<style scoped>
#shop-item {
  width: 100%;
  display: flex;
  font-size: 0;
  padding: 5px;
  border-bottom: 1px solid #ccc;
}

.item-selector {
  width: 14%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.item-title, .item-desc {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.item-img {
  padding: 5px;
  /*border: 1px solid #ccc;*/
}

.item-img img {
  width: 80px;
  height: 100px;
  display: block;
  border-radius: 5px;
}

.item-info {
  font-size: 17px;
  color: #333;
  padding: 5px 10px;
  position: relative;
  overflow: hidden;
}

.item-info .item-desc {
  font-size: 14px;
  color: #666;
  margin-top: 15px;
}

.info-bottom {
  margin-top: 10px;
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
}

.info-bottom .item-price {
  color: orangered;
}

.btn-sub {
  width: 25px;
  height: 25px;
  border: 1px solid #eee;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

.btn-add {
  width: 25px;
  height: 25px;
  border: 1px solid #eee;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}

.txt {
  margin-right: 25px;
}

.text-count {
  display: inline-block;
  padding-top: 2px;
  text-align: center;
  width: 40px;
  height: 25px;
  border: 1px solid #eee;
}
</style>
