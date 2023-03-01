
$().ready(function (){
  $.ajax({
    type: 'POST',
    url: '/api/admin',
    dataType : 'json',
    beforeSend :function (request) {
      request.setRequestHeader('authorization',localStorage.getItem('token'))
    },
    success: function (result) {
      if (result.msg === "token valid") {

        let account = result.account
        document.getElementById('header-account-text').innerText = account + "  | "
        document.getElementById('log-opt').innerText = 'Log Out'
        console.log(account)

      } else {
        document.getElementById('log-opt').innerText = 'Log In'
        alert(result.msg);
      }
    },
    error: function (data) {
      console.log(data.msg)
    }
  })

})

function logOut(){
  document.getElementById('header-account-text').innerText = 'Visitor'+ "  | "
  localStorage.removeItem('token')
  location.href = "http://localhost:3003/html/login.html"
}




