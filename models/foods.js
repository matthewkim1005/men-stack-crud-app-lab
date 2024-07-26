const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: String,
  isVegetarian: Boolean,
});

const Food = mongoose.model("Food", foodSchema);
module.exports = Food