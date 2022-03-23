<template>
  <div id="home" class="wrapper">
    <!--头部标题-->
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <!--固定tabControl-->
    <tab-control :titles="['流行', '新款', '精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control" v-show="isTabFixed"/>
    <scroll class="content" ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <!--轮播图-->
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <!--圆形区域-->
      <recommend-view :recommends="recommends"/>
      <!--图片-->
      <feature-view/>
      <!--分类选项-->
      <tab-control :titles="['流行','新款','精选']"
                   @tabClick="tabClick"
                   ref="tabControl2"/>
      <!--商品列表-->
      <goods-list :goods="showGoods"/>
    </scroll>
    <!--在我们需要监听一个组件的原生事件时,必须给对应的事件加上.native修饰符,才能进行监听-->
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
// 导入组件
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/HomeRecommendView";
import FeatureView from "./childComps/FeatureView";

import NavBar from "@/components/common/navbar/NavBar";
import TabControl from "@/components/content/tabControl/TabControl";
import GoodsList from "@/components/content/goods/GoodsList";
import GoodsListItem from "@/components/content/goods/GoodsListItem";
import Scroll from "@/components/common/scroll/Scroll";
import BackTop from "@/components/content/backTop/BackTop";

import {getHomeGoods, getHomeMultidata} from "@/network/home";
import {debounce} from "@/common/utils";

export default {
  name: "home",
  components: {
    NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodsList,
    GoodsListItem,
    Scroll,
    BackTop
  },
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop': {page: 0, list: []},
        'new': {page: 0, list: []},
        'sell': {page: 0, list: []},
      },
      currentType: 'pop',
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0
    }
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    },
  },
  destroyed() {
    // console.log('destroyed');
  },
  activated() {
    // console.log('activated');
    this.$refs.scroll.scrollTo(0, this.saveY, 0)
    // 刷新位置一次防止出现bug
    this.$refs.scroll.refresh()
  },
  deactivated() {
    // console.log('deactivated');
    this.saveY = this.$refs.scroll.getScrollY()
  },

  created() {
    // 1.请求多个数据
    this.getHomeMultidata()
    // 2.请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },
  mounted() {
    // 1.1.监听item中图片加载完成(无防抖动)
    // this.$bus.$on('itemImageLoad', () => {
    //   // 将要刷新30次
    //   this.$refs.scroll.refresh()
    // })

    // 1.2.监听item中图片加载完成(添加防抖动)
    const refresh = debounce(this.$refs.scroll.refresh, 100)
    this.$bus.$on('itemImageLoad', () => {
      refresh()
    })

    // 这里取吸顶tab的敢高度不准确,因为轮播图的图片还未加载出来
    // console.log(this.$refs.tabControl.$el.offsetTop);
  },
  methods: {
    //事件监听相关的方法
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
          break
      }
      // 让两个选中的['流行','新款','精选']保持一致
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl1.currentIndex = index;
    },
    backClick() {
      //(0,0,500):x,y:(0,0),500ms
      // this.$refs.scroll.scrollTo(0, 0,500)
      this.$refs.scroll.scrollTo(0, 0)
    },
    contentScroll(position) {
      // 1.判断BackTop是否显示
      this.isShowBackTop = (-position.y) > 1000

      // 2.决定tabControl是否吸顶(position: fixed)
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    loadMore() {
      this.getHomeGoods(this.currentType)
    },
    // 2.获取tabControl的offsetTop
    // 所有的组件都有一个属性$el:用于获取组件中的元素
    swiperImageLoad() {
      // console.log(this.$refs.tabControl.$el.offsetTop);
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    },

    //网络请求相关方法
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      })
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1
      getHomeGoods(type, page).then(res => {
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1

        // 完成上拉加载更多
        this.$refs.scroll.finishPullUp()
      })
    }
  }
}
</script>

<style scoped>
#home {
  /*滚动区域方案一*/
  /*viewport height*/
  /*padding-top: 44px;*/

  /*滚动区域方案二*/
  position: relative;
  height: 100vh;
}

.home-nav {
  background-color: var(--color-tint);
  color: #fff;

  /*在使用浏览器原生滚动时, 为了让导航不跟随一起滚动*/
  /*position: fixed;*/
  /*left: 0;*/
  /*right: 0;*/
  /*top: 0;*/
  /*z-index: 9;*/
}

.tab-control {
  position: relative;
  z-index: 9;
}

/*.fixed{*/
/*  position: fixed;*/
/*  left: 0;*/
/*  right: 0;*/
/*  top: 44px;*/
/*}*/

/*原生固定效果*/
/*.tab-control {*/
/*  !*滚动到某一位置时,将模块固定*!*/
/*  position: sticky;*/
/*  top: 44px;*/
/*  z-index: 9;*/
/*}*/

/*滚动区域方案一*/
/*.content {*/
/*  height: calc(100% - 93px);*/
/*  overflow: hidden;*/
/*  margin-top: 44px;*/
/*}*/

/*滚动区域方案二*/
.content {
  overflow: hidden;

  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}

</style>
