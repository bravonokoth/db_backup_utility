const express = require('express');
const yargs = require('yargs');
const apiRoutes = require('./routes/api');
const { logger } = require('./utils/logger');

const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`db_backup_utility: Server running on port ${PORT}`);
});

// CLI Commands
yargs
  .scriptName('db_backup_utility')
  .command(
    'test-connection',
    'Test database connection',
    { dbType: { demand: true, type: 'string', choices: ['mysql', 'postgresql', 'mongodb', 'sqlite'] } },
    async (argv) => {
      try {
        await apiRoutes.post('/test-connection', { body: argv });
        console.log(`db_backup_utility: Connection to ${argv.dbType} successful`);
      } catch (error) {
        console.error(`db_backup_utility: Connection test failed: ${error.message}`);
      }
    }
  )
  .command(
    'backup',
    'Perform a database backup',
    {
      dbType: { demand: true, type: 'string', choices: ['mysql', 'postgresql', 'mongodb', 'sqlite'] },
      type: { type: 'string', default: 'full', choices: ['full'] },
      storageType: { type: 'string', default: 'local', choices: ['local', 's3'] },
      outputPath: { type: 'string', default: './backups' },
    },
    async (argv) => {
      try {
        const response = await apiRoutes.post('/backup', { body: argv });
        console.log(`db_backup_utility: Backup completed: ${response.body.file}`);
      } catch (error) {
        console.error(`db_backup_utility: Backup failed: ${error.message}`);
      }
    }
  )
  .command(
    'restore',
    'Restore a database from backup',
    {
      dbType: { demand: true, type: 'string', choices: ['mysql', 'postgresql', 'mongodb', 'sqlite'] },
      backupFile: { demand: true, type: 'string' },
    },
    async (argv) => {
      try {
        await apiRoutes.post('/restore', { body: argv });
        console.log(`db_backup_utility: Restore completed`);
      } catch (error) {
        console.error(`db_backup_utility: Restore failed: ${error.message}`);
      }
    }
  )
  .command(
    'schedule',
    'Schedule a database backup',
    {
      dbType: { demand: true, type: 'string', choices: ['mysql', 'postgresql', 'mongodb', 'sqlite'] },
      type: { type: 'string', default: 'full', choices: ['full'] },
      storageType: { type: 'string', default: 'local', choices: ['local', 's3'] },
      schedule: { type: 'string', default: '0 0 * * *' },
      outputPath: { type: 'string', default: './backups' },
    },
    async (argv) => {
      try {
        await apiRoutes.post('/schedule', { body: argv });
        console.log(`db_backup_utility: Backup scheduled for ${argv.dbType}`);
      } catch (error) {
        console.error(`db_backup_utility: Scheduling failed: ${error.message}`);
      }
    }
  )
  .help()
  .argv;