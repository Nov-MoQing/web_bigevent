$(function () {
  // 提示
  const layer = layui.layer
  // 表单
  const form = layui.form
  // 分页
  const laypage = layui.laypage
  // 定义美化时间的函数模板引擎
  template.defaults.imports.dateFormat = (date) => {
    let datas = new Date(date)
    const y = datas.getFullYear()
    const mo = (datas.getMonth() + 1 + '').padStart(2, '0')
    const d = (datas.getDate() + '').padStart(2, '0')
    const h = (datas.getHours() + '').padStart(2, '0')
    const m = (datas.getMinutes() + '').padStart(2, '0')
    const s = (datas.getSeconds() + '').padStart(2, '0')

    return `${y}-${mo}-${d} ${h}:${m}:${s}`
  }
  //定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
  const q = {
    pagenum: 1,  //页码值，默认请求第一页的数据
    pagesize: 2, //每页显示几条数据，默认每页显示2条
    cate_id: '', //文章分类的Id
    state: '',   //文章的发布状态
  }

  // 调用文章的列表数据方法
  initTable()
  // 调用文章分类数据方法
  initCate()



  // 获取文章的列表数据方法
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success(res) {
        if (res.status !== 0) return layer.msg(res.message)
        // 使用模板引擎渲染页面的数据
        const htmlStr = template('tpl-table', res)
        $('.td').html(htmlStr)
        // 调用渲染分页的方法
        renderPage(res.total)
      }
    })
  }


  // 获取文章分类数据方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success(res) {
        if (res.status !== 0) return layer.msg(res.message)
        // 使用模板引擎渲染页面
        const htmlStr = template('tpl-cate', res)
        $('[name="cate_id"]').html(htmlStr)
        // 因为layui的渲染机制，在第一次没有内容，就渲染空的，然后异步的插入内容layui监听不到，所以要重新渲染一次form表单区域
        form.render()
      }
    })
  }


  // 为筛选表单添加submit事件
  $('#form-search').on('submit', (e) => {
    e.preventDefault()
    // 获取表单选中项的值
    const cate_id = $('[name="cate_id"]').val()
    const state = $('[name="state"]').val()
    // 为查询参数对象q中对应的属性赋值
    q.cate_id = cate_id
    q.state = state
    // 调用文章的列表数据方法
    initTable()
  })


  // 定义渲染分页的方法
  function renderPage(total) {
    // console.log(total)
    //执行一个laypage实例来渲染分页的结构
    laypage.render({
      elem: 'pageBox',  // 容器ID
      count: total,     // 数据总条数
      limit: q.pagesize,   // 每页显示几条数据
      curr: q.pagenum,    // 默认选中的页数
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      // 分页发生切换的时候，触发的jump回调
      //触发jump回调的方式有两种:
      // 1.点击页码的时候，会触发jump回调
      // 2.只要调用了laypage.render方法就会触发jump回调
      jump: function (obj, first) {
        // console.log(obj.curr) 
        // console.log(first)
        // console.log(obj.limit)
        //把最新的页码值，赋值到q这个查询参数对象中
        q.pagenum = obj.curr
        //把最新的条目数，赋值到q这个查询参数对象的pagesize属性中
        q.pagesize = obj.limit
        // 根据最新的q获取对应的数据列表，并渲染表格
        // 可以通过first 的值，来判断是通过哪种方式，触发的jump 回调
        // 如果first 的值为true, 证明是方式2触发的
        // 否则就是方式1触发的
        if (!first) initTable()
      }
    })
  }


  //通过代理的形式，为删除按钮绑定点击事件处理函数
  $('.td').on('click', '.btn-delete', function () {
    let leng = $('.btn-delete').length
    // 获取每条数据的id
    let id = $(this).attr('del')
    // layui里面的弹出框
    layer.confirm('你确认要删除吗?', { icon: 3, title: '提示' }, function (index) {
      //do something
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success(res) {
          console.log(res)
          if (res.status !== 0) return layer.msg(res.message)
          layer.msg(res.message)
          //当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据，如果没有剩余的数据了，则让页码值-1之后，再重新调用initTable 方法 ，
          if (leng === 1) {
            //如果leng的值等于1，证明删除完毕之后，页面上就没有任何数据，页码值最小必须是1、

            // 长度等于1的时候就说明删除完就没有数据了，页码的值等于1的时候就不能减了，不等于一才可以减，让页码跳到上一页
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          // 调用文章的列表数据方法
          initTable()
        }
      })
      // 关闭弹窗
      layer.close(index);
    })
  })
})