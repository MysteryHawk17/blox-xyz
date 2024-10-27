const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transactionController');

router.post('/transfer', TransactionController.transferMoney);
router.get('/transaction/:transactionId', TransactionController.getTransactionStatus);
router.get('/balance/:accountId', TransactionController.getBalance);

module.exports = router;