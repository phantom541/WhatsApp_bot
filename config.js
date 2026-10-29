export const config = {
  // Configure BOT_OWNER_NUMBERS as comma-separated international numbers without a leading +.
  prefix: process.env.BOT_PREFIX || '_',
  authDirectory: process.env.AUTH_DIR || './auth',
  databasePath: process.env.DB_PATH || './data/database.json',
};
