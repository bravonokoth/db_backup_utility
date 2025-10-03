const { Client } = require('pg');
const { logger } = require('../../utils/logger');
const { compressFile } = require('../../utils/compression');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

class PostgreSQLConnector {
  constructor(config) {
    this.config = config;
  }

  async testConnection() {
    try {
      const client = new Client(this.config);
      await client.connect();
      await client.end();
      logger.info('PostgreSQL connection test successful');
      return true;
    } catch (error) {
      logger.error(`PostgreSQL connection test failed: ${error.message}`);
      throw new Error(`PostgreSQL connection failed: ${error.message}`);
    }
  }

  async backup({ type = 'full', outputPath }) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = `${outputPath}/pg_backup_${timestamp}.sql`;
      const command = `PGPASSWORD=${this.config.password} pg_dump -h ${this.config.host} -U ${this.config.user} ${this.config.database} > ${backupFile}`;
      
      await execPromise(command);
      const compressedFile = await compressFile(backupFile);
      logger.info(`PostgreSQL ${type} backup completed: ${compressedFile}`);
      return compressedFile;
    } catch (error) {
      logger.error(`PostgreSQL backup failed: ${error.message}`);
      throw new Error(`PostgreSQL backup failed: ${error.message}`);
    }
  }

  async restore(backupFile) {
    try {
      const command = `PGPASSWORD=${this.config.password} psql -h ${this.config.host} -U ${this.config.user} ${this.config.database} < ${backupFile}`;
      await execPromise(command);
      logger.info(`PostgreSQL restore completed from ${backupFile}`);
    } catch (error) {
      logger.error(`PostgreSQL restore failed: ${error.message}`);
      throw new Error(`PostgreSQL restore failed: ${error.message}`);
    }
  }
}

module.exports = PostgreSQLConnector;