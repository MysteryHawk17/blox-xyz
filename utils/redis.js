const Redis = require("redis");

class RedisClient {
  constructor() {
    this.client = Redis.createClient({
      url: `redis://${process.env.REDIS_HOST || "localhost"}:${process.env.REDIS_PORT || 6379}`,
    });

    this.client.on("connect", () => {
      console.log("Successfully connected to Redis");
    });

    this.client.on("error", (err) => {
      console.error("Redis connection error:", err);
    });

    // Attempt to connect when instance is created  
    this.client.connect().catch(console.error);
  }

  async get(key) {
    return await this.client.get(key);
  }

  async set(key, value, options = {}) {
    return await this.client.set(key, value, options);
  }

  async del(key) {
    return await this.client.del(key);
  }
}

module.exports = new RedisClient();
