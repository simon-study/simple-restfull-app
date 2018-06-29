const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
// const fs = require('fs');
const path = require('path');
const app = express();

mongoose.connect('mongodb://localhost/webapp');
var db = mongoose.connection;

var AuthController = require('./auth/authController');
app.use('/api/auth', AuthController);

// Check connection
// db.once('open', () => {
//   console.log('Connected to MongoDB');

//   // Homepage
//   app.get('/', (req, res) => {
//     res.render('index', {
//       // isLogin: false,
//       title: 'Homepage'
//     });
//   });

//   // Get register page
//   app.get('/register', (req, res) => {
//     res.render('register', {
//       title: 'Register',
//     });
//   });

//   // Post register page
//   app.post('/register', upload.single('picture'), (req, res) => {
//     if (req.file) {
//       var newUser = new User();
//       newUser.username = req.body.username;
//       newUser.phone = req.body.phone;
//       newUser.address = req.body.address;
//       newUser.email = req.body.email;
//       newUser.password = req.body.password;
//       newUser.img.data = fs.readFileSync(req.file.path);
//       newUser.img.contentType = 'image/png';
//       newUser.save((err) => {
//         if (err) {
//           console.log(err)
//         } else {
//           res.render('index', {
//             message: 'Login success'
//           });
//         }
//       });
//     } else {
//       res.render('register', {
//         // isLogin: true,
//         error: 'Please upload image!'
//       });
//     }
//   });

//   // Get image
//   app.get('/image/:id', (req, res) => {
//     User.findById(req.params.id, (err, results) => {
//       if (err) {
//         console.log(err)
//       } else {
//         res.contentType(results.img.contentType);
//         res.send(results.img.data);
//       }
//     });
//   })
// });

module.exports = app;