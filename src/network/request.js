import asiox from "axios"

export function request(config, success, faiture) {
  const instance = asiox.create({
    baseURL:'https://www.fastmock.site/mock/e486e6b0f3ac26c4cf51f7e0b51526d5/supermall',
    timeout: 5000
  })
  instance.interceptors.request.use(config => {
    return config
    // console.log('成功');
  }, err => {
    // console.log('失败');
  })
  instance.interceptors.response.use(config => {
    return config.data
    // console.log('成功');
  }, err => {
    // console.log('失败');
  })

  return instance(config)

}
