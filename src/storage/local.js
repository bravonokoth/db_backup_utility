const fs = require('fs').promises;
const path = require('path');
const config = require('../config/config');
const { logger } = require('../utils/logger');

async function saveToLocal(filePath) {
  try {
    const backupDir = config.storage.local.path;
    await fs.mkdir(backupDir, { recursive: true });
    const destPath = path.join(backupDir, path.basename(filePath));
    await fs.rename(filePath, destPath);
    logger.info(`db_backup_utility: Backup saved locally: ${destPath}`);
    return destPath;
  } catch (error) {
    logger.error(`db_backup_utility: Failed to save backup locally: ${error.message}`);
    throw new Error(`Local storage failed: ${error.message}`);
  }
}

module.exports = { saveToLocal };