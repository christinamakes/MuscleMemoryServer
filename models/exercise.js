'use strict';

const mongoose = require('mongoose');

const exerciseSchema = mongoose.Schema({
  exerciseName: {type: String, required: true},
  musclesWorked: [{type: mongoose.Schema.Types.ObjectId, ref:'Muscle', required: true}],
  datefield: {type: Date, default: Date.now},
  secondaryMusclesWorked: [{type: Number}]
});

exerciseSchema.set('toObject', {
  transform: function(doc, ret) {
    ret.id = ret.__id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Exercise', exerciseSchema);

