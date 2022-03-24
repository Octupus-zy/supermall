<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  name: "Scroll",
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scroll: null
    }
  },
  mounted() {
    // 通过document.querySelector('.wrapper')获取wrapper元素不是特别好,通过ref获取更好
    // 1.创建BScroll对象
    this.scroll = new BScroll(this.$refs.wrapper, {
      click: true,
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad
    })

    // 2.监听滚动的位置
    if (this.probeType === 2 || this.probeType === 3) {
      this.scroll.on('scroll', (position) => {
        this.$emit('scroll', position)
      })
    }

    // 3.监听上拉事件
    if (this.pullUpLoad) {
      this.scroll.on('pullingUp', () => {
        this.$emit('pullingUp')
      })
    }
  },
  methods: {
    // 1.backTop操作
    scrollTo(x, y, time = 300) {
      this.scroll && this.scroll.scrollTo(x, y, time)
    },
    // 2.上拉操作
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp()
    },
    // 3.刷新操作
    refresh() {
      this.scroll && this.scroll.refresh()
      // console.log('----');
    },
    // 4.获取位置
    getScrollY() {
      return this.scroll ? this.scroll.y : 0
    }
  }
}
</script>

<style scoped>

</style>
