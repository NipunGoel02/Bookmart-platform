const multer = require("multer")
const path = require("path");
const crypto = require("crypto");
const fs = require('fs')
const uploadDir = path.join(__dirname ,  'public', 'images','uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
      crypto.randomBytes(12, function(err,name){
        const fn =  name.toString("hex") + path.extname(file.originalname)
        cb(null,fn)
      })

    }
  })
  
  const upload = multer({ storage: storage })
  module.exports = upload