const TransactionService = require("../services/transactionService");
const { TransferError } = require("../utils/error");

class TransactionController {
  async transferMoney(req, res) {
    try {
      const { fromAccount, toAccount, amount } = req.body;

      if (!fromAccount || !toAccount || !amount) {
        return res.status(400).json({
          success: false,
          error: "Missing required parameters",
        });
      }
      const transaction = await TransactionService.transferMoney(
        fromAccount,
        toAccount,
        parseFloat(amount)
      );

      return res.status(200).json({
        success: true,
        transaction,
      });
    } catch (error) {
      if (error instanceof TransferError) {
        return res.status(400).json({
          success: false,
          error: error.message,
          code: error.code,
        });
      }

      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  async getTransactionStatus(req, res) {
    try {
      const { transactionId } = req.params;
      const transaction = await TransactionService.getTransactionStatus(
        transactionId
      );

      if (!transaction) {
        return res.status(404).json({
          success: false,
          error: "Transaction not found",
        });
      }

      return res.status(200).json({
        success: true,
        transaction,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  async getBalance(req, res) {
    try {
      const { accountId } = req.params;
      const balance = await TransactionService.getAccountBalance(accountId);

      return res.status(200).json({
        success: true,
        balance,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
}

module.exports = new TransactionController();
