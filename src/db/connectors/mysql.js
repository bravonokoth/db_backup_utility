const mysql = require('mysql2/promise');
const { logger } = require('../../utils/logger');
const { compressFile } = require('../../utils/compression');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

class MySQLConnector {
  constructor(config) {
    this.config = config;
  }

  async testConnection() {
    try {
      const connection = await mysql.createConnection(this.config);
      await connection.ping();
      await connection.end();
      logger.info('MySQL connection test successful');
      return true;
    } catch (error) {
      logger.error(`MySQL connection test failed: ${error.message}`);
      throw new Error(`MySQL connection failed: ${error.message}`);
    }
  }

  async backup({ type = 'full', outputPath }) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = `${outputPath}/mysql_backup_${timestamp}.sql`;
      const command = `mysqldump -h ${this.config.host} -u ${this.config.user} -p${this.config.password} ${this.config.database} > ${backupFile}`;
      
      await execPromise(command);
      const compressedFile = await compressFile(backupFile);
      logger.info(`MySQL ${type} backup completed: ${compressedFile}`);
      return compressedFile;
    } catch (error) {
      logger.error(`MySQL backup failed: ${error.message}`);
      throw new Error(`MySQL backup failed: ${error.message}`);
    }
  }

  async restore(backupFile) {
    try {
      const command = `mysql -h ${this.config.host} -u ${this.config.user} -p${this.config.password} ${this.config.database} < ${backupFile}`;
      await execPromise(command);
      logger.info(`MySQL restore completed from ${backupFile}`);
    } catch (error) {
      logger.error(`MySQL restore failed: ${error.message}`);
      throw new Error(`MySQL restore failed: ${error.message}`);
    }
  }
}

module.exports = MySQLConnector;