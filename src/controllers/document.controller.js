import { asyncHandler } from "../utils/AsyncHandler.js";
import {
  createDocs,
  getDocsById,
  getUserDocs,
  deleteDoc,
} from "../services/document.service.js";

const uploadDocument = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).render("error", { message: "No file uploaded" });
    }
    
    if (req.file.mimetype !== "application/pdf") {
      req.flash("error", "Only PDF files are supported");
      return res.redirect("/documents/upload");
    }
    
    const document = await createDocs(req.user.id, req.file);
    req.flash("success", "Document uploaded successfully");
    return res.redirect("/documents");
  } catch (error) {
    req.flash("error", `Upload failed: ${error.message}`);
    return res.redirect("/documents");
  }
});

const renderUploadForm = asyncHandler(async (req, res) => {
  try {
    return res.render("documents/upload", {
      title: "Upload Document | DocScan",
      subTitle: "New",
      user: req.user || { credits: 0 },
      currentPage: 'documents',
    });
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("/dashboard");
  }
});

const renderDocumentsList = asyncHandler(async (req, res) => {
  try {
    const documents = await getUserDocs(req.user.id);
    return res.render("documents/index", {
      title: "Documents | DocScan",
      documents,
      user: req.user || { credits: 0 },
      currentPage: 'documents',
    });
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("/dashboard");
  }
});

const renderDocumentDetails = asyncHandler(async (req, res) => {
  try {
    const document = await getDocsById(req.params.id, req.user.id);
    if (!document) {
      req.flash("error", "Document not found");
      return res.redirect("/documents");
    }
    return res.render("documents/detail", {
      title: "Document | DocScan",
      subTitle: document.originalName,
      document,
      user: req.user || { credits: 0 },
      currentPage: 'documents',
    });
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("/documents");
  }
});

const deleteDocument = asyncHandler(async (req, res) => {
  try {
    await deleteDoc(req.params.id, req.user.id);
    req.flash("success", "Document deleted successfully");
    return res.redirect("/documents");
  } catch (error) {
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