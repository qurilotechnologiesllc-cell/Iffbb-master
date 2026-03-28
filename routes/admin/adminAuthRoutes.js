import express from "express";

import adminSignUpController from "../../controllers/admin/auth/adminSignUpController.js";
import adminLoginController from "../../controllers/admin/auth/adminLoginController.js";
import adminLogOutController from "../../controllers/admin/auth/adminLogOutController.js";

import { adminSignUpValidator } from "../../validators/adminSignUpValidator.js";
import { adminLoginValidator } from "../../validators/adminLoginValidator.js";

import uploadAffiliationController from "../../controllers/admin/affiliation/uploadAffiliationController.js";
import { getUploader } from "../../utils/multer.js";
import getAffiliationsController from "../../controllers/admin/affiliation/getAffiliationsController.js";
import deleteAffiliationController from "../../controllers/admin/affiliation/deleteAffiliationController.js";

import adminAuthMiddleware from "../../middleware/adminAuthMiddleware.js";
import getUserProfileController from "../../controllers/admin/user/profile/getUserProfileController.js";
import authenticateUser from "../../middleware/authenticateUser.js";
import { getAdminProfileController, updateAdminProfileController } from "../../controllers/admin/user/profile/getAdminProfileController.js";
const router = express.Router();

// ---------- AUTH ----------
router.post("/admin-sign-up", adminSignUpValidator, adminSignUpController);
router.post("/admin-log-in", adminLoginValidator, adminLoginController);
router.post("/admin-log-out", adminLogOutController);

// ---------- AFFILIATION UPLOAD (ADMIN ONLY) ----------
const upload = getUploader("disk");

router.post(
  "/upload-affiliation",
  adminAuthMiddleware,        // 🔐 MUST
  upload.single("image"),     // field = image
  uploadAffiliationController
);
router.get("/affiliations", getAffiliationsController);
router.delete(
  "/affiliation/:id",
  adminAuthMiddleware,
  deleteAffiliationController
);

router.get(
  "/profile",
  authenticateUser,
  getAdminProfileController
)

router.put(
  "/profile",
  authenticateUser,
  upload.single("image"),
  updateAdminProfileController
);

export default router;
