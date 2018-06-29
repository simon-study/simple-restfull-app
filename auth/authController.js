var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

// Generate body of request
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../user/user');

// Support for upload image
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');

// Config jwt
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

router.post('/register', upload.single('picture'), function(req, res) {
  var dataImage;
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  console.log(req.file)

  if (req.file) {
    dataImage = fs.readFileSync(req.file.path);
  }

  User.create({
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
    avatar: {
      data: dataImage || '',
      contentType: 'image/png' || ''
    },
    email: req.body.email,
    password: hashedPassword,
  },
  function(err, user) {
    if (err) {
      return res.status(500).send('There was a problem registering the user.');
    }

    // Create a token
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 96400 // expires in 24 hours
    });

    res.status(200).send({ auth: true, token: token });
  })
});

router.get('/me', function(req, res) {
  var token = req.headers['x-access-token'];

  if (!token) {
    return res.status(401).send({
      auth: false,
      message: 'No token provided.'
    });
  }

  jwt.verify(token, config.secret, function(err, decode) {
    if (err) {
      return res.status(500).send({
        auth: false,
        message: 'Failed to authenticate token',
      });
    }

    User.findById(decode.id, function(err, user) {
      if (err) {
        return res.status(500).send('There was a problem finding the user.')
      }
      if (!user) {
        return res.status(404).send('No user found');
      }
      res.status(200).send(user);
    });
  });
});

router.post('/login', function(req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      return res.status(500).send('Error on the server.');
    }

    if (!user) {
      return res.status(404).send('No user found.');
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({ auth: false, token: null });
    }

    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ auth: true, token: token });
  });
});

router.get('/logout', function(req, res) {
  res.status(200).send({
    auth: false,
    token: null,
  });
});

module.exports = router;