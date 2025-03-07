// services/systemLog.service.js
import SystemLog from "../models/system_log.model.js";
import User from "../models/user.model.js";

/**
 * Create a new system log entry
 * 
 * @param {Object} logData - Log data object
 * @param {string} logData.logLevel - Log level (info, warning, error, critical)
 * @param {string} logData.category - Log category
 * @param {string} logData.message - Log message
 * @param {number} [logData.userId] - Associated user ID (optional)
 * @param {Object} [logData.metadata] - Additional metadata (optional)
 * @param {string} [logData.ipAddress] - IP address (optional)
 * @returns {Promise<Object>} Created log entry
 */
export const createLog = async ({
  logLevel = "info",
  category,
  message,
  userId = null,
  metadata = null,
  ipAddress = null,
}) => {
  try {
    const logEntry = await SystemLog.create({
      logLevel,
      category,
      message,
      userId,
      metadata,
      ipAddress,
    });
    
    return logEntry;
  } catch (error) {
    console.error("Error creating system log:", error);
    // Return null instead of throwing to prevent interrupting application flow
    return null;
  }
};

/**
 * Create an info level log
 * 
 * @param {string} category - Log category
 * @param {string} message - Log message
 * @param {Object} options - Additional log options (userId, metadata, ipAddress)
 * @returns {Promise<Object>} Created log entry
 */
export const logInfo = async (category, message, options = {}) => {
  return createLog({
    logLevel: "info",
    category,
    message,
    ...options,
  });
};

/**
 * Create a warning level log
 * 
 * @param {string} category - Log category
 * @param {string} message - Log message
 * @param {Object} options - Additional log options (userId, metadata, ipAddress)
 * @returns {Promise<Object>} Created log entry
 */
export const logWarning = async (category, message, options = {}) => {
  return createLog({
    logLevel: "warning",
    category,
    message,
    ...options,
  });
};

/**
 * Create an error level log
 * 
 * @param {string} category - Log category
 * @param {string} message - Log message
 * @param {Object} options - Additional log options (userId, metadata, ipAddress)
 * @returns {Promise<Object>} Created log entry
 */
export const logError = async (category, message, options = {}) => {
  return createLog({
    logLevel: "error",
    category,
    message,
    ...options,
  });
};

/**
 * Create a critical level log
 * 
 * @param {string} category - Log category
 * @param {string} message - Log message
 * @param {Object} options - Additional log options (userId, metadata, ipAddress)
 * @returns {Promise<Object>} Created log entry
 */
export const logCritical = async (category, message, options = {}) => {
  return createLog({
    logLevel: "critical",
    category,
    message,
    ...options,
  });
};

/**
 * Get logs by user ID
 * 
 * @param {number} userId - User ID to filter logs
 * @param {Object} options - Query options
 * @param {number} [options.limit=100] - Maximum number of logs to return
 * @param {number} [options.offset=0] - Number of logs to skip
 * @returns {Promise<Array>} Log entries
 */
export const getLogsByUserId = async (userId, { limit = 100, offset = 0 } = {}) => {
  try {
    return await SystemLog.findAll({
      where: { userId },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
  } catch (error) {
    console.error("Error fetching user logs:", error);
    return [];
  }
};

/**
 * Get logs by category
 * 
 * @param {string} category - Category to filter logs
 * @param {Object} options - Query options
 * @param {number} [options.limit=100] - Maximum number of logs to return
 * @param {number} [options.offset=0] - Number of logs to skip
 * @returns {Promise<Array>} Log entries
 */
export const getLogsByCategory = async (category, { limit = 100, offset = 0 } = {}) => {
  try {
    return await SystemLog.findAll({
      where: { category },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
  } catch (error) {
    console.error("Error fetching category logs:", error);
    return [];
  }
};

/**
 * Get logs by log level
 * 
 * @param {string} logLevel - Log level to filter logs
 * @param {Object} options - Query options
 * @param {number} [options.limit=100] - Maximum number of logs to return
 * @param {number} [options.offset=0] - Number of logs to skip
 * @returns {Promise<Array>} Log entries
 */
export const getLogsByLevel = async (logLevel, { limit = 100, offset = 0 } = {}) => {
  try {
    return await SystemLog.findAll({
      where: { logLevel },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
  } catch (error) {
    console.error("Error fetching logs by level:", error);
    return [];
  }
};

// export const getSystemLogs = async () => {
//   try {
//     return await SystemLog.findAll({
//       attributes: {
//         include: [
//           [
//             SystemLog.belongsTo(User, {
//               as: "User",
//               foreignKey: "userId",
//             }),
//             {
//               attributes: ["id", "username"],
//             },
//           ],
//         ],
//       },
//       order: [['createdAt', 'DESC']],
//     });
//   } catch (error) {
//     console.error("Error fetching system logs:", error);
//     return [];
//   }
// };

export const getSystemLogs = async () => {
  try {
    return await SystemLog.findAll({
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "username"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    console.error("Error fetching system logs:", error);
    return [];
  }
};