
const mongoose = require('mongoose')
require("dotenv").config()

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    tlsInsecure: false // Only set to true if testing with self-signed certificates
  })
const { v4: uuidv4 } = require('uuid'); // If using UUID

const generateSellerId = () => {
    return uuidv4().replace(/-/g, '').substring(0, 24); // Remove hyphens and take first 24 characters
};

console.log(generateSellerId()); // Example output: "h9dfk2j3t9u1bxs5yqlv9v"

const  userSchema =  new mongoose.Schema({
    name : String,
    email: String,
    password: String,
    isVerified: { type: Boolean, default: false }, // New field for email verification
    verificationToken: String // Token for email verification
});

const User = mongoose.model('User ', userSchema);
 const bookSchema = new mongoose.Schema({
    sellerId: { 
        type: String, 
        default: () => generateSellerId()  // Call generateSellerId() to create a random 24-character ID
    },
    name: String,
    phone: Number,
    bookname: String,
    author: String,
    price: Number,
    city : String,
    image: {
        type: String,
        default: null   // Default to null if no image is provided
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically set the creation date
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }


 })
 
const Book = mongoose.model('Book', bookSchema);
const messageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);
module.exports = {
    User,
    Book,
    Message
}