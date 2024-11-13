
const mongoose = require('mongoose')


mongoose.connect(`mongodb://127.0.0.1:27017/mongopractice`)


const  userSchema =  new mongoose.Schema({
    name : String,
    email: String,
    password: String,
    isVerified: { type: Boolean, default: false }, // New field for email verification
    verificationToken: String // Token for email verification
});

const User = mongoose.model('User ', userSchema);
 const bookSchema = new mongoose.Schema({
    name: String,
    phone: Number,
    bookname: String,
    author: String,
    price: Number,
    city : String
 })
 
const Book = mongoose.model('Book', bookSchema);

module.exports = {
    User,
    Book
}