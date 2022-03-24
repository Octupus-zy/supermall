import {debounce} from "@/common/utils";

export const itemListenerMixin = {
  data(){
    return{
      itemImgListener: null,
      refresh: null
    }
  },
  mounted(){
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
