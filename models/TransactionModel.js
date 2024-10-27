const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  fromAccount: {
    type: String,
    required: true
  },
  toAccount: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  error: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
