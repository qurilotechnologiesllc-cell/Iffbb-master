import express from "express";
import getNewsController from "../../controllers/common/getNewsController.js";

const router = express.Router();

router.get("/news", getNewsController);

export default router;
