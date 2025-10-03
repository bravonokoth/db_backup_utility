const sqlite3 = require('sqlite3').verbose();
const fs = require('fs').promises;
const { logger } = require('../../utils/logger');
const { compressFile } = require('../../utils/compression');

class SQLiteConnector {
  constructor(config) {
    this.config = config;
  }

  async testConnection() {
    try {
      const db = new sqlite3.Database(this.config.path);
      db.close();
      logger.info('SQLite connection test successful');
      return true;
    } catch (error) {
      logger.error(`SQLite connection test failed: ${error.message}`);
      throw new Error(`SQLite connection failed: ${error.message}`);
    }
  }

  async backup({ type = 'full', outputPath }) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = `${outputPath}/sqlite_backup_${timestamp}.db`;
      await fs.copyFile(this.config.path, backupFile);
      const compressedFile = await compressFile(backupFile);
      logger.info(`SQLite ${type} backup completed: ${compressedFile}`);
      return compressedFile;
    } catch (error) {
      logger.error(`SQLite backup failed: ${error.message}`);
      throw new Error(`SQLite backup failed: ${error.message}`);
    }
  }

  async restore(backupFile) {
    try {
      await fs.copyFile(backupFile, this.config.path);
      logger.info(`SQLite restore completed from ${backupFile}`);
    } catch (error) {
      logger.error(`SQLite restore failed: ${error.message}`);
      throw new Error(`SQLite restore failed: ${error.message}`);
    }
  }
}

module.exports = SQLiteConnector;