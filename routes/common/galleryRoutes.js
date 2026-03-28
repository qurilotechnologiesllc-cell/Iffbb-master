import express from "express";
import getGalleryController from "../../controllers/common/gallery/getGalleryController.js";

const router = express.Router();

router.get("/gallery", getGalleryController);

export default router;
