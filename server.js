const {User}=require('./schema')
const express = require('express')


const JWT = require('./JWT')


const app = express()
app.use(express.json())
app.use(express.static('src'));


let bodyParser = require('body-parser')
let path = require('path');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/api/users',async(req, res) =>{
    const users = await User.find()
    res.send(users)
})

app.post('/api/register',async(req, res) => {
    console.log("reqbody:")
    console.log(req.body)
    try{
      const userInDB =  await User.findOne({
        email :req.body.email
      })
      if (userInDB){
        res.send({
          msg:'该邮箱已被注册'
        })
      }
      const user = await User.create({
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
      })

      return res.send({
        msg:'注册成功'
      })

    } catch (e){
      console.log(e)
    }

})

app.post('/api/login',async(req, res) => {
    const user = await User.findOne({
        email : req.body.email
    })
    if(!user){
        return res.send({
            msg: '用户名不存在'
        })
    }
    const isPasswordValid = require('bcrypt').compareSync(
        req.body.password, user.password)
    if(!isPasswordValid){
        return res.send({
            msg: '密码无效'
        })
    }
    //生成token
    const token = JWT.generate({
        id: String(user._id),
        email: String(user.email),
    }, "10s")
    // console.log(token)
    res.header("Authorization", token)
    res.send({user, msg:'登录成功', token})
})



app.listen(3003,() => {
    console.log('http://localhost:3003/html/login.html')
})
