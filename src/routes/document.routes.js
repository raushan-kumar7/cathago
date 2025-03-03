import { Router } from "express";
import {
  deleteDocument,
  renderDocumentDetails,
  renderDocumentsList,
  renderUploadForm,
  uploadDocument,
} from "../controllers/document.controller.js";
import { upload } from "../middleware/upload.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js"

const docsRouter = Router();

docsRouter.use(authenticate);


docsRouter.route("/").get(renderDocumentsList);
docsRouter
  .route("/upload")
  .get(renderUploadForm)
  .post(upload.single("document"), uploadDocument);

docsRouter.route("/:id").get(renderDocumentDetails);
docsRouter.route("/:id/delete").post(deleteDocument);

export default docsRouter;