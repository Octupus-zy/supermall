// 首页面向这个模块开发
import {request} from "./request"

export function getHomeMultidata() {
  return request({
    url: '/home/multidata',
  })
}

export function getHomeGoods(type, page) {
  return request({
    url: '/home/data',
    params: {
      type,
      page,
    }
  })
}
