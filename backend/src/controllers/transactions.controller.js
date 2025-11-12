const User = require('../models/User');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

exports.transferFunds = async (req, res) => {
  const senderId = req.user.userId;
  const { recipientEmail, amount } = req.body;

  if (!recipientEmail || !amount) {
    return res.status(400).json({ message: 'Recipient email and amount are required.' });
  }

  const transferAmount = parseFloat(amount);
  if (isNaN(transferAmount) || transferAmount <= 0) {
    return res.status(400).json({ message: 'Amount must be a positive number.' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sender = await User.findById(senderId).session(session);
    if (!sender) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Sender not found.' });
    }

    const recipient = await User.findOne({ email: recipientEmail.toLowerCase() }).session(session);
    if (!recipient) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Recipient user not found.' });
    }

    if (sender._id.toString() === recipient._id.toString()) {
        await session.abortTransaction();
        return res.status(400).json({ message: 'Cannot transfer money to yourself.' });
    }
    
    const senderBalance = parseFloat(sender.balance.toString());
    const recipientBalance = parseFloat(recipient.balance.toString());
    
    if (senderBalance < transferAmount) {
        await session.abortTransaction();
        return res.status(400).json({ message: 'Insufficient funds.' });
    }
    
    console.log('Sender:', sender);
    console.log('Recipient:', recipient);
    console.log('Balances before transfer:', sender.balance.toString(), recipient.balance.toString());

    sender.balance = new mongoose.Types.Decimal128((senderBalance - transferAmount).toFixed(2));
    recipient.balance = new mongoose.Types.Decimal128((recipientBalance + transferAmount).toFixed(2));

    console.log('Balances after transfer:', sender.balance.toString(), recipient.balance.toString());

    await sender.save({ session });
    await recipient.save({ session });

    const senderTransaction = new Transaction({
      user: senderId,
      type: 'TRANSFER_OUT',
      amount: new mongoose.Types.Decimal128((-transferAmount).toFixed(2)),
      description: `Transfer to ${recipient.email}`,
      relatedUser: recipient._id,
    });

    const recipientTransaction = new Transaction({
      user: recipient._id,
      type: 'TRANSFER_IN',
      amount: new mongoose.Types.Decimal128(transferAmount.toFixed(2)),
      description: `Transfer from ${sender.email}`,
      relatedUser: sender._id,
    });

    await senderTransaction.save({ session });
    await recipientTransaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    try {
      const io = req.app.get('io');
      const onlineUsers = req.app.get('onlineUsers');

    const recipientSockets = onlineUsers.get(recipient._id.toString());
    if (recipientSockets) {
        for (const socketId of recipientSockets) {
            io.to(socketId).emit('money-received', {
            from: sender.email,
            amount: transferAmount,
            });
        }
        console.log(`Sent real-time notification to recipient ${recipient.email}`);
    }


    } catch (err) {
      console.error('Error sending Socket.IO notification:', err);
    }

    res.status(200).json({
      message: `Successfully transferred $${transferAmount.toFixed(2)} to ${recipient.email}.`,
      newBalance: sender.balance.toString(),
      transactionId: senderTransaction._id
    });

  } catch (error) {
    console.error('Transfer Transaction Error:', error);
    if (session.inTransaction()) await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Server error during funds transfer. Transaction aborted.' });
  }
};


exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await User.findById(userId).select('balance email');
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const latestTransactions = await Transaction.find({ user: userId })
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(limit)
      .populate('relatedUser', 'email');

    const formattedTransactions = latestTransactions.map(t => ({
      _id: t._id,
      type: t.type,
      amount: t.amount ? parseFloat(t.amount.toString()).toFixed(2) : '0.00',
      date: t.createdAt ? t.createdAt.toISOString() : 'N/A', 
      relatedUserEmail: t.relatedUser ? t.relatedUser.email : 'N/A',
      description: t.description
    }));

    const totalTransactions = await Transaction.countDocuments({ user: userId });
    const totalPages = Math.ceil(totalTransactions / limit);

    res.status(200).json({
      message: 'Dashboard data fetched successfully.',
      userEmail: user.email,
      balance: user.balance.toString(),
      latestTransactions: formattedTransactions,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalTransactions,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get Dashboard Data Error:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard data.' });
  }
};
