// import { Router } from "express";
// import {
//   createDocAIMatch,
//   renderAIMatchDetails,
//   renderAIMatchForm,
//   renderAIMatchList,
// } from "../controllers/ai_match.controller.js";
// import { authenticate } from "../middleware/auth.middleware.js";

// const aiMatchRouter = Router();

// aiMatchRouter.use(authenticate);

// aiMatchRouter.route("/").get(renderAIMatchList);

// aiMatchRouter.route("/new").get(renderAIMatchForm)
// aiMatchRouter.route("/create").post(createDocAIMatch);
// aiMatchRouter.route("/:id").get(renderAIMatchDetails);

// export default aiMatchRouter;