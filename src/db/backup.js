const MySQLConnector = require('./connectors/mysql');
const PostgreSQLConnector = require('./connectors/postgresql');
const MongoDBConnector = require('./connectors/mongodb');
const SQLiteConnector = require('./connectors/sqlite');
const config = require('../config/config');
const { logger } = require('../utils/logger');
const { saveToLocal } = require('../storage/local');
const { uploadToS3 } = require('../storage/cloud');
const { sendSlackNotification } = require('../utils/notifications');

class BackupManager {
  constructor() {
    this.connectors = {
      mysql: new MySQLConnector(config.databases.mysql),
      postgresql: new PostgreSQLConnector(config.databases.postgresql),
      mongodb: new MongoDBConnector(config.databases.mongodb),
      sqlite: new SQLiteConnector(config.databases.sqlite),
    };
  }

  async testConnection(dbType) {
    const connector = this.connectors[dbType];
    if (!connector) throw new Error(`Unsupported database type: ${dbType}`);
    return connector.testConnection();
  }

  async backup({ dbType, type = 'full', storageType = 'local', outputPath }) {
    const startTime = Date.now();
    try {
      const connector = this.connectors[dbType];
      if (!connector) throw new Error(`Unsupported database type: ${dbType}`);

      await this.testConnection(dbType);
      const backupFile = await connector.backup({ type, outputPath });

      // Store backup
      let storedPath = backupFile;
      if (storageType === 'local') {
        storedPath = await saveToLocal(backupFile);
      } else if (storageType === 's3') {
        storedPath = await uploadToS3(backupFile);
      }

      const duration = (Date.now() - startTime) / 1000;
      logger.info(`Backup completed in ${duration}s: ${storedPath}`);
      await sendSlackNotification(`db_backup_utility: Backup completed for ${dbType}: ${storedPath}`);
      return storedPath;
    } catch (error) {
      logger.error(`Backup failed: ${error.message}`);
      await sendSlackNotification(`db_backup_utility: Backup failed for ${dbType}: ${error.message}`);
      throw error;
    }
  }

  async restore({ dbType, backupFile }) {
    const startTime = Date.now();
    try {
      const connector = this.connectors[dbType];
      if (!connector) throw new Error(`Unsupported database type: ${dbType}`);

      await this.testConnection(dbType);
      await connector.restore(backupFile);

      const duration = (Date.now() - startTime) / 1000;
      logger.info(`Restore completed in ${duration}s`);
      await sendSlackNotification(`db_backup_utility: Restore completed for ${dbType}: ${backupFile}`);
    } catch (error) {
      logger.error(`Restore failed: ${error.message}`);
      await sendSlackNotification(`db_backup_utility: Restore failed for ${dbType}: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new BackupManager();