$(function(){
  const form = layui.form
  const layer = layui.layer
  // 定义昵称规则
  form.verify({
    nickname:function(value){
      if(value.length > 6) return '昵称长度必须在1~6个字符之间'
    },
  })


  initUserInfo()
  // 获取基础用户信息
  function initUserInfo() {
    $.ajax({
      method:'GET',
      url:'/my/userinfo',
      success({status,message,data}){
        if(status !== 0) return layer.msg(message)
        // 使用form.val()为表单赋值
        form.val('formUserInfo',data)
      }
    })
  }

  // 重置表单内容
  $('#btnReset').on('click',function(e){
    // 阻止默认重置行为
    e.preventDefault()
    // 再次调用获取用户基础信息的函数渲染就可以l
    initUserInfo()
  })

  // 监听表单提交事件
  $('.layui-form').on('submit',function(e){
    e.preventDefault()  // 阻止默认提交事件
    $.ajax({   // 发起ajax数据请求
      method:'POST',  
      url:'/my/userinfo',
      data:$(this).serialize(),
      success({status,message}){
        // 成功与否的操作
        if(status !== 0) return layer.msg(message)
        layer.msg(message)
        // 子页面调用父页面用户信息的函数
        window.parent.getUserInfo()
      }
    })
  })
})