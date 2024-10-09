import express from "express";
import {
  acceptAssignment,
  getAssignmentsForAdmin,
  rejectAssignment,
} from "../controllers/adminController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js"; // authentication middleware

const router = express.Router();

router.route("/assignments").get(isAuthenticated, getAssignmentsForAdmin); // GET request to fetch assignments
router.route("/assignments/:id/accept").post(isAuthenticated, acceptAssignment); // POST request to accept an assignment
router.route("/assignments/:id/reject").post(isAuthenticated, rejectAssignment); // POST request to reject an assignment

export default router;
