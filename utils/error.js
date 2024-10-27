class TransferError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "TransferError";
    this.code = code;
  }
}

class InsufficientFundsError extends TransferError {
  constructor() {
    super("Insufficient funds", "INSUFFICIENT_FUNDS");
  }
}

class LockAcquisitionError extends TransferError {
  constructor() {
    super("Could not acquire lock", "LOCK_ACQUISITION_FAILED");
  }
}

module.exports = {
  TransferError,
  InsufficientFundsError,
  LockAcquisitionError,
};
