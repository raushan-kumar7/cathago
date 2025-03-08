import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Format logs into text format
 * @param {Array} logs - Array of system log objects
 * @returns {string} Formatted text content
 */
export const formatLogsAsText = (logs) => {
  let txtContent = "System Activity Log Export\n";
  txtContent += "==========================\n\n";
  
  logs.forEach(log => {
    txtContent += `Timestamp: ${new Date(log.createdAt).toLocaleString()}\n`;
    txtContent += `User: ${log.User ? log.User.username : 'System'}\n`;
    txtContent += `Category: ${log.category}\n`;
    txtContent += `Level: ${log.logLevel}\n`;
    txtContent += `Message: ${log.message}\n`;
    if (log.ipAddress) {
      txtContent += `IP Address: ${log.ipAddress}\n`;
    }
    if (log.metadata) {
      txtContent += `Metadata: ${JSON.stringify(log.metadata, null, 2)}\n`;
    }
    txtContent += "\n-------------------------\n\n";
  });
  
  return txtContent;
};

/**
 * Export logs to a text file
 * @param {Array} logs - Array of system log objects
 * @param {Object} options - Export options
 * @param {string} [options.filename] - Custom filename
 * @returns {Object} File information object with path and filename
 */
export const exportLogsToFile = async (logs, options = {}) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = options.filename || `system_logs_${timestamp}.txt`;
    const exportDir = path.join(__dirname, '../exports');
    
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }
    
    const filePath = path.join(exportDir, filename);
    const txtContent = formatLogsAsText(logs);
    
    await fs.promises.writeFile(filePath, txtContent, 'utf8');
    
    return {
      success: true,
      filename,
      path: filePath
    };
  } catch (error) {
    console.error('Error exporting logs to file:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Check if a file exists and delete it
 * @param {string} filePath - Path to the file
 * @returns {Promise<boolean>} Whether deletion was successful
 */
export const cleanupExportedFile = async (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error cleaning up exported file:', error);
    return false;
  }
};