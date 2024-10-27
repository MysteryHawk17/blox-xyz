# Distributed Banking Transaction System

This application is a simple, distributed banking transaction system built with Node.js, Express, MongoDB, Redis, and Mongoose. It demonstrates the process of securely transferring funds between accounts on separate systems using a two-phase commit (2PC) protocol.

### Features

- **Two-Phase Commit (2PC)**: Ensures transactions are either fully completed or rolled back to maintain consistency across distributed systems.
- **Distributed Locking with Redis**: Prevents simultaneous operations on the same account during transactions.
- **Transaction Logging**: Logs each transaction for auditing and troubleshooting.

## How It Works

1. **Two-Phase Commit Protocol**:
   - **Prepare Phase**: Deducts the specified amount from the sender's account and holds it temporarily.
   - **Commit Phase**: Adds the deducted amount to the recipient’s account.
2. **Redis Locking**: Utilizes Redis locks to prevent simultaneous modifications to the same account.
3. **Transaction Logging**: Every transaction is logged as Pending, Completed, or Rolled Back to help track and troubleshoot issues.

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd blox-xyz
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up MongoDB and Redis services.

4. Add environment variables in `.env`:

   ```dotenv
   MONGO_URI=mongodb://localhost:27017/bank
   PORT=3000
   REDIS_HOST=localhost
   REDIS_PORT=6379
   LOCK_TIMEOUT=5000
   ```

5. Start the server:
   ```bash
   node index.js
   ```
