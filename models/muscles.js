'use strict';

const mongoose = require('mongoose');

const muscleSchema = mongoose.Schema({
  name: {type: String, required: true},
});

muscleSchema.set('toObject', {
  transform: function(doc, ret) {
    ret.id = ret.__id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Muscle', muscleSchema);