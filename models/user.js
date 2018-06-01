'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  recentWorkout: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workout' }],
});

userSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id,
      delete ret._id,
      delete ret.password,
      delete ret.__v;
  }
});

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};

module.exports = mongoose.model('User', userSchema);