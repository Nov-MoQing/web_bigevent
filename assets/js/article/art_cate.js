$(function(){
  const layer = layui.layer
  const form = layui.form
  initArtCateList()
  // 获取文章类别的列表
  function initArtCateList(){
    $.ajax({
      method:'GET',
      url:'/my/article/cates',
      success(res){
        const htmlStr = template('tpl-table',res)
        $('.tbody').html(htmlStr)
      }
    })
  }

  // 点击添加类别实现弹出层效果
  // 关闭弹出层定义的
  let indexadd = null
  $('#btnAddCate').on('click',function(){
    // 使用layui里面的弹出层
    indexadd = layer.open({
      type:1,   // 没有下方按钮
      area: ['500px', '300px'],   // 宽高
      title: '文章类别管理'
      // 在页面里面放一个模板，然后有id选择器把内容追加进去
      ,content: $('#dialog-add').html()
    })
  })

  // 通过事件委托，为form-add表单绑定submit 事件
  $('body').on('submit','#form-add',function(e){
    e.preventDefault()
    $.ajax({
      method:'POST',
      url:'/my/article/addcates',
      data:$(this).serialize(),
      // 这里有错误好像是数据库的问题
      success({status,message}){
        if(status !== 0) return layer.msg(message)
        // 获取文章类别的列表
        initArtCateList()
        // 提示用户
        layer.msg(message)
        // 关闭弹出层
        layer.close(indexadd)
      }
    })
  })

  // 通过事件委托，为btn-edit表单绑定点击事件
  let indexEdit = null
  $('.tbody').on('click','#btn-edit',function(){
    // 使用layui里面的弹出层
    indexEdit = layer.open({
      type:1,   // 没有下方按钮
      area: ['500px', '300px'],   // 宽高
      title: '文章类别管理'
      // 在页面里面放一个模板，然后有id选择器把内容追加进去
      ,content: $('#dialog-edit').html()
    })

    // 为修改文章分类的弹出层填充表单数据
    const id = $(this).attr('dataId')
    $.ajax({
      method:'GET',
      url:'/my/article/cates/'  + id,
      success({data}) {
        // 使用layui里面的方法添加内容
        form.val('form-edit',data)
      }
    })
  })

  // 通过事件委托，为修改表单绑定submit 事件
  $('body').on('submit','#form-edit',function(e){
    e.preventDefault()
    $.ajax({
      method:'POST',
      url:'/my/article/updatecate',
      data:$(this).serialize(),
      success({status,message}){
        if(status !== 0) return layer.msg(message)
        layer.msg(message)
        // 关闭弹出层
        layui.close(indexEdit)
        // 重新渲染
        initArtCateList()
      }
    })
  })


  // 通过事件委托，为删除绑定点击 事件
  $('.tbody').on('click','#btn-delete',function(){
    // 获取自定义属性的值
    const id = $(this).attr('dataId')
    // layui里面的提问框
    layer.confirm('确认删除吗?', {icon: 3, title:'提示'}, function(index){
      $.ajax({
        method:'GET',
        url:'/my/article/deletecate/' + id,
        success({status,message}){
          if(status !== 0) return layer.msg(message)
          layer.msg(message)
          // 关闭提问框
          layer.close(index)
          // 渲染
          initArtCateList()
        }
      })
      
      
    })
  })
})