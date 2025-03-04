import { Router } from "express"
import { 
  getCreditsPage, 
  createCreditsRequest, 
  getUserCreditRequests 
} from "../controllers/credit_request.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const creditRouter = Router();

creditRouter.use(authenticate);

creditRouter.route("/").get(getCreditsPage);
creditRouter.route("/new").post(createCreditsRequest);
creditRouter.route("/list").get(getUserCreditRequests);

export default creditRouter;