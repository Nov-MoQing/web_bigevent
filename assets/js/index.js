$(function () {
  // 调用getUserInfo()获取用户的基本信息
  getUserInfo()

  // 要不要都一样，反正都能实现
  const layer = layui.layer
  // 退出a标签绑定点击事件   退出功能
  $('#btnLogout').on('click',function(){
    // 提示用户是否要退出
    layer.confirm('您确认要退出吗?', {icon: 3, title:'提示'}, function(index){
      // 把浏览器里面的本地存储删除
      localStorage.removeItem('token')
      // 跳转到登录页面
      location.href = './login.html'
      // 关闭提示框
      layer.close(index);
    });
  })
})

// 获取用户的基本信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    // headers是请求头配置对象
    // headers: {
    //   Authorization: localStorage.getItem('token') || ''
    // },
    success({ status, message, data }) {
      if (status !== 0) return layui.layer.msg(message)
      // 调用渲染头像函数
      renderAvatar(data)
    },
    /* complete({responseJSON:{status,message}}){
      // console.log(res)
      // 在complete回调函数使用 responseJSON 服务器返回的错误信息，进行判断
      if(status===1&&message==='身份认证失败！') {
        // 强制删除token
        localStorage.removeItem('token')
        // 强制跳转到登录页面
        location.href = './login.html'
      }
    } */
  })
}

// 渲染用户头像，解构了
function renderAvatar({ username, nickname, user_pic }) {
  // 获取用户的昵称，昵称 或者 用户名
  const name = nickname || username
  // 设置欢迎的文本
  $('#welcome').html(`欢迎&nbsp&nbsp${name}`)
  // 判断如果图片不为空，就渲染图片并显示
  if (user_pic !== null) {
    $('.layui-nav-img').attr('src', user_pic).show()
    $('.text-avatar').hide()
  } else {  // 否则就隐藏并且显示用户名的第一个字母大写，渲染文本
    $('.layui-nav-img').hide()
    // 字符串也可以用下标选择
    const first = name[0].toUpperCase()
    $('.text-avatar').html(first).show()
  }
}