const cron = require('node-cron');
const BackupManager = require('../db/backup');
const { logger } = require('../utils/logger');

function scheduleBackup({ dbType, type, storageType, schedule = '0 0 * * *', outputPath }) {
  cron.schedule(schedule, async () => {
    logger.info(`db_backup_utility: Starting scheduled backup for ${dbType}`);
    try {
      await BackupManager.backup({ dbType, type, storageType, outputPath });
      logger.info(`db_backup_utility: Scheduled backup completed for ${dbType}`);
    } catch (error) {
      logger.error(`db_backup_utility: Scheduled backup failed for ${dbType}: ${error.message}`);
    }
  });
  logger.info(`db_backup_utility: Backup scheduled for ${dbType} with cron ${schedule}`);
}

module.exports = { scheduleBackup };