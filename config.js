export const config = {
  // Configure BOT_OWNER_NUMBERS as a comma-separated list (international numbers, no +).\n  prefix: process.env.BOT_PREFIX || '_',
  authDirectory: process.env.AUTH_DIR || './auth',
  databasePath: process.env.DB_PATH || './data/database.json',
};
