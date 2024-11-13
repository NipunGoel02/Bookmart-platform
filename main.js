const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const { User, Book } = require('./model');
const nodemailer = require('nodemailer');

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get("/", function (req, res) {
    res.render("index");
});

app.get("/signup", function (req, res) {
    res.render("signup page");
});

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service
    auth: {
        user: 'nipungoel909@gmail.com', // Your email
        pass: 'rrek hwbj rlzu nnww' // Your email password
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
        verificationToken // Save the token
    });
    await user.save();

    // Send verification email
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
            return res.status(400).send("User  not found");
        }

        user.isVerified = true; // Mark the email as verified
        user.verificationToken = null; // Clear the token
        await user.save();

        res.send("Email verified successfully");
    } catch (error) {
        console.error(error);
        res.status(400).send("Invalid or expired token");
    }
});

app.post("/login", async function (req, res) {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.send("Something went wrong");

    if (!user.isVerified) return res.send("Please verify your email before logging in");

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (isMatch) {
        const token = jwt.sign({ email: user.email, id: user._id }, "shhhhhh");
        res.cookie("token", token);
        res.render("After Login");
    } else {
        res.send("Invalid password");
    }
});

app.get("/buy", function (req, res) {
    res.render("Buy");
});

app.get("/sell", function (req, res) {
    res.render("Sell");
});

app.post("/bookdata", async function (req, res) {
    let { name, phone, bookname, author, price, city } = req.body;

    let book = new Book({
        name,
        phone,
        bookname,
        author,
        price,
        city
    });
    await book.save();

    res.redirect("/");
});

// Route to get books based on city
app.get('/books/',  async (req, res) => {
    const { city } = req.query; // Get the city from the query parameters

    
        // Fetch books that match the city
        const books = await Book.find({ city: city }); // Assuming your book schema has a city field
        res.json(books); // Send books data as JSON

});

app.listen(3000);