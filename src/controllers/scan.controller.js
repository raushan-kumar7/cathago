import { asyncHandler } from "../utils/AsyncHandler.js";
import {
  createScan,
  getScanById,
  getUserScans,
} from "../services/scan.service.js";
import { getUserDocs } from "../services/document.service.js";

const createDocScan = asyncHandler(async (req, res) => {
  try {
    const { documentId1, documentId2, scanOptions = [] } = req.body;
    
    // Validate document selections
    if (!documentId1 || !documentId2) {
      req.flash("error", "Please select two documents to compare");
      return res.redirect("/scans/new");
    }
    
    if (documentId1 === documentId2) {
      req.flash("error", "Please select two different documents");
      return res.redirect("/scans/new");
    }
    
    // Check if user has enough credits
    if (req.user.credits < 1) {
      req.flash("error", "Insufficient credits. Please purchase more credits to perform scans.");
      return res.redirect("/credits/purchase");
    }
    
    // Create scan with options
    const scanConfig = {
      strictComparison: scanOptions.includes('strictComparison'),
      highlightMatches: scanOptions.includes('highlightMatches'),
      generateReport: scanOptions.includes('generateReport')
    };
    
    const scan = await createScan(req.user.id, documentId1, documentId2, scanConfig);
    
    req.flash("success", "Scan completed successfully");
    return res.redirect(`/scans/${scan.id}`);
  } catch (error) {
    req.flash("error", error.message || "An error occurred during the scan process");
    return res.redirect("/scans/new");
  }
});

const renderScanForm = asyncHandler(async (req, res) => {
  try {
    const documents = await getUserDocs(req.user.id);
    const recentScans = await getUserScans(req.user.id, 5); 
    
    if (documents.length < 2) {
      req.flash("error", "You need at least two documents to create a scan");
      return res.redirect("/documents");
    }
    
    return res.render("scans/new", {
      title: "Document Scanner",
      subTitle: "Compare Documents",
      documents: documents,
      scans: recentScans,
      user: req.user || { credits: 0 }, 
      currentPage: 'scans',
    });
  } catch (error) {
    req.flash("error", error.message || "Could not load scan form");
    return res.redirect("/dashboard");
  }
});

const renderScanList = asyncHandler(async (req, res) => {
  try {
    const scans = await getUserScans(req.user.id);
    
    return res.render("scans/index", {
      title: "Scan History",
      subTitle: "Your Document Comparisons",
      scans,
      user: req.user || { credits: 0 },
      currentPage: 'scans'
    });
  } catch (error) {
    req.flash("error", error.message || "Could not load scan history");
    return res.redirect("/dashboard");
  }
});

const renderScanDetails = asyncHandler(async (req, res) => {
  try {
    const scan = await getScanById(req.params.id, req.user.id);
    
    if (!scan) {
      req.flash("error", "Scan not found or you don't have permission to view it");
      return res.redirect("/scans");
    }
    
    // Parse match details
    const matchDetails = JSON.parse(scan.matchDetails);
    
    return res.render("scans/detail", {
      title: "Scan Results",
      subTitle: `Comparison: ${scan.FirstDocument.originalName} vs ${scan.SecondDocument.originalName}`,
      scan,
      matchDetails,
      user: req.user || { credits: 0 },
      currentPage:'scans',
    });
  } catch (error) {
    req.flash("error", error.message || "Could not load scan details");
    return res.redirect("/scans");
  }
});

export { createDocScan, renderScanForm, renderScanList, renderScanDetails };