const mongoose = require('mongoose');

const exchangeSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
});
const ExchangeRate = mongoose.model('ExchangeRate', exchangeSchema);
module.exports = ExchangeRate;