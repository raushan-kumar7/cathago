import { Router } from "express";
import { authenticate, isAdmin } from "../middleware/auth.middleware.js";
import {
  creditRequestList,
  deleteDocument,
  getDocumentDetailsController,
  getSystemActivity,
  listDocuments,
  processCreditRequest,
  renderAdminDashboard,
  userLists,
} from "../controllers/admin.controller.js";

const adminRouter = Router();

adminRouter.use(authenticate);

adminRouter.route("/dashboard").get(renderAdminDashboard);
adminRouter.route("/users").get(userLists);
adminRouter.route("/credit-requests").get(creditRequestList);
adminRouter
  .route("/credit-requests/process")
  .post(isAdmin, processCreditRequest);
adminRouter
  .route("/documents")
  .get(isAdmin, listDocuments)
  .delete(isAdmin, deleteDocument);
adminRouter.route("/documents/:id").get(isAdmin, getDocumentDetailsController);
adminRouter.route("/system-activity").get(isAdmin, getSystemActivity);

export default adminRouter;