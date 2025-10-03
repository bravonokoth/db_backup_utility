const express = require('express');
const BackupManager = require('../db/backup');
const { scheduleBackup } = require('../schedules/scheduler');
const { logger } = require('../utils/logger');
const router = express.Router();

// Test database connection
router.post('/test-connection', async (req, res) => {
  const { dbType } = req.body;
  try {
    await BackupManager.testConnection(dbType);
    logger.info(`db_backup_utility: Connection test successful for ${dbType}`);
    res.status(200).json({ message: `Connection to ${dbType} successful` });
  } catch (error) {
    logger.error(`db_backup_utility: Connection test failed: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Perform backup
router.post('/backup', async (req, res) => {
  const { dbType, type = 'full', storageType = 'local', outputPath = './backups' } = req.body;
  try {
    const backupFile = await BackupManager.backup({ dbType, type, storageType, outputPath });
    res.status(200).json({ message: 'Backup completed', file: backupFile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Restore from backup
router.post('/restore', async (req, res) => {
  const { dbType, backupFile } = req.body;
  try {
    await BackupManager.restore({ dbType, backupFile });
    res.status(200).json({ message: 'Restore completed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Schedule backup
router.post('/schedule', async (req, res) => {
  const { dbType, type = 'full', storageType = 'local', schedule, outputPath = './backups' } = req.body;
  try {
    scheduleBackup({ dbType, type, storageType, schedule, outputPath });
    res.status(200).json({ message: `Backup scheduled for ${dbType}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;