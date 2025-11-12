const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const transactionController = require('../controllers/transactions.controller');

router.post('/', protect, transactionController.transferFunds);

module.exports = router;