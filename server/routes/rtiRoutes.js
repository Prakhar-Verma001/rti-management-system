import express from "express";
import {
  createRTIApplication,
  deleteRTIApplication,
  getRTIApplicationById,
  getRTIApplications,
  updateRTIApplication,
} from "../controllers/rtiController.js";
import {
  handleValidationErrors,
  validateIdParam,
  validateRTIApplication,
} from "../middleware/validators.js";

const router = express.Router();

router.get("/", getRTIApplications);
router.get("/:id", validateIdParam, handleValidationErrors, getRTIApplicationById);
router.post("/", validateRTIApplication, handleValidationErrors, createRTIApplication);
router.put("/:id", validateIdParam, validateRTIApplication, handleValidationErrors, updateRTIApplication);
router.delete("/:id", validateIdParam, handleValidationErrors, deleteRTIApplication);

export default router;
