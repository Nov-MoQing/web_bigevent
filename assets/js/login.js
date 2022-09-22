$(function(){
  // 点击去注册账号链接
  $('#link-reg').on('click',function(){
    $('.login-box').hide()
    $('.reg-box').show()
  })
  // 点击去登录链接
  $('#link-login').on('click',function(){
    $('.reg-box').hide()
    $('.login-box').show()
  })


  // 从 layui 中获取 form对象
  const form = layui.form
  const layer = layui.layer
  // 通过form.verify 函数自定义校验规则
  form.verify({
    // 自定义一个pwd的校验规则
    pwd: [/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'],
    // 校验两次密码是否一致的规则
    repwd:function(value) {
      // 通过形参拿到的是确认密码框中的内容，还需要拿到密码框中的内容，然后进行一次等于的判断
      // 如果判断失败，返回一个提示消息
      const pwd = $('.reg-box [name="repassword"]').val()
      if(pwd !== value) {
        return "两次密码不一致"
      }
    }
  })


  // 请求根路径
  // const url = 'http://www.liulongbin.top:3007'
  // 监听注册表单的注册事件
  $('#form-reg').on('submit',function(e){
    // 阻止默认提交
    e.preventDefault()
    $.ajax({
      method:'POST',
      url:`/api/reguser`,
      data:{
        // 提交的内容为 用户和密码 输入框的内容
        username:$('#form-reg [name="username"]').val(),
        password:$('#form-reg [name="password"]').val(),
      },
      success({status,message}){
        // 成功与否的提示用layui
        if(status !== 0) return layer.msg(message)
        layer.msg('注册成功,请登录!')
        // 模拟点击去登录按钮
        $('#link-login').click()
      }
    })
  })

  // 监听登录表单的事件
  $('#form-login').on('submit',function(e){
    e.preventDefault()
    $.ajax({
      method:'POST',
      url:`/api/login`,
      // 获取表单的所有内容
      data:$(this).serialize(),
      success({status,message,token}){
        // 判断对与否的操作
        if(status !== 0) return layer.msg(message) 
        layer.msg(message)
        // 把token字符串保存到浏览器localStorage里面
        localStorage.setItem('token',token)
        // 跳转页面
        location.href = './index.html'
      }
    })
  })
})