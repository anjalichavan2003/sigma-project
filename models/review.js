const { ref } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Schema
const reviewSchema = new Schema({
  comment: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(), //current date
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  }
});

//Model
module.exports = mongoose.model("Review", reviewSchema);
