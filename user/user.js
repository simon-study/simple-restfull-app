var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  name: String,
  phone: Number,
  address: String,
  email: String,
  password: String,
  avatar: {
    data: Buffer,
    contentType: String,
  }
});

module.exports = mongoose.model('User', UserSchema);