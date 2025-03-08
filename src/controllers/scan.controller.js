// import { asyncHandler } from "../utils/AsyncHandler.js";
// import {
//   createScan,
//   getScanById,
//   getUserScans,
// } from "../services/scan.service.js";
// import { getUserDocs } from "../services/document.service.js";

// const createDocScan = asyncHandler(async (req, res) => {
//   try {
//     const { documentId1, documentId2, scanOptions = [] } = req.body;

//     if (!documentId1 || !documentId2) {
//       req.flash("error", "Please select two documents to compare");
//       return res.redirect("/scans/new");
//     }

//     if (documentId1 === documentId2) {
//       req.flash("error", "Please select two different documents");
//       return res.redirect("/scans/new");
//     }

//     if (req.user.credits < 1) {
//       req.flash("error", "Insufficient credits. Please purchase more credits to perform scans.");
//       return res.redirect("/credits/purchase");
//     }

//     const scanConfig = {
//       strictComparison: scanOptions.includes('strictComparison'),
//       highlightMatches: scanOptions.includes('highlightMatches'),
//       generateReport: scanOptions.includes('generateReport')
//     };

//     const scan = await createScan(req.user.id, documentId1, documentId2, scanConfig);

//     req.flash("success", "Scan completed successfully");
//     return res.redirect(`/scans/${scan.id}`);
//   } catch (error) {
//     req.flash("error", error.message || "An error occurred during the scan process");
//     return res.redirect("/scans/new");
//   }
// });

// const renderScanForm = asyncHandler(async (req, res) => {
//   try {
//     const documents = await getUserDocs(req.user.id);
//     const recentScans = await getUserScans(req.user.id, 5);

//     if (documents.length < 2) {
//       req.flash("error", "You need at least two documents to create a scan");
//       return res.redirect("/documents");
//     }

//     return res.render("scans/new", {
//       title: "Document Scanner | DocScan",
//       subTitle: "Compare Documents",
//       documents: documents,
//       scans: recentScans,
//       user: req.user || { credits: 0 },
//       currentPage: 'scans',
//     });
//   } catch (error) {
//     req.flash("error", error.message || "Could not load scan form");
//     return res.redirect("/dashboard");
//   }
// });

// const renderScanList = asyncHandler(async (req, res) => {
//   try {
//     const scans = await getUserScans(req.user.id);

//     return res.render("scans/index", {
//       title: "Scan History | DocScan",
//       subTitle: "Your Document Comparisons",
//       scans,
//       user: req.user || { credits: 0 },
//       currentPage: 'scans'
//     });
//   } catch (error) {
//     req.flash("error", error.message || "Could not load scan history");
//     return res.redirect("/dashboard");
//   }
// });

// const renderScanDetails = asyncHandler(async (req, res) => {
//   try {
//     const scan = await getScanById(req.params.id, req.user.id);

//     if (!scan) {
//       req.flash("error", "Scan not found or you don't have permission to view it");
//       return res.redirect("/scans");
//     }

//     const matchDetails = JSON.parse(scan.matchDetails);

//     return res.render("scans/detail", {
//       title: "Scan Results | DocScan",
//       subTitle: `Comparison: ${scan.FirstDocument.originalName} vs ${scan.SecondDocument.originalName}`,
//       scan,
//       matchDetails,
//       user: req.user || { credits: 0 },
//       currentPage:'scans',
//     });
//   } catch (error) {
//     req.flash("error", error.message || "Could not load scan details");
//     return res.redirect("/scans");
//   }
// });

// export { createDocScan, renderScanForm, renderScanList, renderScanDetails };

// // controllers/scan.controller.js
// import { asyncHandler } from "../utils/AsyncHandler.js";
// import {
//   createScan,
//   getScanById,
//   getUserScans,
// } from "../services/scan.service.js";
// import { getUserDocs } from "../services/document.service.js";
// import { generateScanReport } from "../utils/TextCompare.js";
// import {
//   logInfo,
//   logError,
//   logWarning,
// } from "../services/system_log.service.js";

// const createDocScan = asyncHandler(async (req, res) => {
//   try {
//     const { documentId1, documentId2, scanOptions = [] } = req.body;

//     // if (!documentId1 || !documentId2) {
//     //   req.flash("error", "Please select two documents to compare");
//     //   return res.redirect("/scans/new");
//     // }

//     // if (documentId1 === documentId2) {
//     //   req.flash("error", "Please select two different documents");
//     //   return res.redirect("/scans/new");
//     // }

//     // if (req.user.credits < 1) {
//     //   req.flash("error", "Insufficient credits. Please purchase more credits to perform scans.");
//     //   return res.redirect("/credit-request");
//     // }

//     if (!documentId1 || !documentId2) {
//       logWarning("scan", "Scan creation failed - missing document IDs", {
//         userId: req.user.id,
//         ipAddress: req.ip,
//         metadata: { documentId1, documentId2 },
//       });
//       req.flash("error", "Please select two documents to compare");
//       return res.redirect("/scans/new");
//     }

//     if (documentId1 === documentId2) {
//       logWarning(
//         "scan",
//         "Scan creation failed - same document selected twice",
//         {
//           userId: req.user.id,
//           ipAddress: req.ip,
//           metadata: { documentId: documentId1 },
//         }
//       );
//       req.flash("error", "Please select two different documents");
//       return res.redirect("/scans/new");
//     }

//     if (req.user.credits < 1) {
//       logWarning("credits", "Scan creation failed - insufficient credits", {
//         userId: req.user.id,
//         ipAddress: req.ip,
//         metadata: { userCredits: req.user.credits },
//       });
//       req.flash(
//         "error",
//         "Insufficient credits. Please purchase more credits to perform scans."
//       );
//       return res.redirect("/credit-request");
//     }

//     const scanConfig = {
//       strictComparison: scanOptions.includes("strictComparison"),
//       highlightMatches: scanOptions.includes("highlightMatches"),
//       generateReport: scanOptions.includes("generateReport"),
//     };

//     logInfo("scan", "Creating document scan", {
//       userId: req.user.id,
//       ipAddress: req.ip,
//       metadata: {
//         documentId1,
//         documentId2,
//         scanConfig,
//       },
//     });

//     const scan = await createScan(
//       req.user.id,
//       documentId1,
//       documentId2,
//       scanConfig
//     );

//     logInfo("scan", "Document scan completed successfully", {
//       userId: req.user.id,
//       ipAddress: req.ip,
//       metadata: {
//         scanId: scan.id,
//         matchPercentage: scan.matchPercentage,
//       },
//     });

//     req.flash("success", "Scan completed successfully");
//     return res.redirect(`/scans/${scan.id}`);
//   } catch (error) {
//     logError("scan", "Error during document scan process", {
//       userId: req.user?.id,
//       ipAddress: req.ip,
//       metadata: {
//         errorMessage: error.message,
//         documentId1: req.body?.documentId1,
//         documentId2: req.body?.documentId2,
//       },
//     });
//     req.flash(
//       "error",
//       error.message || "An error occurred during the scan process"
//     );
//     return res.redirect("/scans/new");
//   }
// });

// const renderScanForm = asyncHandler(async (req, res) => {
//   try {
//     logInfo("navigation", "Accessing new scan form", {
//       userId: req.user.id,
//       ipAddress: req.ip,
//     });

//     const documents = await getUserDocs(req.user.id);
//     const recentScans = await getUserScans(req.user.id, 5);

//     // if (documents.length < 2) {
//     //   req.flash("error", "You need at least two documents to create a scan");
//     //   return res.redirect("/documents");
//     // }

//     if (documents.length < 2) {
//       logWarning("scan", "Cannot create scan - insufficient documents", {
//         userId: req.user.id,
//         ipAddress: req.ip,
//         metadata: { documentCount: documents.length },
//       });
//       req.flash("error", "You need at least two documents to create a scan");
//       return res.redirect("/documents");
//     }

//     return res.render("scans/new", {
//       title: "Document Scanner | DocScan",
//       subTitle: "Compare Documents",
//       documents: documents,
//       scans: recentScans,
//       user: req.user || { credits: 0 },
//       currentPage: "scans",
//     });
//   } catch (error) {
//     logError("scan", "Error rendering scan form", {
//       userId: req.user?.id,
//       ipAddress: req.ip,
//       metadata: { errorMessage: error.message },
//     });
//     req.flash("error", error.message || "Could not load scan form");
//     return res.redirect("/dashboard");
//   }
// });

// const renderScanList = asyncHandler(async (req, res) => {
//   try {
//     logInfo("navigation", "Accessing scan history", {
//       userId: req.user.id,
//       ipAddress: req.ip,
//     });

//     const scans = await getUserScans(req.user.id);

//     logInfo("data_retrieval", "Retrieved user scan history", {
//       userId: req.user.id,
//       metadata: { scanCount: scans.length },
//     });

//     return res.render("scans/index", {
//       title: "Scan History | DocScan",
//       subTitle: "Your Document Comparisons",
//       scans,
//       user: req.user || { credits: 0 },
//       currentPage: "scans",
//     });
//   } catch (error) {
//     logError("scan", "Error retrieving scan history", {
//       userId: req.user?.id,
//       ipAddress: req.ip,
//       metadata: { errorMessage: error.message },
//     });
//     req.flash("error", error.message || "Could not load scan history");
//     return res.redirect("/dashboard");
//   }
// });

// const renderScanDetails = asyncHandler(async (req, res) => {
//   try {
//     const scan = await getScanById(req.params.id, req.user.id);

//     // if (!scan) {
//     //   req.flash("error", "Scan not found or you don't have permission to view it");
//     //   return res.redirect("/scans");
//     // }

//     if (!scan) {
//       logWarning("scan", "Scan not found or unauthorized access", {
//         userId: req.user.id,
//         ipAddress: req.ip,
//         metadata: { scanId },
//       });
//       req.flash(
//         "error",
//         "Scan not found or you don't have permission to view it"
//       );
//       return res.redirect("/scans");
//     }

//     const matchDetails = JSON.parse(scan.matchDetails);

//     logInfo("data_retrieval", "Retrieved scan details", {
//       userId: req.user.id,
//       metadata: {
//         scanId,
//         matchPercentage: scan.matchPercentage,
//       },
//     });

//     return res.render("scans/detail", {
//       title: "Scan Results | DocScan",
//       subTitle: `Comparison: ${scan.FirstDocument.originalName} vs ${scan.SecondDocument.originalName}`,
//       scan,
//       matchDetails,
//       user: req.user || { credits: 0 },
//       currentPage: "scans",
//     });
//   } catch (error) {
//     logError("scan", "Error retrieving scan details", {
//       userId: req.user?.id,
//       ipAddress: req.ip,
//       metadata: {
//         scanId: req.params.id,
//         errorMessage: error.message,
//       },
//     });
//     req.flash("error", error.message || "Could not load scan details");
//     return res.redirect("/scans");
//   }
// });

// /**
//  * Download scan report
//  */
// const downloadScanReport = asyncHandler(async (req, res) => {
//   try {
//     const scan = await getScanById(req.params.id, req.user.id);

//     // if (!scan) {
//     //   req.flash("error", "Scan not found or you don't have permission to download it");
//     //   return res.redirect("/scans");
//     // }

//     if (!scan) {
//       logWarning(
//         "scan",
//         "Report download failed - scan not found or unauthorized access",
//         {
//           userId: req.user.id,
//           ipAddress: req.ip,
//           metadata: { scanId },
//         }
//       );
//       req.flash(
//         "error",
//         "Scan not found or you don't have permission to download it"
//       );
//       return res.redirect("/scans");
//     }

//     const matchDetails = JSON.parse(scan.matchDetails);
//     const report = generateScanReport(scan, matchDetails);

//     logInfo("document_operation", "Scan report generated successfully", {
//       userId: req.user.id,
//       metadata: {
//         scanId,
//         reportSize: report.length,
//       },
//     });

//     // Set headers for text file download
//     res.setHeader(
//       "Content-disposition",
//       `attachment; filename=scan-report-${scan.id}.txt`
//     );
//     res.setHeader("Content-type", "text/plain");

//     return res.send(report);
//   } catch (error) {
//     logError("scan", "Error generating or downloading scan report", {
//       userId: req.user?.id,
//       ipAddress: req.ip,
//       metadata: {
//         scanId: req.params.id,
//         errorMessage: error.message,
//       },
//     });
//     req.flash("error", error.message || "Could not download report");
//     return res.redirect(`/scans/${req.params.id}`);
//   }
// });

// export {
//   createDocScan,
//   renderScanForm,
//   renderScanList,
//   renderScanDetails,
//   downloadScanReport,
// };


// import { asyncHandler } from "../utils/AsyncHandler.js";
// import {
//   createScan,
//   getScanById,
//   getUserScans,
// } from "../services/scan.service.js";
// import { getUserDocs } from "../services/document.service.js";
// import { generateScanReport } from "../utils/TextCompare.js";
// import { logInfo, logWarning, logError } from "../services/system_log.service.js";

// const createDocScan = asyncHandler(async (req, res) => {
//   try {
//     const { documentId1, documentId2, scanOptions = [] } = req.body;
    
//     if (!documentId1 || !documentId2) {
//       logWarning("scan", "Scan creation failed - missing document IDs", {
//         userId: req.user.id,
//         ipAddress: req.ip,
//         metadata: { documentId1, documentId2 }
//       });
//       req.flash("error", "Please select two documents to compare");
//       return res.redirect("/scans/new");
//     }
    
//     if (documentId1 === documentId2) {
//       logWarning("scan", "Scan creation failed - same document selected twice", {
//         userId: req.user.id,
//         ipAddress: req.ip,
//         metadata: { documentId: documentId1 }
//       });
//       req.flash("error", "Please select two different documents");
//       return res.redirect("/scans/new");
//     }
    
//     if (req.user.credits < 1) {
//       logWarning("credits", "Scan creation failed - insufficient credits", {
//         userId: req.user.id,
//         ipAddress: req.ip,
//         metadata: { userCredits: req.user.credits }
//       });
//       req.flash("error", "Insufficient credits. Please purchase more credits to perform scans.");
//       return res.redirect("/credit-request");
//     }
    
//     const scanConfig = {
//       strictComparison: scanOptions.includes('strictComparison'),
//       highlightMatches: scanOptions.includes('highlightMatches'),
//       generateReport: scanOptions.includes('generateReport')
//     };
    
//     logInfo("scan", "Creating document scan", {
//       userId: req.user.id,
//       ipAddress: req.ip,
//       metadata: { 
//         documentId1, 
//         documentId2, 
//         scanConfig 
//       }
//     });
    
//     const scan = await createScan(req.user.id, documentId1, documentId2, scanConfig);
    
//     logInfo("scan", "Document scan completed successfully", {
//       userId: req.user.id,
//       ipAddress: req.ip,
//       metadata: { 
//         scanId: scan.id,
//         matchPercentage: scan.matchPercentage 
//       }
//     });

//     console.log("Scan Id: ", scan.id);
    
//     req.flash("success", "Scan completed successfully");
//     return res.redirect(`/scans/${scan.id}`);
//   } catch (error) {
//     logError("scan", "Error during document scan process", {
//       userId: req.user?.id,
//       ipAddress: req.ip,
//       metadata: { 
//         errorMessage: error.message,
//         documentId1: req.body?.documentId1,
//         documentId2: req.body?.documentId2
//       }
//     });
//     req.flash("error", error.message || "An error occurred during the scan process");
//     return res.redirect("/scans/new");
//   }
// });

// const renderScanForm = asyncHandler(async (req, res) => {
//   try {
//     logInfo("navigation", "Accessing new scan form", {
//       userId: req.user.id,
//       ipAddress: req.ip
//     });
    
//     const documents = await getUserDocs(req.user.id);
//     const recentScans = await getUserScans(req.user.id, 5); 
    
//     if (documents.length < 2) {
//       logWarning("scan", "Cannot create scan - insufficient documents", {
//         userId: req.user.id,
//         ipAddress: req.ip,
//         metadata: { documentCount: documents.length }
//       });
//       req.flash("error", "You need at least two documents to create a scan");
//       return res.redirect("/documents");
//     }
    
//     return res.render("scans/new", {
//       title: "Document Scanner | DocScan",
//       subTitle: "Compare Documents",
//       documents: documents,
//       scans: recentScans,
//       user: req.user || { credits: 0 }, 
//       currentPage: 'scans',
//     });
//   } catch (error) {
//     logError("scan", "Error rendering scan form", {
//       userId: req.user?.id,
//       ipAddress: req.ip,
//       metadata: { errorMessage: error.message }
//     });
//     req.flash("error", error.message || "Could not load scan form");
//     return res.redirect("/dashboard");
//   }
// });

// const renderScanList = asyncHandler(async (req, res) => {
//   try {
//     logInfo("navigation", "Accessing scan history", {
//       userId: req.user.id,
//       ipAddress: req.ip
//     });
    
//     const scans = await getUserScans(req.user.id);
    
//     logInfo("data_retrieval", "Retrieved user scan history", {
//       userId: req.user.id,
//       metadata: { scanCount: scans.length }
//     });
    
//     return res.render("scans/index", {
//       title: "Scan History | DocScan",
//       subTitle: "Your Document Comparisons",
//       scans,
//       user: req.user || { credits: 0 },
//       currentPage: 'scans'
//     });
//   } catch (error) {
//     logError("scan", "Error retrieving scan history", {
//       userId: req.user?.id,
//       ipAddress: req.ip,
//       metadata: { errorMessage: error.message }
//     });
//     req.flash("error", error.message || "Could not load scan history");
//     return res.redirect("/dashboard");
//   }
// });

// const renderScanDetails = asyncHandler(async (req, res) => {
//   try {
//     const scanId = req.params.id;
    
//     logInfo("navigation", "Accessing scan details", {
//       userId: req.user.id,
//       ipAddress: req.ip,
//       metadata: { scanId }
//     });
    
//     const scan = await getScanById(scanId, req.user.id);
    
//     if (!scan) {
//       logWarning("scan", "Scan not found or unauthorized access", {
//         userId: req.user.id,
//         ipAddress: req.ip,
//         metadata: { scanId }
//       });
//       req.flash("error", "Scan not found or you don't have permission to view it");
//       return res.redirect("/scans");
//     }
    
//     const matchDetails = JSON.parse(scan.matchDetails);
    
//     logInfo("data_retrieval", "Retrieved scan details", {
//       userId: req.user.id,
//       metadata: { 
//         scanId,
//         matchPercentage: scan.matchPercentage
//       }
//     });
    
//     return res.render("scans/detail", {
//       title: "Scan Results | DocScan",
//       subTitle: `Comparison: ${scan.FirstDocument.originalName} vs ${scan.SecondDocument.originalName}`,
//       scan,
//       matchDetails,
//       user: req.user || { credits: 0 },
//       currentPage:'scans',
//     });
//   } catch (error) {
//     logError("scan", "Error retrieving scan details", {
//       userId: req.user?.id,
//       ipAddress: req.ip,
//       metadata: { 
//         scanId: req.params.id,
//         errorMessage: error.message 
//       }
//     });
//     req.flash("error", error.message || "Could not load scan details");
//     return res.redirect("/scans");
//   }
// });

// /**
//  * Download scan report
//  */
// const downloadScanReport = asyncHandler(async (req, res) => {
//   try {
//     const scanId = req.params.id;
    
//     logInfo("document_operation", "Downloading scan report", {
//       userId: req.user.id,
//       ipAddress: req.ip,
//       metadata: { scanId }
//     });
    
//     const scan = await getScanById(scanId, req.user.id);
    
//     if (!scan) {
//       logWarning("scan", "Report download failed - scan not found or unauthorized access", {
//         userId: req.user.id,
//         ipAddress: req.ip,
//         metadata: { scanId }
//       });
//       req.flash("error", "Scan not found or you don't have permission to download it");
//       return res.redirect("/scans");
//     }
    
//     const matchDetails = JSON.parse(scan.matchDetails);
//     const report = generateScanReport(scan, matchDetails);
    
//     logInfo("document_operation", "Scan report generated successfully", {
//       userId: req.user.id,
//       metadata: { 
//         scanId,
//         reportSize: report.length
//       }
//     });
    
//     // Set headers for text file download
//     res.setHeader('Content-disposition', `attachment; filename=scan-report-${scan.id}.txt`);
//     res.setHeader('Content-type', 'text/plain');
    
//     return res.send(report);
//   } catch (error) {
//     logError("scan", "Error generating or downloading scan report", {
//       userId: req.user?.id,
//       ipAddress: req.ip,
//       metadata: { 
//         scanId: req.params.id,
//         errorMessage: error.message 
//       }
//     });
//     req.flash("error", error.message || "Could not download report");
//     return res.redirect(`/scans/${req.params.id}`);
//   }
// });

// export { createDocScan, renderScanForm, renderScanList, renderScanDetails, downloadScanReport };


import { asyncHandler } from "../utils/AsyncHandler.js";
import {
  createScan,
  getScanById,
  getUserScans,
} from "../services/scan.service.js";
import { getUserDocs } from "../services/document.service.js";
import { generateScanReport } from "../utils/TextCompare.js";
import { logInfo, logWarning, logError } from "../services/system_log.service.js";

const createDocScan = asyncHandler(async (req, res) => {
  try {
    const { documentId1, documentId2, scanOptions = [] } = req.body;
    
    if (!documentId1 || !documentId2) {
      logWarning("scan", "Scan creation failed - missing document IDs", {
        userId: req.user.id,
        ipAddress: req.ip,
        metadata: { documentId1, documentId2 }
      });
      req.flash("error", "Please select two documents to compare");
      return res.redirect("/scans/new");
    }
    
    if (documentId1 === documentId2) {
      logWarning("scan", "Scan creation failed - same document selected twice", {
        userId: req.user.id,
        ipAddress: req.ip,
        metadata: { documentId: documentId1 }
      });
      req.flash("error", "Please select two different documents");
      return res.redirect("/scans/new");
    }
    
    if (req.user.credits < 1) {
      logWarning("credits", "Scan creation failed - insufficient credits", {
        userId: req.user.id,
        ipAddress: req.ip,
        metadata: { userCredits: req.user.credits }
      });
      req.flash("error", "Insufficient credits. Please purchase more credits to perform scans.");
      return res.redirect("/credit-request");
    }
    
    const scanConfig = {
      strictComparison: scanOptions.includes('strictComparison'),
      highlightMatches: scanOptions.includes('highlightMatches'),
      generateReport: scanOptions.includes('generateReport')
    };
    
    logInfo("scan", "Creating document scan", {
      userId: req.user.id,
      ipAddress: req.ip,
      metadata: { 
        documentId1, 
        documentId2, 
        scanConfig 
      }
    });
    
    const scan = await createScan(req.user.id, documentId1, documentId2, scanConfig);
    
    logInfo("scan", "Document scan completed successfully", {
      userId: req.user.id,
      ipAddress: req.ip,
      metadata: { 
        scanId: scan.id,
        matchPercentage: scan.matchPercentage 
      }
    });
    
    req.flash("success", "Scan completed successfully");
    return res.redirect(`/scans/${scan.id}`);
  } catch (error) {
    logError("scan", "Error during document scan process", {
      userId: req.user?.id,
      ipAddress: req.ip,
      metadata: { 
        errorMessage: error.message,
        documentId1: req.body?.documentId1,
        documentId2: req.body?.documentId2
      }
    });
    req.flash("error", error.message || "An error occurred during the scan process");
    return res.redirect("/scans/new");
  }
});

const renderScanForm = asyncHandler(async (req, res) => {
  try {
    logInfo("navigation", "Accessing new scan form", {
      userId: req.user.id,
      ipAddress: req.ip
    });
    
    const documents = await getUserDocs(req.user.id);
    const recentScans = await getUserScans(req.user.id, 5); 
    
    if (documents.length < 2) {
      logWarning("scan", "Cannot create scan - insufficient documents", {
        userId: req.user.id,
        ipAddress: req.ip,
        metadata: { documentCount: documents.length }
      });
      req.flash("error", "You need at least two documents to create a scan");
      return res.redirect("/documents");
    }
    
    return res.render("scans/new", {
      title: "Document Scanner | DocScan",
      subTitle: "Compare Documents",
      documents: documents,
      scans: recentScans,
      user: req.user || { credits: 0 }, 
      currentPage: 'scans',
    });
  } catch (error) {
    logError("scan", "Error rendering scan form", {
      userId: req.user?.id,
      ipAddress: req.ip,
      metadata: { errorMessage: error.message }
    });
    req.flash("error", error.message || "Could not load scan form");
    return res.redirect("/dashboard");
  }
});


const renderAIScan = asyncHandler(async (req, res) => {
  
});

const renderScanList = asyncHandler(async (req, res) => {
  try {
    logInfo("navigation", "Accessing scan history", {
      userId: req.user.id,
      ipAddress: req.ip
    });
    
    const scans = await getUserScans(req.user.id);
    
    logInfo("data_retrieval", "Retrieved user scan history", {
      userId: req.user.id,
      metadata: { scanCount: scans.length }
    });
    
    return res.render("scans/index", {
      title: "Scan History | DocScan",
      subTitle: "Your Document Comparisons",
      scans,
      user: req.user || { credits: 0 },
      currentPage: 'scans'
    });
  } catch (error) {
    logError("scan", "Error retrieving scan history", {
      userId: req.user?.id,
      ipAddress: req.ip,
      metadata: { errorMessage: error.message }
    });
    req.flash("error", error.message || "Could not load scan history");
    return res.redirect("/dashboard");
  }
});

const renderScanDetails = asyncHandler(async (req, res) => {
  try {
    const scanId = req.params.id;
    
    logInfo("navigation", "Accessing scan details", {
      userId: req.user.id,
      ipAddress: req.ip,
      metadata: { scanId }
    });
    
    const scan = await getScanById(scanId, req.user.id);
    
    if (!scan) {
      logWarning("scan", "Scan not found or unauthorized access", {
        userId: req.user.id,
        ipAddress: req.ip,
        metadata: { scanId }
      });
      req.flash("error", "Scan not found or you don't have permission to view it");
      return res.redirect("/scans");
    }
    
    const matchDetails = JSON.parse(scan.matchDetails);
    
    logInfo("data_retrieval", "Retrieved scan details", {
      userId: req.user.id,
      metadata: { 
        scanId,
        matchPercentage: scan.matchPercentage
      }
    });
    
    return res.render("scans/detail", {
      title: "Scan Results | DocScan",
      subTitle: `Comparison: ${scan.FirstDocument.originalName} vs ${scan.SecondDocument.originalName}`,
      scan,
      matchDetails,
      user: req.user || { credits: 0 },
      currentPage:'scans',
    });
  } catch (error) {
    logError("scan", "Error retrieving scan details", {
      userId: req.user?.id,
      ipAddress: req.ip,
      metadata: { 
        scanId: req.params.id,
        errorMessage: error.message 
      }
    });
    req.flash("error", error.message || "Could not load scan details");
    return res.redirect("/scans");
  }
});

/**
 * Download scan report
 */
const downloadScanReport = asyncHandler(async (req, res) => {
  try {
    const scanId = req.params.id;
    
    logInfo("document_operation", "Downloading scan report", {
      userId: req.user.id,
      ipAddress: req.ip,
      metadata: { scanId }
    });
    
    const scan = await getScanById(scanId, req.user.id);
    
    if (!scan) {
      logWarning("scan", "Report download failed - scan not found or unauthorized access", {
        userId: req.user.id,
        ipAddress: req.ip,
        metadata: { scanId }
      });
      req.flash("error", "Scan not found or you don't have permission to download it");
      return res.redirect("/scans");
    }
    
    const matchDetails = JSON.parse(scan.matchDetails);
    const report = generateScanReport(scan, matchDetails);
    
    logInfo("document_operation", "Scan report generated successfully", {
      userId: req.user.id,
      metadata: { 
        scanId,
        reportSize: report.length
      }
    });
    
    // Set headers for text file download
    res.setHeader('Content-disposition', `attachment; filename=scan-report-${scan.id}.txt`);
    res.setHeader('Content-type', 'text/plain');
    
    return res.send(report);
  } catch (error) {
    logError("scan", "Error generating or downloading scan report", {
      userId: req.user?.id,
      ipAddress: req.ip,
      metadata: { 
        scanId: req.params.id,
        errorMessage: error.message 
      }
    });
    req.flash("error", error.message || "Could not download report");
    return res.redirect(`/scans/${req.params.id}`);
  }
});

/**
 * Generate scan history document for user
 */
const exportScanHistory = asyncHandler(async (req, res) => {
  try {
    logInfo("document_operation", "Exporting scan history document", {
      userId: req.user.id,
      ipAddress: req.ip
    });
    
    const scans = await getUserScans(req.user.id);
    
    if (!scans || scans.length === 0) {
      logWarning("scan", "Export failed - no scan history found", {
        userId: req.user.id,
        ipAddress: req.ip
      });
      req.flash("error", "No scan history available to export");
      return res.redirect("/scans");
    }
    
    // Generate formatted document with scan history
    let documentContent = `DocScan - Scan History Report\n`;
    documentContent += `Generated on: ${new Date().toLocaleString()}\n`;
    documentContent += `User: ${req.user.email || req.user.username}\n\n`;
    documentContent += `Total Scans: ${scans.length}\n\n`;
    documentContent += `=================================================\n\n`;
    
    // Add each scan to the document
    scans.forEach((scan, index) => {
      const scanDate = new Date(scan.createdAt).toLocaleString();
      const doc1Name = scan.FirstDocument?.originalName || scan.doc1Title || 'Document 1';
      const doc2Name = scan.SecondDocument?.originalName || scan.doc2Title || 'Document 2';
      const matchPercent = scan.matchPercentage || 0;
      
      documentContent += `Scan #${index + 1}\n`;
      documentContent += `Date: ${scanDate}\n`;
      documentContent += `Documents Compared: ${doc1Name} and ${doc2Name}\n`;
      documentContent += `Match Percentage: ${matchPercent.toFixed(1)}%\n`;
      documentContent += `Scan ID: ${scan.id}\n`;
      
      // Add scan options if available
      if (scan.scanConfig && typeof scan.scanConfig === 'string') {
        try {
          const config = JSON.parse(scan.scanConfig);
          documentContent += `Options: ${config.strictComparison ? 'Strict comparison, ' : ''}`;
          documentContent += `${config.highlightMatches ? 'Highlight matches, ' : ''}`;
          documentContent += `${config.generateReport ? 'Detailed report' : ''}\n`;
        } catch (e) {
          // Parse error, skip options
        }
      }
      
      documentContent += `\n-------------------------------------------------\n\n`;
    });
    
    logInfo("document_operation", "Scan history document generated successfully", {
      userId: req.user.id,
      metadata: { 
        scanCount: scans.length,
        documentSize: documentContent.length
      }
    });
    
    // Set headers for text file download
    res.setHeader('Content-disposition', `attachment; filename=scan-history-${Date.now()}.txt`);
    res.setHeader('Content-type', 'text/plain');
    
    return res.send(documentContent);
  } catch (error) {
    logError("scan", "Error generating scan history document", {
      userId: req.user?.id,
      ipAddress: req.ip,
      metadata: { errorMessage: error.message }
    });
    req.flash("error", error.message || "Could not generate scan history document");
    return res.redirect("/scans");
  }
});

/**
 * Generate individual scan documentation for download
 */
const downloadScanDocument = asyncHandler(async (req, res) => {
  try {
    const scanId = req.params.id;
    
    logInfo("document_operation", "Downloading scan documentation", {
      userId: req.user.id,
      ipAddress: req.ip,
      metadata: { scanId }
    });
    
    const scan = await getScanById(scanId, req.user.id);
    
    if (!scan) {
      logWarning("scan", "Documentation download failed - scan not found or unauthorized access", {
        userId: req.user.id,
        ipAddress: req.ip,
        metadata: { scanId }
      });
      req.flash("error", "Scan not found or you don't have permission to access it");
      return res.redirect("/scans");
    }
    
    const matchDetails = JSON.parse(scan.matchDetails);
    
    // Generate formatted document for this scan
    let documentContent = `DocScan - Scan Documentation\n`;
    documentContent += `Generated on: ${new Date().toLocaleString()}\n`;
    documentContent += `Scan Date: ${new Date(scan.createdAt).toLocaleString()}\n`;
    documentContent += `User: ${req.user.email || req.user.username}\n\n`;
    documentContent += `=================================================\n\n`;
    
    // Scan details
    documentContent += `SCAN DETAILS\n`;
    documentContent += `-------------------------------------------------\n`;
    documentContent += `Scan ID: ${scan.id}\n`;
    documentContent += `First Document: ${scan.FirstDocument?.originalName || 'Document 1'}\n`;
    documentContent += `Second Document: ${scan.SecondDocument?.originalName || 'Document 2'}\n`;
    documentContent += `Match Percentage: ${scan.matchPercentage?.toFixed(1) || '0.0'}%\n\n`;
    
    // Scan configuration
    if (scan.scanConfig && typeof scan.scanConfig === 'string') {
      try {
        const config = JSON.parse(scan.scanConfig);
        documentContent += `SCAN CONFIGURATION\n`;
        documentContent += `-------------------------------------------------\n`;
        documentContent += `Strict Comparison: ${config.strictComparison ? 'Yes' : 'No'}\n`;
        documentContent += `Highlight Matches: ${config.highlightMatches ? 'Yes' : 'No'}\n`;
        documentContent += `Generate Report: ${config.generateReport ? 'Yes' : 'No'}\n\n`;
      } catch (e) {
        // Parse error, skip config section
      }
    }
    
    // Match details summary
    documentContent += `MATCH DETAILS\n`;
    documentContent += `-------------------------------------------------\n`;
    
    if (matchDetails) {
      if (matchDetails.matches && Array.isArray(matchDetails.matches)) {
        documentContent += `Number of matches found: ${matchDetails.matches.length}\n\n`;
        
        // List first 10 matches as examples
        const matchesToShow = matchDetails.matches.slice(0, 10);
        documentContent += `SAMPLE MATCHES:\n`;
        
        matchesToShow.forEach((match, index) => {
          documentContent += `Match #${index + 1}:\n`;
          documentContent += `  Document 1: "${match.text1.substring(0, 50)}${match.text1.length > 50 ? '...' : ''}"\n`;
          documentContent += `  Document 2: "${match.text2.substring(0, 50)}${match.text2.length > 50 ? '...' : ''}"\n`;
          documentContent += `  Length: ${match.length} characters\n\n`;
        });
        
        if (matchDetails.matches.length > 10) {
          documentContent += `... and ${matchDetails.matches.length - 10} more matches\n\n`;
        }
      }
    } else {
      documentContent += `No detailed match information available.\n\n`;
    }
    
    // Conclusion
    documentContent += `=================================================\n`;
    documentContent += `CONCLUSION\n`;
    documentContent += `-------------------------------------------------\n`;
    
    let conclusionText = "The documents show ";
    if (scan.matchPercentage > 70) {
      conclusionText += "high similarity levels, which may indicate significant content duplication.";
    } else if (scan.matchPercentage > 30) {
      conclusionText += "moderate similarity, with some matching content.";
    } else {
      conclusionText += "low similarity, with minimal matching content.";
    }
    
    documentContent += `${conclusionText}\n\n`;
    documentContent += `For further details, please view the full scan report in your DocScan account.\n`;
    
    logInfo("document_operation", "Scan documentation generated successfully", {
      userId: req.user.id,
      metadata: { 
        scanId,
        documentSize: documentContent.length
      }
    });
    
    // Set headers for text file download
    res.setHeader('Content-disposition', `attachment; filename=scan-documentation-${scan.id}.txt`);
    res.setHeader('Content-type', 'text/plain');
    
    return res.send(documentContent);
  } catch (error) {
    logError("scan", "Error generating scan documentation", {
      userId: req.user?.id,
      ipAddress: req.ip,
      metadata: { 
        scanId: req.params.id,
        errorMessage: error.message 
      }
    });
    req.flash("error", error.message || "Could not generate scan documentation");
    return res.redirect(`/scans/${req.params.id}`);
  }
});

export { 
  createDocScan, 
  renderScanForm, 
  renderScanList, 
  renderScanDetails, 
  downloadScanReport,
  exportScanHistory,
  downloadScanDocument
};