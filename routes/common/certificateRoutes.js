import express from "express";
import getCertificatesController from "../../controllers/common/certificate/getCertificatesController.js";

const router = express.Router();

// Get certificates (category optional)
router.get("/certificates", getCertificatesController);

export default router;
