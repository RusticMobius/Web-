$().ready(function () {
  console.log("register....")
  $('#submit').click(function (){
    let user = {
      email: $('#email').val(),
      phone: $('#phone').val(),
      password: $('#password').val(),
      password2: $('#re-password').val()
    }

    console.log(user)

    //非空检查

    if (user.phone === "" || !user.phone) {
      alert('请输入电话号码')
      return false
    }

    if (user.email === "" || !user.email) {
      alert('请输入邮箱地址')
      return false
    }
    if (user.password === "" || !user.password) {
      alert('请输入密码')
      return false
    }

    if (user.password.length < 8) {
      alert('密码长度应不少于8位')
      return false
    }

    //两次密码
    if (user.password!==user.password2) {
      alert('两次密码输入不一致')
      return false
    }

    $.ajax({
      type: 'POST',
      url: '/api/register',
      data: user,
      error: function (data) {
        console.log('error!: '+data.msg)
      },
      success: function (data) {
        if (data.msg == '注册成功'){
          alert(data.msg)
          parent.document.location.href = "../html/login.html"
        } else {
          alert(data.msg);
        }
      }
    })
    return false

  })
})
