
// 封装jwt

const jwt = require('jsonwebtoken')
const SECRET = 'hsj'

let JWT = {
  // 生成token
  generate(value, time){
    return jwt.sign(value,SECRET,{expiresIn:time})
  },

  // 校验token
  verify(token){
    try {
      return jwt.verify(token,SECRET)
    } catch (error) {
      return false
    }
  }
}

module.exports = JWT
