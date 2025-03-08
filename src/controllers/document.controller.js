import { asyncHandler } from "../utils/AsyncHandler.js";
import {
  createDocs,
  getDocsById,
  getUserDocs,
  deleteDoc,
} from "../services/document.service.js";
import {
  logError,
  logInfo,
  logWarning,
} from "../services/system_log.service.js";

const uploadDocument = asyncHandler(async (req, res) => {
  try {

    if (!req.file) {
      await logWarning("document", "Document upload attempt with no file", {
        userId: req.user.id,
        ipAddress: req.ip,
      });
      return res.status(400).render("error", { message: "No file uploaded" });
    }

    if (req.file.mimetype !== "application/pdf") {
      await logWarning("document", "Invalid document type upload attempt", {
        userId: req.user.id,
        ipAddress: req.ip,
        metadata: { mimetype: req.file.mimetype },
      });
      req.flash("error", "Only PDF files are supported");
      return res.redirect("/documents/upload");
    }

    const document = await createDocs(req.user.id, req.file);

    await logInfo("document", "Document uploaded successfully", {
      userId: req.user.id,
      ipAddress: req.ip,
      metadata: {
        documentId: document.id,
        fileName: req.file.originalname,
        fileSize: req.file.size,
      },
    });

    req.flash("success", "Document uploaded successfully");
    return res.redirect("/documents");
  } catch (error) {
    await logError("document", "Document upload failed", {
      userId: req.user.id,
      ipAddress: req.ip,
      metadata: {
        fileName: req.file?.originalname,
        error: error.message,
      },
    });
    req.flash("error", `Upload failed: ${error.message}`);
    return res.redirect("/documents");
  }
});

const renderUploadForm = asyncHandler(async (req, res) => {
  try {
    await logInfo("document", "Document upload form accessed", {
      userId: req.user.id,
      ipAddress: req.ip,
    });

    return res.render("documents/upload", {
      title: "Upload Document | DocScan",
      subTitle: "New",
      user: req.user || { credits: 0 },
      currentPage: "documents",
    });
  } catch (error) {
    await logError("document", "Error rendering upload form", {
      userId: req.user?.id,
      ipAddress: req.ip,
      metadata: { error: error.message },
    });
    req.flash("error", error.message);
    return res.redirect("/dashboard");
  }
});

const renderDocumentsList = asyncHandler(async (req, res) => {
  try {
    const documents = await getUserDocs(req.user.id);

    await logInfo("document", "Documents list accessed", {
      userId: req.user.id,
      ipAddress: req.ip,
      metadata: { documentCount: documents.length },
    });

    return res.render("documents/index", {
      title: "Documents | DocScan",
      documents,
      user: req.user || { credits: 0 },
      currentPage: "documents",
    });
  } catch (error) {
    await logError("document", "Error retrieving user documents", {
      userId: req.user?.id,
      ipAddress: req.ip,
      metadata: { error: error.message },
    });
    req.flash("error", error.message);
    return res.redirect("/dashboard");
  }
});


const renderDocumentDetails = asyncHandler(async (req, res) => {
  try {
    const document = await getDocsById(req.params.id, req.user.id);
    
    if (!document) {
      await logWarning("document", "Document not found or access denied", {
        userId: req.user.id,
        ipAddress: req.ip,
        metadata: { documentId: req.params.id },
      });

      req.flash("error", "Document not found");
      return res.redirect("/documents");
    }

    await logInfo("document", "Document details accessed", {
      userId: req.user.id,
      ipAddress: req.ip,
      metadata: {
        documentId: req.params.id,
        documentName: document.originalName,
      },
    });

    return res.render("documents/detail", {
      title: "Document | DocScan",
      subTitle: document.originalName,
      document,
      user: req.user || { credits: 0 },
      currentPage: "documents",
    });
  } catch (error) {
    await logError("document", "Error retrieving document details", {
      userId: req.user?.id,
      ipAddress: req.ip,
      metadata: {
        documentId: req.params.id,
        error: error.message,
      },
    });
    req.flash("error", error.message);
    return res.redirect("/documents");
  }
});


const deleteDocument = asyncHandler(async (req, res) => {
  try {
    await deleteDoc(req.params.id, req.user.id);
    await logInfo("document", "Document deleted", {
      userId: req.user.id,
      ipAddress: req.ip,
      metadata: { documentId: req.params.id },
    });
    req.flash("success", "Document deleted successfully");
    return res.redirect("/documents");
  } catch (error) {
    await logError("document", "Document deletion failed", {
      userId: req.user?.id,
      ipAddress: req.ip,
      metadata: {
        documentId: req.params.id,
        error: error.message,
      },
    });
    req.flash("error", error.message);
    return res.redirect("/documents");
  }
});

export {
  uploadDocument,
  renderDocumentDetails,
  renderDocumentsList,
  renderUploadForm,
  deleteDocument,
};