const AWS = require('aws-sdk');
const fs = require('fs').promises;
const path = require('path');
const config = require('../config/config');
const { logger } = require('../utils/logger');

const s3 = new AWS.S3({
  accessKeyId: config.storage.aws.accessKeyId,
  secretAccessKey: config.storage.aws.secretAccessKey,
  region: config.storage.aws.region,
});

async function uploadToS3(filePath) {
  try {
    const fileContent = await fs.readFile(filePath);
    const params = {
      Bucket: config.storage.aws.bucket,
      Key: `db_backup_utility/${path.basename(filePath)}`,
      Body: fileContent,
    };

    await s3.upload(params).promise();
    logger.info(`db_backup_utility: Backup uploaded to S3: ${params.Key}`);
    return params.Key;
  } catch (error) {
    logger.error(`db_backup_utility: Failed to upload backup to S3: ${error.message}`);
    throw new Error(`S3 upload failed: ${error.message}`);
  }
}

module.exports = { uploadToS3 };