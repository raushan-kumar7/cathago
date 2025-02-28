import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { profile } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.use(verifyJWT);

userRouter.route("/profile").get(profile);

export default userRouter;