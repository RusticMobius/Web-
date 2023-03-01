// 随机数生成函数
function randomNumber(min,max) {
  return parseInt(Math.random()*(max - min) + min)
}

// 随机生成颜色函数
function randomColor(min,max) {
  let r = randomNumber(min,max)
  let g = randomNumber(min,max)
  let b = randomNumber(min,max)
  return `rgb(${r},${g},${b})`
}

// 随机字符串
const allCodes = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

let c_height = 60
let c_width = 160

let canvas = document.getElementById('validate-pic')
//用于存储验证码
let vCode = ['a','b','c','d']

function generateVerificationCode() {

  let ctx = canvas.getContext('2d')
  // 数字越大颜色越浅
  // canvas背景
  ctx.fillStyle = randomColor(180,230)
  ctx.fillRect(0,0,c_width,c_height)
  for(let i = 0; i < 4; i++){
    // 随机选择字符
    let character = allCodes[randomNumber(0,allCodes.length)]
    vCode[i] = character
    // 随机设置字符大小
    let charSize = randomNumber(36,50)
    // 随机生成字符旋转角度
    let angle = randomNumber(-30,30)
    // 设置字符字体
    ctx.font = charSize + 'px sans-serif'
    // 设置填充基线
    ctx.textBaseline = 'top'
    // 随机字符颜色
    ctx.fillStyle = randomColor(60,150)
    ctx.save()
    // 位移 水平，竖直
    ctx.translate(32*i + 20 , 10)
    // 旋转
    ctx.rotate(angle * Math.PI/180)
    ctx.fillText(character, 0,0)
    ctx.restore()
  }
  // 生成干扰线
  for(let j = 0; j < 15; j++){
    ctx.beginPath()
    ctx.moveTo(randomNumber(0,c_width),randomNumber(0,c_height))
    ctx.lineTo(randomNumber(0,c_width),randomNumber(0,c_height))
    ctx.strokeStyle = randomColor(160,210)
    ctx.closePath()
    ctx.stroke()
  }
  // 随机产生干扰点
  for(let k = 0; k < 100; k++){
    ctx.beginPath()
    ctx.arc(randomNumber(0,c_width),randomNumber(0,c_height),1,0,2*Math.PI)
    ctx.closePath()
    ctx.fillStyle = randomColor(120,200)
    ctx.fill()
  }
  // console.log(vCode)

}

generateVerificationCode()

$().ready(function (){

  $('#submit').click(function () {

    if($('#id').val() === '' ||
       $('#password').val() === '' ){
      alert("用户名和密码不能为空!")
      return false
    }else if($('#validate').val() === ''){
      alert("请输入验证码")
      return false
    }else if($('#validate').val().toLowerCase() !== vCode.join('').toLowerCase()){
      alert("验证码输入错误")
      document.getElementById("#validate").value = ''
      generateVerificationCode()
      return false
    }else{
      //submit
      let user = {
        email : escape($('#id').val()),
        password : escape($('#password').val())

      }
      $.ajax({
        type: 'POST',
        url: '/api/login',
        data: user,
        success: function (data) {
          if (data.msg === '登录成功') {
            console.log(data.token)
            localStorage.setItem('token',data.token)
            // document.cookie = "token=" + data.token
            alert("登录成功")
            parent.document.location.href = "../html/gallery.html"
          } else {
            alert(data.msg);
          }
        },
        error: function (data) {
          console.log(data.msg)
        }
      })
      return false
    }
  })
})
