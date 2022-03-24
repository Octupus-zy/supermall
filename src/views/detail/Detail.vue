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
      <detail-base-info :goods="goods"/>
      <!--店铺信息-->
      <detail-shop-info :shop="shop"/>
      <!--商品信息-->
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <!--参数信息-->
      <detail-param-info :param-info="paramInfo" ref="params"/>
      <!--评价信息-->
      <detail-comment-info :comment-info="commentInfo" ref="comment"/>
      <!--推荐信息-->
      <goods-list :goods="recommends" @load="imageLoad" ref="recommend"/>
    </scroll>
    <!--返回-->
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
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

import GoodsList from "@/components/content/goods/GoodsList";
import BackTop from "@/components/content/backTop/BackTop";
import Scroll from '@/components/common/scroll/Scroll'

import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "@/network/detail";

import {itemListenerMixin} from "@/common/mixin";
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
    Scroll,
    DetailCommentInfo,
    GoodsList,
    BackTop
  },
  // 混入函数
  mixins: [itemListenerMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0,
      isShowBackTop: false,
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
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
      // 4.创建店铺信息的对象
      this.shop = new Shop(data.shopInfo)
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
      this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      console.log(this.themeTopYs);
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
      for (let i = 0; i < length; i++) {
        if (this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) || (i === length - 1 && positionY >= this.themeTopYs[i]))) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex
          console.log(this.currentIndex);
        }
      }
      // 2.判断BackTop是否显示
      this.isShowBackTop = (-position.y) > 1000

    },
    titleClick(index) {
      // console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 300)
    },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0)
    },
  }
}
</script>

<style scoped>
/*隐藏tabbar*/
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.content {
  height: calc(100% - 44px);
}

</style>
