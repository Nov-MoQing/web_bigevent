$(function () {
  const layer = layui.layer

  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)

  // 上传按钮点击事件
  $('#btnChooseImage').on('click', function () {
    // 点击文件上传
    $('#file').click()
  })

  // 给文件绑定change事件
  $('#file').on('change', function (e) {
    // 拿到用户选择的文件的
    const filelist = e.target.files
    console.log(filelist)
    // 有点小bug
    if (!filelist.length) return layer.msg('请选择你要上传的照片！')
    // 拿到用户选择的文件
    const file = e.target.files[0]
    // 将文件，转化为路径
    const imgUrl = URL.createObjectURL(file)
    // 重新初始化裁剪区域
    // 销毁旧的裁剪区域,重新设置图片路径,重新初始化裁剪区域
    $image.cropper('destroy').attr('src', imgUrl).cropper(options)
  })

  $('#btnUpload').on('click', function () {
    // 创建一个 Canvas 画布
    var dataURL = $image.cropper('getCroppedCanvas', {
      width: 100,
      height: 100
      // // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    }).toDataURL('image/png')
    // 调用接口把图片上传到服务器上面
    $.ajax({
      method:'POST',
      url:'/my/update/avatar',
      data:{ avatar:dataURL },
      success({ status,message }){
        if(status !== 0) return layer.msg(message)
        layer.msg(message)
        window.parent.getUserInfo()
      }
    })
  })
})