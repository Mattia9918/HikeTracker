'use strict';

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './pictures');
    },
  filename: function (req, file, cb) {
      cb(null, file.originalname);
  }
});

const uploadImg = multer({
  storage: storage,
  limits: {
    fileSize: 8000000 // Compliant: 8MB
  }
}).single('image');

module.exports.uploadImg = uploadImg;
