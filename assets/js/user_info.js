$(function() {
    var form = layui.form
    var layer = layui.layer

    form.verify({
        nickname: function(value) {
            if(value.length > 6){
                return '昵称必须在 1~6 个字符之间'
            }
        }
    })

    // 调用 initUserInfo 函数
    initUserInfo()

    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: "GET",
            url:'/my/userinfo',
            success: res=>{
                if(res.status !== 0){
                    return layer.msg('获取用户信息失败!')
                }
                // console.log(res.data);
                // 调用 form.val() 快速为表单赋值
                form.val('formUserInfo', res.data);
                $('')
            }
        })
    }

    // 重置表单的数据 
    $('#btnReset').click(e=>{
        // 阻止表单的默认重置行为
        e.preventDefault()
        initUserInfo()
    })

    // 监听表单的提交事件
    $('.layui-form').on('submit',function(e){
        // 阻止表单的默认提交行为
        e.preventDefault()
        form.val()
        // 发起 ajax 数据请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: res=>{
                if(res.status !== 0){
                    return layer.msg('更新用户信息失败!')
                }
                layer.msg('更新用户信息成功!')
                // 调用父页面的方法,重新渲染用户的头像和用户的信息
                // 通过window.parent
                window.parent.getUserInfo()
            }
        })
    })
})