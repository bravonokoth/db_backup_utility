const AdmZip = require('adm-zip');
const fs = require('fs').promises;
const { logger } = require('./logger');

async function compressFile(inputPath, outputPath) {
  try {
    const zip = new AdmZip();
    zip.addLocalFile(inputPath);
    const compressedPath = outputPath || `${inputPath}.zip`;
    zip.writeToFile(compressedPath);
    await fs.unlink(inputPath); // Remove original file
    logger.info(`db_backup_utility: File compressed: ${compressedPath}`);
    return compressedPath;
  } catch (error) {
    logger.error(`db_backup_utility: Compression failed: ${error.message}`);
    throw new Error(`Compression failed: ${error.message}`);
  }
}

module.exports = { compressFile };