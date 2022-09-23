$(function(){
  const form = layui.form
  // 密码的校验
  form.verify({
    pwd: [ /^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'],
    samePwd:function(value){
      if(value === $('[name="oldPwd"]').val()) return '新旧密码不能一样'
    },
    rePwd:function(value){
      if(value !== $('[name="newPwd"]').val()) return '两次密码不一致,请重新输入！'
    }
  })

  // 更改密码功能
  $('.layui-form').on('submit',function(e){
    // 阻止默认提交行为
    e.preventDefault()
    // 发起请求，
    $.ajax({
      method:'POST',
      url:'/my/updatepwd',
      data:$(this).serialize(),
      success({status,message}){
        // 然后判断成功与否，打印提示
        if(status !== 0) return layui.layer.msg(message)
        // 打印提示
        layui.layer.msg(message)
        // 清空输入框的内容
        $('.layui-form')[0].reset()
      }
    })
  })
})