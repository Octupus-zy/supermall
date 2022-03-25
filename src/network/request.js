import asiox from "axios"

export function request(config, success, faiture) {
  const instance = asiox.create({
    baseURL: 'http://152.136.185.210:7878/api/hy66',
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
