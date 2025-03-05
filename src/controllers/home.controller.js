import { asyncHandler } from "../utils/AsyncHandler.js";
import { getUserDocs } from "../services/document.service.js";
import { getUserScans } from "../services/scan.service.js";

const renderLandingPage = (req, res) => {
  res.render("home/landing", {
    title: "DocScan | Document Scanner & Matcher",
    isAuthenticated: !!req.userId,
    url: req.originalUrl,
  });
};


const renderDashboard = asyncHandler(async (req, res) => {
  try {
    const documents = await getUserDocs(req.user.id);
    const recentScans = await getUserScans(req.user.id, 5);
    
    return res.render("home/dashboard", {
      title: "Dashboard | DocScan",
      user: req.user,
      documents: documents,
      scans: recentScans
    });
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("/");
  }
});

export {renderLandingPage, renderDashboard}