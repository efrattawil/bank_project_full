const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const verificationTokenSchema = new mongoose.Schema ({
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    sixDigitPin: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 300
    }
});

const VerificationToken = mongoose.model('VerificationToken', verificationTokenSchema);
module.exports = VerificationToken;