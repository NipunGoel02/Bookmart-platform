
const mongoose = require('mongoose')


mongoose.connect(`mongodb://127.0.0.1:27018/mongopractice`)


const userSchema =  new mongoose.Schema({
    name : String,
    phone: Number,
    bookname: String,
    author: String,
    price: Number
})


module.exports =  mongoose.model("bookuser", userSchema)