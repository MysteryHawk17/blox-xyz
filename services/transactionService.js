const Transaction = require("../models/TransactionModel");
const Account = require("../models/AccountModel");
const LockService = require("./lockService");
const { v4: uuidv4 } = require("uuid");
const { InsufficientFundsError } = require("../utils/error");

class TransactionService {
  async createTransaction(fromAccount, toAccount, amount) {
    const transaction = new Transaction({
      id: uuidv4(),
      fromAccount,
      toAccount,
      amount,
      status: "pending",
    });

    await transaction.save();
    return transaction;
  }

  async transferMoney(fromAccount, toAccount, amount) {
    if (amount <= 0) {
      throw new Error("Invalid amount");
    }

    const transaction = await this.createTransaction(
      fromAccount,
      toAccount,
      amount
    );

    try {
      // Acquire locks in consistent order
      const [account1, account2] = [fromAccount, toAccount].sort();

      const lock1 = await LockService.acquireLock(account1);
      const lock2 = await LockService.acquireLock(account2);
      try {
        // Get account documents
        const [fromAcc, toAcc] = await Promise.all([
          Account.findOne({ accountId: fromAccount }),
          Account.findOne({ accountId: toAccount }),
        ]);

        /**
         * If the bank account is in another bank we hit the external API here.
         */
        if (fromAcc.balance < amount) {
          throw new InsufficientFundsError();
        }

        // Perform transfer
        await Promise.all([
          Account.updateOne(
            { accountId: fromAccount },
            {
              $inc: { balance: -amount },
              $set: { lastUpdated: new Date() },
            }
          ),
          Account.updateOne(
            { accountId: toAccount },
            {
              $inc: { balance: amount },
              $set: { lastUpdated: new Date() },
            }
          ),
        ]);

        // Update transaction status
        transaction.status = "completed";
        await transaction.save();
        return transaction;
      } finally {
        // Release locks in reverse order
        await LockService.releaseLock(account2, lock2);
        await LockService.releaseLock(account1, lock1);
      }
    } catch (error) {
      transaction.status = "failed";
      transaction.error = error.message;
      await transaction.save();
      throw error;
    }
  }

  async getTransactionStatus(transactionId) {
    return Transaction.findOne({ id: transactionId });
  }

  async getAccountBalance(accountId) {
    const account = await Account.findOne({ accountId });
    return account ? account.balance : 0;
  }
}

module.exports = new TransactionService();
