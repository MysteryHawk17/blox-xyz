const { LockAcquisitionError } = require("../utils/error");
const redisClient = require("../utils/redis");
const { v4: uuidv4 } = require("uuid");

class LockService {
  constructor() {
    this.LOCK_TIMEOUT = process.env.LOCK_TIMEOUT; // 10 seconds
  }

  async acquireLock(lockKey, timeout = this.LOCK_TIMEOUT) {
    const lockValue = uuidv4();
    const acquired = await redisClient.set(
      `lock:${lockKey}`,
      lockValue,
      "NX",
      "PX"
    );

    if (acquired === null) {
      throw new LockAcquisitionError("Failed to acquire lock");
    }

    return lockValue;
  }

  async releaseLock(lockKey, lockValue) {
    const currentValue = await redisClient.get(`lock:${lockKey}`);
    if (currentValue === lockValue) {
      await redisClient.del(`lock:${lockKey}`);
      return true;
    }
    return false;
  }
}

module.exports = new LockService();
