
const mongoose = require('mongoose')


mongoose.connect(`mongodb://127.0.0.1:27017/mongopractice`)


const userSchema =  new mongoose.Schema({
    name : String,
    email: String,
    password: String,
})

const bookuserSchema =  new mongoose.Schema({
    name : String,
    phone: Number,
    bookname: String,
    author: String,
    price: Number
})

module.exports =  mongoose.model("user", userSchema)
module.exports =  mongoose.model("bookuser", bookuserSchema)