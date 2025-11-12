const mongoose = require('mongoose');
const { Decimal128, ObjectId } = mongoose.Schema.Types;

const transactionSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['TRANSFER_IN', 'TRANSFER_OUT'],
    required: true,
  },
  amount: {
    type: Decimal128, 
    required: true,
    min: 0.01 
  },
  description: {
    type: String,
    default: 'Bank Transaction',
  },
  relatedUser: {
    type: ObjectId,
    ref: 'User',
    required: false,
  }
}, { 
    timestamps: true,
    indexes: [{ user:1, date: -1 }]
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;