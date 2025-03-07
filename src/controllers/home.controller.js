import { asyncHandler } from "../utils/AsyncHandler.js";
import { getUserDocs } from "../services/document.service.js";
import { getUserScans } from "../services/scan.service.js";
import { logError, logInfo } from "../services/system_log.service.js";

const renderLandingPage = (req, res) => {
  logInfo("navigation", "Landing page visited", {
    userId: req.userId || null,
    ipAddress: req.ip,
  });

  res.render("home/landing", {
    title: "DocScan | Document Scanner & Matcher",
    isAuthenticated: !!req.userId,
    url: req.originalUrl,
  });
};

const renderDashboard = asyncHandler(async (req, res) => {
  try {
    logInfo("navigation", "Dashboard accessed", {
      userId: req.user.id,
      ipAddress: req.ip,
    });

    const documents = await getUserDocs(req.user.id);
    const recentScans = await getUserScans(req.user.id, 5);

    logInfo("data_retrieval", "Dashboard data loaded successfully", {
      userId: req.user.id,
      metadata: {
        documentCount: documents.length,
        scanCount: recentScans.length,
      },
    });

    return res.render("home/dashboard", {
      title: "Dashboard | DocScan",
      user: req.user,
      documents: documents,
      scans: recentScans,
    });
  } catch (error) {
    logError("data_retrieval", "Failed to load dashboard data", {
      userId: req.user?.id,
      metadata: {
        errorMessage: error.message,
        errorStack:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      ipAddress: req.ip,
    });
    req.flash("error", error.message);
    return res.redirect("/");
  }
});

export { renderLandingPage, renderDashboard };