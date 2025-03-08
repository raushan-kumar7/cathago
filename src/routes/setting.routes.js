import { Router } from "express";
import { 
  deleteUserAccount, 
  getSettingsPage, 
  updatePassword, 
  updateProfile 
} from "../controllers/setting.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const settingRouter = Router();

settingRouter.use(authenticate);

settingRouter.route('/settings').get(getSettingsPage);
settingRouter.route('/update-profile').post(updateProfile);
settingRouter.route('/change-password').post(updatePassword);
settingRouter.route('/delete-account').post(deleteUserAccount);

export default settingRouter;