$(function () {
  const layer = layui.layer
  const form = layui.form

  // 调用文章分类的方法
  initCate()
  // 初始化富文本编辑器
  initEditor()
  // 加载文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success(res) {
        if (res.status !== 0) return layer.msg(res.message)
        // 调用模板引擎渲染页面
        const htmlStr = template('tpl-cate', res)
        $('[name="cate_id"]').html(htmlStr)
        // 一定要调用form.render()否则不显示下拉分类
        form.render()
      }
    })
  }

  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)
  // 为选择封面的按钮，添加点击事件
  $('#btnChooseTmage').on('click', function () {
    $('#coverFile').click()
  })

  // 
  $('#coverFile').on('change', function (e) {
    // 获取到图片
    const files = e.target.files
    // r判断是否选择文件
    if (files.length === 0) return
    // 根据选择的文件，创建一个对应的 URL 地址
    const newImgURL = URL.createObjectURL(files[0])
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域
  })


  // 定义文章发布状态的默认值
  let art_status = '已发布'

  // 为存为草稿按钮，绑定点击事件处理函数
  $('#btnSave2').on('click', function () {
    // 点击存为草稿按钮，把发布状态改为'草稿'
    art_status = '草稿'
  })


  // 给表单绑定submit事件
  $('#form-pub').on('submit', function (e) {
    // 阻止默认行为
    e.preventDefault()
    // 基于form表单，快速创建一个FormData 对象
    const fd = new FormData($('#form-pub')[0])
    // 把状态添加到fd数据里面
    fd.append('state', art_status)
    // 将封面裁剪后的图片，输出为一个文件对象
    $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {       
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，将对象追加到fd里面
        fd.append('cover_img',blob)
        // 发起ajax请求函数
        publishArticle(fd)
      })
  })

  function publishArticle(data) {
    $.ajax({
      method:'POST',
      url:'/my/article/add',
      data,
      // 注意:如果向服务器提交的是FormData 格式的数据，必须添加以下两个配置项
      contentType:false,
      processData:false,
      // 判断
      success(res){
        if(res.status !== 0) return layer.msg(res.message)
        layer.msg(res.message)
        // 跳转到文章列表
        location.href = './art_list.html'
      }
    })
  } 
})  