import { get_stats, list_users } from "../services/admin.service.js";
import {
  get_credits_requests,
  process_credit_request,
} from "../services/credit_request.service.js";
import { 
  deleteDoc, 
  getAllDocuments,
  getDocumentDetails 
} from "../services/document.service.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

// Render Admin Dashboard
const renderAdminDashboard = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    const { 
      documents, 
      totalDocuments, 
      totalPages, 
      currentPage 
    } = await getAllDocuments(page, limit);

    const stats = await get_stats();

    return res.render("admin/index", {
      title: "Admin Dashboard | DocScan",
      user: req.user,
      stats: stats,
      documents: documents,
      totalPages: totalPages,
      currentPage: currentPage,
      error: req.flash("error"),
      success: req.flash("success"),
      url: req.originalUrl,
    });
  } catch (error) {
    console.error("Dashboard rendering error:", error);
    req.flash("error", error.message || "Could not load dashboard");
    return res.redirect("/admin/dashboard");
  }
});

// List All Documents
const listDocuments = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    const { 
      documents, 
      totalPages, 
      currentPage 
    } = await getAllDocuments(page, limit);

    return res.render("admin/documents", {
      title: "All Documents | DocScan",
      user: req.user,
      documents: documents,
      totalPages: totalPages,
      currentPage: currentPage,
      error: req.flash("error"),
      success: req.flash("success"),
      url: req.originalUrl,
    });
  } catch (error) {
    console.error("Documents listing error:", error);
    req.flash("error", error.message || "Could not load documents");
    return res.redirect("/admin/dashboard");
  }
});


// Get Document Details
const getDocumentDetailsController = asyncHandler(async (req, res) => {
  try {
    const documentId = req.params.id;
    
    const document = await getDocumentDetails(documentId);
    
    if (req.headers.accept.includes('application/json')) {
      return res.json(document);
    }
    
    return res.render("admin/document-details", {
      title: "Document Details | DocScan",
      user: req.user,
      document: document,
      error: req.flash("error"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.error('Error fetching document details:', error);
    
    if (req.headers.accept.includes('application/json')) {
      return res.status(500).json({ 
        message: 'Could not fetch document details',
        error: error.message 
      });
    }
    
    req.flash("error", error.message || "Could not fetch document details");
    return res.redirect("/admin/documents");
  }
});

// Delete Document
const deleteDocument = asyncHandler(async (req, res) => {
  try {
    const { documentId } = req.body;

    // Ensure only admin can delete
    if (req.user.role !== "admin") {
      req.flash("error", "Unauthorized access");
      return res.redirect("/admin/documents");
    }

    await deleteDoc(documentId, null);

    req.flash("success", "Document deleted successfully");
    return res.redirect("/admin/documents");
  } catch (error) {
    console.error("Document deletion error:", error);
    req.flash("error", error.message || "Failed to delete document");
    return res.redirect("/admin/documents");
  }
});

// List Users
const userLists = asyncHandler(async (req, res) => {
  try {
    const { 
      users, 
      totalUsers, 
      totalPages, 
      currentPage 
    } = await list_users();

    return res.render("admin/users", {
      title: "User Lists | DocScan",
      user: req.user,
      users: users,
      totalUsers,
      totalPages,
      currentPage,
      error: req.flash("error"),
      success: req.flash("success"),
      url: req.originalUrl,
    });
  } catch (error) {
    req.flash("error", error.message || "Could not load user list");
    return res.redirect("/admin/dashboard");
  }
});

// Credit Request List
const creditRequestList = asyncHandler(async (req, res) => {
  try {
    const { 
      requests, 
      totalRequests, 
      totalPages, 
      currentPage 
    } = await get_credits_requests(req.query.page || 1, 10, {
      status: "pending",
    });

    return res.render("admin/credit-requests", {
      title: "Credit Requests | DocScan",
      user: req.user,
      requests: requests,
      totalRequests,
      totalPages,
      currentPage,
      error: req.flash("error"),
      success: req.flash("success"),
      url: req.originalUrl,
    });
  } catch (error) {
    req.flash("error", `Failed to load credit requests: ${error.message}`);
    return res.render("admin/credit-requests", {
      title: "Credit Requests | DocScan",
      user: req.user,
      requests: [],
      totalRequests: 0,
      totalPages: 0,
      currentPage: 1,
      error: req.flash("error"),
      success: req.flash("success"),
      url: req.originalUrl,
    });
  }
});

// Process Credit Request
const processCreditRequest = asyncHandler(async (req, res) => {
  try {
    const { requestId, status, reviewNotes } = req.body;

    if (req.user.role !== "admin") {
      req.flash("error", "Unauthorized access");
      return res.redirect("/admin/credit-requests");
    }

    if (!requestId || !status) {
      req.flash("error", "Invalid request parameters");
      return res.redirect("/admin/credit-requests");
    }

    const validStatuses = ["approved", "rejected"];
    if (!validStatuses.includes(status)) {
      req.flash("error", "Invalid status");
      return res.redirect("/admin/credit-requests");
    }

    await process_credit_request(
      requestId,
      req.user.id,
      status,
      reviewNotes || ""
    );

    req.flash("success", `Credit request ${status} successfully`);
    return res.redirect("/admin/credit-requests");
  } catch (error) {
    req.flash("error", error.message || "Failed to process credit request");
    return res.redirect("/admin/credit-requests");
  }
});

export {
  renderAdminDashboard,
  userLists,
  creditRequestList,
  processCreditRequest,
  listDocuments,
  deleteDocument,
  getDocumentDetailsController,
};