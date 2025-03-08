import { asyncHandler } from "../utils/AsyncHandler.js";
import { getSystemLogs, logInfo, logError } from "../services/system_log.service.js";
import { exportLogsToFile, formatLogsAsText } from "../utils/LogExport.js";
import path from 'path';

/**
 * Export system logs as text file
 * - Handles both browser downloads and API requests
 */
export const exportLogsAsText = asyncHandler(async (req, res) => {
  try {
    const logLevel = req.query.level || 'all';
    const category = req.query.category || 'all';
    const date = req.query.date || null;
    const format = req.query.format || 'txt';
    
    const whereClause = {};
    if (logLevel !== 'all') whereClause.logLevel = logLevel;
    if (category !== 'all') whereClause.category = category;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      whereClause.createdAt = {
        $gte: startDate,
        $lt: endDate
      };
    }

    const logs = await getSystemLogs(whereClause);
    
    if (logs.length === 0) {
      req.flash("error", "No logs found to export");
      return res.redirect("/admin/system-activity");
    }
    
    await logInfo("admin", "System logs exported", {
      userId: req.user.id,
      ipAddress: req.ip,
      metadata: { 
        format,
        filters: { logLevel, category, date },
        count: logs.length
      }
    });

    if (req.headers.accept.includes('application/json')) {
      const exportResult = await exportLogsToFile(logs);
      
      if (!exportResult.success) {
        return res.status(500).json({ 
          success: false, 
          message: "Failed to export logs",
          error: exportResult.error
        });
      }
      
      return res.json({
        success: true,
        message: "Logs exported successfully",
        filename: exportResult.filename,
        path: exportResult.path
      });
    }
    
    const txtContent = formatLogsAsText(logs);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `system_logs_${timestamp}.txt`;
    
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    return res.send(txtContent);
    
  } catch (error) {
    await logError("admin", "Log export error", {
      userId: req.user?.id,
      ipAddress: req.ip,
      metadata: { error: error.message }
    });
    
    if (req.headers.accept.includes('application/json')) {
      return res.status(500).json({ 
        success: false, 
        message: "Failed to export logs",
        error: error.message
      });
    }
    
    req.flash("error", error.message || "Failed to export logs");
    return res.redirect("/admin/system-activity");
  }
});