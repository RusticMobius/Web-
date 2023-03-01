const mongoose = require('mongoose')
mongoose.connect('mongodb://root:123456@localhost:27017/hw5?authSource=admin',function (err){
  if(err){
    console.warn('数据库连接失败：'+err);
  }else {
    console.log('数据库连接成功');
  }
})


const UserSchema = new mongoose.Schema({
    email: {type: String, unique: true},
    phone : {type: String},
    password: {
        type: String, set(val){
               return require('bcrypt').hashSync(val, 10)
        }
    },
})
const User = mongoose.model('User', UserSchema)

User.collection.dropIndexes()

module.exports = { User }
