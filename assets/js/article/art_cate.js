// jQuery入口函数
// 等待文档中的标签加载完毕（不等待内容加载完毕），然后再执行入口函数中的代码。
$(function () {
    var form = layui.form 
    var layer = layui.layer
    initArtCateList()

    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: res => {
                // 模板引擎返回的字符串数据格式
                var htmlStr = template('tpl-table', res)
                // 渲染
                $('tbody').html(htmlStr)
            }
        })
    }
    var indexAdd = null
    // 添加类别按钮绑定 点击事件
    $('#btnAddCate').on('click', function () {
        // layui的弹出层
        indexAdd = layer.open({
            // 基本层类型
            type: 1,
            title: '添加文章分类',
            // 弹出层宽高，没有参数的时候自适应
            area: ['500px', '250px'],
            content: $('#dialog-AddCate').html()
        });
    })

    // 按钮点击后才会有弹出层，因此弹出层的dom元素是没办法直接获取的
    // 通过代理的形式，为 form-add 表单 绑定 submit 事件
    $('body').on('submit', '#form-add', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败！')
                }
                // 获取更新之后的文章分类的列表
                initArtCateList()
                layer.close(indexAdd)
                layer.msg('新增文章分类成功')
            }
        })
    })

    var indexEdit = null
    // 通过代理的形式，为编辑按钮 绑定 click 事件
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            // 弹出一个修改文章分类信息的层
            type: 1,
            title: '修改文章分类',
            // 弹出层宽高，没有参数的时候自适应
            area: ['500px', '250px'],
            content: $('#dialog-EditCate').html()
        })
        var id = $(this).attr('data-id')
        // 发起请求获取对应分类的数据
        $.ajax({
            method:'GET',
            url:'/my/article/cates/' + id,
            success: function(res){
                // 快速填充表单里面的数据
                // 给表单添加lay-filter 属性 
                // 语法 form.val('filter',object)
                form.val('form-edit',res.data)
            }
        })
    })

    // 通过代理的形式，为修改分类 绑定 submit 事件
    $('body').on('submit','#form-edit',function(e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url:'/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg("更新分类信息失败！")
                }
                layer.msg('更新分类信息成功！')
                initArtCateList()
                layer.close(indexEdit)
            }
        })
    })

    // 通过代理的形式，为删除按钮 绑定 click 事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        // 提示用户是否确认删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！')
                    }
                    layer.msg('删除文章分类成功！')
                    layer.close(index);
                    initArtCateList()
                }
            })
        })
    })
})

