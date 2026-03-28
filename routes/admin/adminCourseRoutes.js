import express from 'express';
import { getUploader } from '../../utils/multer.js';
import { addCourseController } from '../../controllers/admin/course/addCourseController.js';
import { addModuleController } from '../../controllers/admin/course/addModuleController.js';
import { changeCourseVisibility } from '../../controllers/admin/course/changeCourseVisibilityController.js';
import { getOneCourseController } from '../../controllers/admin/course/getOneCourseController.js';
import { deleteCourseController } from '../../controllers/admin/course/deleteCourseController.js';
import { editCourseController } from '../../controllers/admin/course/editCourseController.js';
import adminAuthMiddlware from '../../middleware/adminAuthMiddleware.js';
import { deleteModuleController } from '../../controllers/admin/course/deleteModuleController.js';
import { editModuleController } from '../../controllers/admin/course/editModuleController.js';
import addModuleTestController from '../../controllers/admin/course/addModuleTestController.js'

const router = express.Router();

router.post(
  '/create-course',
  getUploader('memory').single('thumbnail'),
  addCourseController
);

router.post(
  "/add-module-to-course/:courseId",
  adminAuthMiddlware,
  getUploader("disk").array("assets", 10), // max 10 files
  addModuleController
);

router.post(
  '/change-course-visibility/:courseId',
  adminAuthMiddlware,
  changeCourseVisibility
);

router.get(
  '/get-course/:courseId',
  adminAuthMiddlware,
  getOneCourseController
);

router.delete(
  '/delete-course/:courseId',
  adminAuthMiddlware,
  deleteCourseController
);

router.delete(
  '/delete-module/:moduleId',
  adminAuthMiddlware,
  deleteModuleController
);

router.patch(
  "/edit-course/:courseId",
  adminAuthMiddlware,
  getUploader("disk").single("thumbnail"),
  editCourseController
);


router.patch(
  '/edit-module/:courseId/:moduleId',
  adminAuthMiddlware,
  getUploader('disk').single('asset'),
  editModuleController
);

router.post("/course/:courseId/module/:moduleId/test", adminAuthMiddlware, addModuleTestController);


export default router;
