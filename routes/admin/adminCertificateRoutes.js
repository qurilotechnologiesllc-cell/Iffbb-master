import express from "express";
import adminAuthMiddleware from "../../middleware/adminAuthMiddleware.js";
import { getUploader } from "../../utils/multer.js";

import uploadCertificateController from "../../controllers/admin/certificate/uploadCertificateController.js";
import deleteCertificateController from "../../controllers/admin/certificate/deleteCertificateController.js";

const router = express.Router();

// Upload certificate
router.post(
  "/certificates",
  adminAuthMiddleware,
  getUploader("disk").single("file"),
  uploadCertificateController
);

// Delete certificate
router.delete(
  "/certificates/:id",
  adminAuthMiddleware,
  deleteCertificateController
);

export default router;
