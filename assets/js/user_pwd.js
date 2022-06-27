$(function () {
    var layer = layui.layer
    var form = layui.form

    // 定义用户密码的校验规则
    form.verify({
        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pwd: [/^[\S]{6,12}$/,'密码必须6到12位,且不能出现空格'],
        samePwd: value => {
            if(value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同!'
            }
        },
        rePwd: function(value){
            if(value !== $('[name=newPwd]').val()) {
                return '两次密码不一致'
            }
        }
    })

    $('.layui-form').on('submit',function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success : res => {
                if(res.status !== 0){
                    return layer.msg('更新密码失败!')
                }
                layer.msg('更新密码成功!')
            }
        })
    })

})