const {User}=require('./models')
const jwt = require('jsonwebtoken')
const express = require('express')


const app = express()
app.use(express.json())
app.use(express.static('frontend'));

const SECRET = 'wxy'

var bodyParser = require('body-parser')
var path = require('path');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/api/users',async(req, res) =>{
    const users = await User.find()
    res.send(users)
})

app.post('/api/register',async(req, res) => {
    console.log(req.body)
    const userInDB =  await User.findOne({
        username:req.body.username
    })
    if (userInDB){
        res.send({
            msg:'用户名已存在'
        })
    }
    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
    })
    return res.send({
        msg:'注册成功'
    })
})

app.post('/api/login',async(req, res) => {
    const user = await User.findOne({
        username: req.body.username
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
    const jwt = require('jsonwebtoken')
    const token = jwt.sign({
        id: String(user._id),
    }, SECRET)
    res.send({user, msg:'登录成功', token})
})

const auth = async(req,res,next)=>{
    const raw = String(req.headers.authorization).split(' ').pop()
    const {id} = jwt.verify(raw, SECRET)
    req.user = await User.findById(id)
    next()
}

app.get('/api/profile', auth, async (req, res) =>{
    res.send(req.user)
})

app.listen(3003,() => {
    console.log('http://localhost:3003/html/login.html')
})
