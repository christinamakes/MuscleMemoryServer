'use strict';

const mongoose = require('mongoose');

const workoutSchema = mongoose.Schema({
  workoutName: {type: String, required: true},
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  exercises: [{type: mongoose.Schema.Types.ObjectId, ref:'Exercise'}],
  datefield: {type: Date, default: Date.now},
});

workoutSchema.set('toObject', {
  transform: function(doc, ret) {
    ret.id = ret.__id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Workout', workoutSchema);

