const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const { User, Book, Message } = require('./model'); // Added Message to the import
const nodemailer = require('nodemailer');
const session = require('express-session');
const multer = require("multer");
const crypto = require("crypto");
const fs = require('fs');
const http = require('http'); // Import http module
const socketIo = require('socket.io'); // Import socket.io
const uploadDir = path.join(__dirname, 'public', 'images', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const server = http.createServer(app);
const io = socketIo(server); // Initialize Socket.IO with the server
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12, function (err, name) {
            const fn = name.toString("hex") + path.extname(file.originalname);
            cb(null, fn);
        });
    }
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.get("/", function (req, res) {
    res.render("index", { user: req.session.user });
});

app.get("/signup", function (req, res) {
    res.render("signup page");
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nipungoel909@gmail.com',
        pass: 'rrek hwbj rlzu nnww'
    }
});

app.post("/create", async function (req, res) {
    let { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const verificationToken = jwt.sign({ email }, "verification_secret", { expiresIn: '1h' });

    const user = new User({
        name,
        email,
        password: hash,
        verificationToken
    });
    await user.save();

    const verificationUrl = `http://localhost:3000/verify-email?token=${verificationToken}`;
    await transporter.sendMail({
        to: email,
        subject: 'Email Verification',
        html: `<p>Please verify your email by clicking on the link: <a href="${verificationUrl}">Verify Email</a></p>`
    });

    res.redirect("/signup");
});

app.get('/verify-email', async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).send("Token is required");
    }

    try {
        const decoded = jwt.verify(token, "verification_secret");
        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.status(400).send("User not found");
        }

        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        res.send("Email verified successfully");
    } catch (error) {
        console.error(error);
        res.status(400).send("Invalid or expired token");
    }
});

function isLoggedIn(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect("/signup");
    }
}

app.get("/login", isLoggedIn, function(req,res){
    res.render("After_login")
})

app.post("/login", async function (req, res) {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.send("Something went wrong");

    if (!user.isVerified) return res.send("Please verify your email before logging in");

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (isMatch) {
        req.session.user = { email: user.email, id: user._id };
        const token = jwt.sign({ email: user.email, id: user._id }, "shhhhhh");
        res.cookie("token", token);
        res.redirect("/");
    } else {
        res.send("Invalid password");
    }
});

app.get("/buy", isLoggedIn, function (req, res) {
    res.render("Buy");
});

app.get("/sell", isLoggedIn, function (req, res) {
    res.render("Sell");
});

app.post("/bookdata", upload.single("image"), async function (req, res) {
    let { name, phone, bookname, author, price, city } = req.body;
    let image = req.file.filename;
    let book = new Book({
        name,
        phone,
        bookname,
        author,
        price,
        city,
        image,
        userId: req.session.user.id
    });
    await book.save();

    res.redirect("/");
});

app.get('/books/', async (req, res) => {
    const { city } = req.query;
    const books = await Book.find({ city: city });
    res.json(books);
});

app.get("/logout", function (req, res) {
    req.session.destroy(err => {
        if (err) {
            return res.redirect("/"); 
        }
        res.clearCookie("token");
        res.redirect("/");
    });
});

app.get("/your-added-books", isLoggedIn, async function (req, res) {
    const books = await Book.find({ userId: req.session.user.id });
    const userId = req.session.userId;
    const senderid = req.messages.sennderId;
    res.render("your-added-books", { books, senderid });
});

app.get("/chat/:sellerId", isLoggedIn, function(req,res){
    console.log(req.session.user.Id)
    res.render("chat", {sellerId:req.params.sellerId , userId:req.session.user.id });
})
 
io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    // Join chat room for the seller
    socket.on('joinChat', (sellerId) => {
        socket.join(sellerId);
        console.log(`User ${socket.id} joined chat room: ${sellerId}`);
    });

    // Handle sending a message
    socket.on('sendMessage', async (data) => {
        console.log("Message received on server:", data);
    
        // Validate if sellerId and senderId are valid ObjectIds
        if (!mongoose.Types.ObjectId.isValid(data.senderId)) {
            console.log("Invalid senderId format:", data.senderId);
            return;
        }
    
        if (!mongoose.Types.ObjectId.isValid(data.sellerId)) {
            console.log("Invalid sellerId format:", data.sellerId);
            return;
        }
    
        // Save message to the database
        const newMessage = new Message({
            senderId: data.senderId,
            receiverId: data.sellerId,
            message: data.message
        });
        await newMessage.save();
    
        // Emit the message to the seller and the buyer
        io.to(data.sellerId).emit('receiveMessage', {
            senderId: data.senderId,
            message: data.message
        });
        io.to(data.senderId).emit('receiveMessage', {
            senderId: data.senderId,
            message: data.message
        });
    });
    
    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
app.get("/seller/messages", isLoggedIn, async (req, res) => {
    if (req.session.user.role !== 'seller') {
        return res.redirect("/"); // Ensure the user is a seller
    }

    // Fetch messages where the seller is the receiver
    const messages = await Message.find({ receiverId: req.session.user.id })
        .populate('senderId', 'name email') // Populate sender details (optional)
        .sort({ timestamp: 1 }); // Sort by timestamp ascending (oldest first)

    res.render("seller-messages", { messages });
});
server.listen(9000, () => {
    console.log("Server is running on port 9000");
});
