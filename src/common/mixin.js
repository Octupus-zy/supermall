import {debounce} from "@/common/utils";
import BackTop from "@/components/content/backTop/BackTop";


// 图片加载完刷新视图混入
export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null,
      refresh: null
    }
  },
  mounted() {
    // 1.监听item中图片加载完成(添加防抖动)
    this.refresh = debounce(this.$refs.scroll.refresh, 100)
    // 对监听事件进行保存
    this.itemImgListener = () => {
      this.refresh()
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener)
    // console.log('我是混入');
  }
}

// backTop混入函数
export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backTop() {
      //(0,0,500):x,y:(0,0),500ms
      // this.$refs.scroll.scrollTo(0, 0,500)
      this.$refs.scroll.scrollTo(0, 0, 300)
    },
  }
}
