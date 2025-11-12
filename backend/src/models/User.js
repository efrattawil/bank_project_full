const mongoose = require('mongoose');
const { Decimal128 } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
      type: String,
  },
  balance: {
    type: Decimal128, 
    default: '500.00'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'blocked'],
    default: 'inactive'
  }
}, { timestamps: true });


const User = mongoose.model('User', userSchema);
module.exports = User;