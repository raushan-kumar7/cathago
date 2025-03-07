// // import { Router } from "express"
// // import { aiDocsScans } from "../controllers/ai_scan.controller.js"
// // import { authenticate } from "../middleware/auth.middleware.js"

// // const aiScanRouter = Router();

// // aiScanRouter.use(authenticate);

// // aiScanRouter.route("/").get(aiDocsScans);

// // export default aiScanRouter;

// // import { Router } from "express";
// // import { 
// //   aiDocsScans, 
// //   newAIScan, 
// //   createAIScan, 
// //   viewAIScan 
// // } from "../controllers/ai_scan.controller.js";
// // import { authenticate } from "../middleware/auth.middleware.js";

// // const aiScanRouter = Router();

// // aiScanRouter.use(authenticate);

// // aiScanRouter.route("/").get(aiDocsScans);
// // aiScanRouter.route("/new").get(newAIScan);
// // aiScanRouter.route("/").post(createAIScan);
// // aiScanRouter.route("/:id").get(viewAIScan);

// // export default aiScanRouter;

// // routes/ai-scan.routes.js
// import { Router } from "express";
// import {
//   createAIDocScan,
//   renderAIScanDetails,
//   renderAIScanForm,
//   renderAIScanList,
//   downloadAIScanReport
// } from "../controllers/ai_scan.controller.js";
// import { authenticate } from "../middleware/auth.middleware.js";

// const aiScanRouter = Router();

// aiScanRouter.use(authenticate);

// // AI Scan routes
// aiScanRouter.route("/").get(renderAIScanList);
// aiScanRouter.route("/new").get(renderAIScanForm);
// aiScanRouter.route("/").post(createAIDocScan);
// aiScanRouter.route("/:id").get(renderAIScanDetails);
// aiScanRouter.route("/:id/download").get(downloadAIScanReport);

// export default aiScanRouter;