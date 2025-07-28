const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  accountn: {
    type: String, // de ex. '1012'
    required: true,
  },
  accountname: {
    type: String, // de ex. 'CAPITAL SUBSCRIS VARSAT'
    required: true,
  },
  initialBalance: {
    debit: { type: Number, default: 0 },
    credit: { type: Number, default: 0 },
  },
  turnovers: {
    debit: { type: Number, default: 0 },
    credit: { type: Number, default: 0 },
  },
  totals: {
    debit: { type: Number, default: 0 },
    credit: { type: Number, default: 0 },
  },
  finalBalance: {
    debit: { type: Number, default: 0 },
    credit: { type: Number, default: 0 },
  }
});

const FinancialsSchema = new mongoose.Schema({
  uploadDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  financialDate: {
    type: Date,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: 'RON',
  },
  company: {
    name: String,
    cui: String,
    regCom: String,
  },
  accounts: [AccountSchema],
});

const FinancialsData = mongoose.model('Financials', FinancialsSchema, 'FinancialsData');
module.exports = FinancialsData;
