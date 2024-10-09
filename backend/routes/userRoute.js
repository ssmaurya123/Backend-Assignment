import express from "express";
import {
  getAllAdmins,
  login,
  logout,
  register,
  uploadAssignment,
} from "../controllers/userController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js"; //authentication middleware

const router = express.Router();

router.route("/register").post(register); // POST request to register a new user
router.route("/login").post(login); // POST request to login user
router.route("/uploads").post(isAuthenticated, uploadAssignment); // POST request to upload an assignment, protected by authentication middleware
router.route("/admins").get(isAuthenticated, getAllAdmins); // GET request to get all admins, protected by authentication middleware
router.route("/logout").get(logout);

export default router;
