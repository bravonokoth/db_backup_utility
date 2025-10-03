
# db_backup_utility

A CLI and API-based tool built with Node.js and Express for backing up and restoring databases (MySQL, PostgreSQL, MongoDB, SQLite). Supports full backups, ZIP compression, local/AWS S3 storage, cron scheduling, logging, and Slack notifications.

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd db_backup_utility
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure `.env` (see `.env.example`):
   ```env
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=your_password
   MYSQL_DATABASE=test_db
   POSTGRES_HOST=localhost
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your_password
   POSTGRES_DB=test_db
   MONGODB_URI=mongodb://localhost:27017/test_db
   SQLITE_PATH=./test.db
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   S3_BUCKET=your-bucket-name
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your/webhook/url
   BACKUP_STORAGE_PATH=./backups
   ```
4. Start the server:
   ```bash
   node src/index.js
   ```

## Usage
### CLI Commands
- Test connection:
  ```bash
  node src/index.js test-connection --dbType mysql
  ```
- Perform backup:
  ```bash
  node src/index.js backup --dbType postgresql --type full --storageType s3 --outputPath ./backups
  ```
- Restore database:
  ```bash
  node src/index.js restore --dbType sqlite --backupFile ./backups/sqlite_backup_2025-10-03.db.zip
  ```
- Schedule backup (daily at midnight):
  ```bash
  node src/index.js schedule --dbType mongodb --schedule "0 0 * * *"
  ```

### API Endpoints
- `POST /api/test-connection`: Test database connection.
  ```json
  { "dbType": "mysql" }
  ```
- `POST /api/backup`: Perform a backup.
  ```json
  { "dbType": "postgresql", "type": "full", "storageType": "s3", "outputPath": "./backups" }
  ```
- `POST /api/restore`: Restore from a backup.
  ```json
  { "dbType": "sqlite", "backupFile": "./backups/sqlite_backup_2025-10-03.db.zip" }
  ```
- `POST /api/schedule`: Schedule a backup.
  ```json
  { "dbType": "mongodb", "schedule": "0 0 * * *" }
  ```

## Features
- **Supported DBMS**: MySQL, PostgreSQL, MongoDB, SQLite
- **Backup Types**: Full (incremental/differential planned)
- **Storage**: Local filesystem, AWS S3
- **Compression**: ZIP compression for backups
- **Logging**: Winston-based logging to `logs/db_backup_utility.log` and console
- **Notifications**: Slack notifications for backup/restore status
- **Scheduling**: Cron-based scheduling with `node-cron`

## Requirements
- Node.js v16+
- Database tools: `mysqldump`, `pg_dump`, `psql`, `mongodump`, `mongorestore`
- AWS S3 credentials for cloud storage
- Slack webhook URL for notifications

## Project Structure
```
db_backup_utility/
├── .env
├── .gitignore
├── logs/
├── package.json
├── README.md
└── src/
    ├── config/config.js
    ├── db/
    │   ├── backup.js
    │   └── connectors/
    │       ├── mysql.js
    │       ├── postgresql.js
    │       ├── mongodb.js
    │       └── sqlite.js
    ├── routes/api.js
    ├── schedules/scheduler.js
    ├── storage/
    │   ├── local.js
    │   └── cloud.js
    └── utils/
        ├── logger.js
        ├── compression.js
        └── notifications.js
```

## Future Enhancements
- Incremental and differential backups
- Selective restore for tables/collections
- Support for Google Cloud Storage, Azure Blob Storage
- Backup encryption
- Streaming for large databases

## Community Feedback
Please provide feedback on:
1. Code modularity and maintainability
2. Feature completeness
3. Performance for large databases
4. Security (e.g., backup encryption)
5. CLI/API usability
6. Suggestions for incremental backups or selective restores
```

### Instructions to Apply
1. **Navigate to Project Directory**:
   ```bash
   cd ~/Desktop/db_backup_utility
   ```



### Additional Steps
- **Fix `package.json` Error**: Since you previously encountered an `EJSONPARSE` error, ensure `package.json` is valid:
  ```bash
  rm package.json
  npm init -y
  npm install express mysql2 pg mongodb sqlite3 aws-sdk node-cron winston adm-zip axios dotenv yargs
  ```

- **Test the Project**: Verify the setup:
  ```bash
  node src/index.js --help
  ```

