import { asyncHandler } from "../utils/AsyncHandler.js";
import { getUserDocs } from "../services/document.service.js";
import {
  createAIScan,
  getUserAIScans,
  getAIScanById,
  generateAIScanReport,
} from "../services/ai_scan.service.js";
import {
  logInfo,
  logWarning,
  logError,
} from "../services/system_log.service.js";

/**
 * Render the AI scan form
 */
const renderAIScan = asyncHandler(async (req, res) => {
  try {
    logInfo("navigation", "Accessing AI scan form", {
      userId: req.user.id,
      ipAddress: req.ip,
    });

    const documents = await getUserDocs(req.user.id);
    const recentScans = await getUserAIScans(req.user.id, 5);

    if (documents.length < 2) {
      logWarning("scan", "Cannot create AI scan - insufficient documents", {
        userId: req.user.id,
        ipAddress: req.ip,
        metadata: { documentCount: documents.length },
      });
      req.flash(
        "error",
        "You need at least two documents to create an AI scan"
      );
      return res.redirect("/documents");
    }

    return res.render("scans/ai-new", {
      title: "AI Document Scanner | DocScan",
      subTitle: "Compare Documents with AI Analysis",
      documents: documents,
      scans: recentScans,
      user: req.user || { credits: 0 },
      currentPage: "scans",
    });
  } catch (error) {
    logError("scan", "Error rendering AI scan form", {
      userId: req.user?.id,
      ipAddress: req.ip,
      metadata: { errorMessage: error.message },
    });
    req.flash("error", error.message || "Could not load AI scan form");
    return res.redirect("/dashboard");
  }
});

/**
 * Create a new AI scan
 */
const createNewAIScan = asyncHandler(async (req, res) => {
  try {
    const {
      documentId1,
      documentId2,
      aiProvider = "openai",
      analysisDepth = "standard",
    } = req.body;

    if (!documentId1 || !documentId2) {
      logWarning("ai-scan", "AI Scan creation failed - missing document IDs", {
        userId: req.user.id,
        ipAddress: req.ip,
        metadata: { documentId1, documentId2 },
      });
      req.flash("error", "Please select two documents to compare");
      return res.redirect("/scans/ai/new");
    }

    if (documentId1 === documentId2) {
      logWarning(
        "ai-scan",
        "AI Scan creation failed - same document selected twice",
        {
          userId: req.user.id,
          ipAddress: req.ip,
          metadata: { documentId: documentId1 },
        }
      );
      req.flash("error", "Please select two different documents");
      return res.redirect("/scans/ai/new");
    }

    if (req.user.credits < 1) {
      logWarning("credits", "AI Scan creation failed - insufficient credits", {
        userId: req.user.id,
        ipAddress: req.ip,
        metadata: { userCredits: req.user.credits },
      });
      req.flash(
        "error",
        "Insufficient credits. Please purchase more credits to perform AI scans."
      );
      return res.redirect("/credit-request");
    }

    const scanConfig = {
      aiProvider,
      analysisDepth,
    };

    logInfo("ai-scan", "Creating AI document scan", {
      userId: req.user.id,
      ipAddress: req.ip,
      metadata: {
        documentId1,
        documentId2,
        scanConfig,
      },
    });

    const scan = await createAIScan(
      req.user.id,
      documentId1,
      documentId2,
      scanConfig
    );

    logInfo("ai-scan", "AI document scan initiated successfully", {
      userId: req.user.id,
      ipAddress: req.ip,
      metadata: {
        scanId: scan.id,
        status: scan.status,
      },
    });

    req.flash(
      "success",
      "AI Scan initiated. The results will be available shortly."
    );
    return res.redirect(`/scans/ai/${scan.id}`);
  } catch (error) {
    logError("ai-scan", "Error during AI document scan process", {
      userId: req.user?.id,
      ipAddress: req.ip,
      metadata: {
        errorMessage: error.message,
        documentId1: req.body?.documentId1,
        documentId2: req.body?.documentId2,
      },
    });
    req.flash(
      "error",
      error.message || "An error occurred during the AI scan process"
    );
    return res.redirect("/scans/ai/new");
  }
});

/**
 * Render AI scan details
 */
const renderAIScanDetails = asyncHandler(async (req, res) => {
  try {
    const scanId = req.params.id;

    logInfo("navigation", "Accessing AI scan details", {
      userId: req.user.id,
      ipAddress: req.ip,
      metadata: { scanId },
    });

    const scan = await getAIScanById(scanId, req.user.id);

    if (!scan) {
      logWarning("ai-scan", "AI Scan not found or unauthorized access", {
        userId: req.user.id,
        ipAddress: req.ip,
        metadata: { scanId },
      });
      req.flash(
        "error",
        "AI Scan not found or you don't have permission to view it"
      );
      return res.redirect("/scans");
    }

    let matchDetails = {};
    if (scan.matchDetails && scan.status === "completed") {
      try {
        matchDetails = JSON.parse(scan.matchDetails);
      } catch (e) {
        logWarning("ai-scan", "Error parsing AI scan match details", {
          userId: req.user.id,
          ipAddress: req.ip,
          metadata: { scanId, error: e.message },
        });
      }
    }

    logInfo("data_retrieval", "Retrieved AI scan details", {
      userId: req.user.id,
      metadata: {
        scanId,
        matchScore: scan.matchScore,
        status: scan.status,
      },
    });

    return res.render("scans/ai-detail", {
      title: "AI Scan Results | DocScan",
      subTitle: `AI Analysis: ${scan.FirstDocument?.originalName} vs ${scan.SecondDocument?.originalName}`,
      scan,
      matchDetails,
      user: req.user || { credits: 0 },
      currentPage: "scans",
    });
  } catch (error) {
    logError("ai-scan", "Error retrieving AI scan details", {
      userId: req.user?.id,
      ipAddress: req.ip,
      metadata: {
        scanId: req.params.id,
        errorMessage: error.message,
      },
    });
    req.flash("error", error.message || "Could not load AI scan details");
    return res.redirect("/scans");
  }
});

/**
 * Download AI scan report
 */
const downloadAIScanReport = asyncHandler(async (req, res) => {
  try {
    const scanId = req.params.id;

    logInfo("document_operation", "Downloading AI scan report", {
      userId: req.user.id,
      ipAddress: req.ip,
      metadata: { scanId },
    });

    const scan = await getAIScanById(scanId, req.user.id);

    if (!scan) {
      logWarning(
        "ai-scan",
        "Report download failed - AI scan not found or unauthorized access",
        {
          userId: req.user.id,
          ipAddress: req.ip,
          metadata: { scanId },
        }
      );
      req.flash(
        "error",
        "AI Scan not found or you don't have permission to download its report"
      );
      return res.redirect("/scans");
    }

    if (scan.status !== "completed") {
      logWarning(
        "ai-scan",
        "Report download failed - AI scan not yet completed",
        {
          userId: req.user.id,
          ipAddress: req.ip,
          metadata: { scanId, status: scan.status },
        }
      );
      req.flash(
        "error",
        "AI Scan is still processing. Please try again later."
      );
      return res.redirect(`/scans/ai/${scanId}`);
    }

    const report = await generateAIScanReport(scanId, req.user.id);

    logInfo("document_operation", "AI scan report generated successfully", {
      userId: req.user.id,
      metadata: {
        scanId,
        reportSize: report.length,
      },
    });

    // Set headers for text file download
    res.setHeader(
      "Content-disposition",
      `attachment; filename=ai-scan-report-${scan.id}.txt`
    );
    res.setHeader("Content-type", "text/plain");

    return res.send(report);
  } catch (error) {
    logError("ai-scan", "Error generating or downloading AI scan report", {
      userId: req.user?.id,
      ipAddress: req.ip,
      metadata: {
        scanId: req.params.id,
        errorMessage: error.message,
      },
    });
    req.flash("error", error.message || "Could not download AI scan report");
    return res.redirect(`/scans/ai/${req.params.id}`);
  }
});

export {
  renderAIScan,
  createNewAIScan,
  renderAIScanDetails,
  downloadAIScanReport,
};
