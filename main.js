const express = require('express')
const app = express();
const path = require('path');
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cookieParser())
const bcrypt = require("bcrypt")
 app.use(express.urlencoded({extended: true}));
 app.use(express.static(path.join(__dirname,'public')));
 app.set('view engine', 'ejs');
const mongoose = require('mongoose');
const userModel = require('./model');
app.get("/",function(req,res){
    res.render("index")
})

app.get("/signup", function(req,res){
    res.render("signup page")
})

app.post("/create", function(req,res){
    let {name, email, password} = req.body;
   bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(password, salt,  async function(err,hash){
           let user = await  userModel.create({
            name,
            email,
           password: hash,
           }
           )

            const token = jwt.sign({email}, "shhhhhh")
            res.cookie("token", token)
            res.redirect("/signup")
    }) 
   })
})

app.post("/login", async function(req,res){
    const user = await userModel.findOne({email: req.body.email}) 
    if(!user) return res.send("someting wnt rong")
   bcrypt.compare(req.body.password, user.password, function(err,result){
   if(result){
     const token = jwt.sign({email : user.email}, "shhhhhh")
     res.cookie("token", token)
     res.render("After Login")
   }      
   else res.send("someting wrong")
 })
})
app.get("/buy", function(req,res){
    res.render("Buy")
})
app.get("/sell", function(req,res){
    res.render("Sell")
})

app.post("/bookdata", function(req,res){
  let {name,  phone,
    bookname,
    author,
    price, } = req.body;
 bcrypt.genSalt(10, function(err, salt){
  bcrypt.hash(password, salt,  async function(err,hash){
         let user = await  userModel.create({
          name,
          phone,
          bookname,
          author,
          price
         }
         )

          res.send("Book Added")
          res.redirect("/")
  }) 
 })
})

app.listen(3000)