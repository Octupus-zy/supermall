export function debounce(func, delay) {
  // 防抖操作
  // func:将需要执行防抖的函数传入进来
  // delay:将要等多久
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
