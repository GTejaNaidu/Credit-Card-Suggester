const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  cardname: { type: String, required: true },
  bank: { type: String, required: true },
  categories: [String],
  benefits: { type: String, required: true },
  annualfee: { type: String, required: true },
  eligibility: { type: String, required: true }
});

module.exports = mongoose.model('Card', cardSchema);
