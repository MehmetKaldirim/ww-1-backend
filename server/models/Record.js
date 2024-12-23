const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const weatherDataSchema = new Schema({
  time: {
    type: String,
    required: true,
  },
  temp: {
    type: Number,
    default: null,
  },
  icon: {
    type: String,
    default: null,
  },
  wind: {
    type: Number,
    default: null,
  },
});

const recordSchema = new Schema({
  user: {
    ref: "users",
    type: Schema.Types.ObjectId,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  mintemp: {
    type: Number,
    default: 0,
  },
  maxtemp: {
    type: Number,
    default: 0,
  },
  wind: {
    type: Number,
    default: 0,
  },
  imgsrc: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  weatherData: [weatherDataSchema],
});

module.exports = mongoose.model("records", recordSchema);
