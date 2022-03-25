<template>
  <div id="detail">
    <!--导航栏-->
    <detail-nav-bar @titleClick="titleClick" ref="nav"/>
    <!--滚动区域-->
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll">
      <!--轮播图-->
      <detail-swiper :top-images="topImages"/>
      <!--基本信息-->
      <detail-base-info :goodsInfo="goodsInfo"/>
      <!--店铺信息-->
      <detail-shop-info :shopInfo="shopInfo"/>
      <!--商品信息-->
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <!--参数信息-->
      <detail-param-info :param-info="paramInfo" ref="params"/>
      <!--评价信息-->
      <detail-comment-info :comment-info="commentInfo" ref="comment"/>
      <!--推荐信息-->
      <goods-list :goods="recommends" @load="imageLoad" ref="recommend"/>
    </scroll>
    <!--底部功能栏-->
    <detail-bottom-bar @addToCart="addToCart"/>
    <!--返回-->
    <back-top @click.native="backTop" v-show="isShowBackTop"/>
  </div>
</template>

<script>
import DetailNavBar from '@/views/detail/childComps/DetailNavBar'
import DetailSwiper from '@/views/detail/childComps/DetailSwiper'
import DetailBaseInfo from '@/views/detail/childComps/DetailBaseInfo'
import DetailShopInfo from '@/views/detail/childComps/DetailShopInfo'
import DetailGoodsInfo from '@/views/detail/childComps/DetailGoodsInfo'
import DetailParamInfo from '@/views/detail/childComps/DetailParamInfo'
import DetailCommentInfo from "@/views/detail/childComps/DetailCommentInfo";
import DetailBottomBar from "@/views/detail/childComps/DetailBottomBar";

import GoodsList from "@/components/content/goods/GoodsList";
import Scroll from '@/components/common/scroll/Scroll'

import {getDetail, getRecommend, Goods, GoodsParam, Shop} from "@/network/detail";

import {backTopMixin, itemListenerMixin} from "@/common/mixin";
import {BACKTOP_DISTANCE} from "@/common/const";

import {debounce} from "@/common/utils";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
  },
  // 图片加载监听混入函数/backTop事件混入
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goodsInfo: {},
      shopInfo: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0,
    }
  },
  created() {
    // 1.保存传入的iid
    this.iid = this.$route.params.iid

    // 2.根据iid请求详情数据
    getDetail(this.iid).then(res => {
      // 1.获取顶部的图片轮播数据
      // console.log(res);
      const data = res.result;
      // 2.取出轮播图的数据
      this.topImages = data.itemInfo.topImages
      // 3.获取商品信息
      this.goodsInfo = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
      // 4.创建店铺信息的对象
      this.shopInfo = new Shop(data.shopInfo)
      // 5.保存商品的详情数据
      this.detailInfo = data.detailInfo;
      // 6.获取参数的信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
      // 7.取出评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }
    })

    // 3.请求推荐数据
    getRecommend().then(res => {
      // console.log(res);
      this.recommends = res.data.list
    })

    // 给getThemeTioY赋值,并加上防抖
    this.getThemeTopY = debounce(() => {
      // 根据最新的数据,对应的DOM是已经被渲染出来
      // 但是图片依然是没有加载完(目前获取到offsetTop不包含其中的图片).
      // offset Top值不对的时候,都是因为图片的问题
      this.themeTopYs = []
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop - 44)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop - 44)
      this.themeTopYs.push(Number.MAX_VALUE)
      // console.log(this.themeTopYs);
    }, 100)
  },
  mounted() {
    // 该处用混入函数代替
    // const refresh = debounce(this.$refs.scroll.refresh, 100)
    //
    // this.itemImgListener = () => {
    //   refresh()
    // }
    // this.$bus.$off('itemImageLoad',this.itemImgListener)
  },
  destroyed() {
    this.$bus.$off('itemImageLoad', this.itemImgListener)
  },
  methods: {
    imageLoad() {
      this.refresh()
      this.getThemeTopY()
    },
    contentScroll(position) {
      // 1.获取标题位置
      // console.log(position);
      // 0, 2826, 738, 4182
      const positionY = -position.y

      let length = this.themeTopYs.length
      // 1.1.普通做法
      // for (let i = 0; i < length; i++) {
      //   if (this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) || (i === length - 1 && positionY >= this.themeTopYs[i]))) {
      //     this.currentIndex = i;
      //     this.$refs.nav.currentIndex = this.currentIndex
      //     console.log(this.currentIndex);
      //   }
      // }

      // 1.2.加入最大值
      for (let i = 0; i < length - 1; i++) {
        if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex
          console.log(this.currentIndex);
        }
      }

      // 2.判断BackTop是否显示
      this.isShowBackTop = (-position.y) > BACKTOP_DISTANCE
    },
    titleClick(index) {
      // console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 300)
    },
    addToCart() {
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goodsInfo.title;
      product.desc = this.goodsInfo.desc;
      product.price = this.goodsInfo.realPrice;
      product.iid = this.iid;

      // this.$store.commit('addToCart',product)
      this.$store.dispatch('addToCart', product)
    }
  }
}
</script>

<style scoped>
/*隐藏tabbar*/
/*relative会脱离文档流*/
#detail {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.content {
  height: calc(100% - 44px - 49px);
}

</style>
