import { Router } from "express";
import { getCsrfToken } from "../controllers/csrf.controller.js";

const csrfRouter = Router();

csrfRouter.route("/csrf-token").get(getCsrfToken);

export default csrfRouter;
