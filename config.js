export const config = {
  prefix: process.env.BOT_PREFIX || '.',
  authDirectory: process.env.AUTH_DIR || './auth',
  databasePath: process.env.DB_PATH || './data/database.json',
};
