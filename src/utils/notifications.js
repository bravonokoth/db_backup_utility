const axios = require('axios');
const config = require('../config/config');
const { logger } = require('./logger');

async function sendSlackNotification(message) {
  if (!config.slackWebhookUrl) {
    logger.warn('db_backup_utility: Slack webhook URL not configured');
    return;
  }

  try {
    await axios.post(config.slackWebhookUrl, { text: message });
    logger.info('db_backup_utility: Slack notification sent');
  } catch (error) {
    logger.error(`db_backup_utility: Slack notification failed: ${error.message}`);
  }
}

module.exports = { sendSlackNotification };