const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name cannot be empty!'],
  },
  email: {
    type: String,
    required: [true, 'Email cannot be empty!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email!'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Password cannot be empty!'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Confirm password field cannot be empty!'],
    validate: {
      validator: function (field) {
        return this.password === field;
      },
      message: 'Passwords are not equal',
    },
  },
});

const User = mongoose.model('User', userSchema);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

module.exports = User;
