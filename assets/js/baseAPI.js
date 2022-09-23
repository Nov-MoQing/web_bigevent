//注意:每次调用$.get() 或$.post() 或$.ajax() 的时候,
//会先调用ajaxPrefilter 这个函数
//在这个函数中，可以拿到我们给Ajax提供的配置对象

$.ajaxPrefilter(function (options) {
  // 在发起真正的Ajax 请求之前，统一拼接请求的根路径
  options.url = 'http://www.liulongbin.top:3007' + options.url
  // console.log(options.url)
  
  // 统一为有权限的接口，设置headers 请求头
  // 没有/my/就不会执行
  if(options.url.indexOf(/my/) !== -1) {
    options.headers = {
        Authorization: localStorage.getItem('token') || ''
      }
  }


  // 全局配置挂载complete回调函数
  options.complete = function({responseJSON:{status,message}}){
    // console.log(res)
    // 在complete回调函数使用 responseJSON 服务器返回的错误信息，进行判断
    if(status===1&&message==='身份认证失败！') {
      // 强制删除token
      localStorage.removeItem('token')
      // 强制跳转到登录页面
      location.href = './login.html'
    }
  }
})