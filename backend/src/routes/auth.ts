import express, { Request, Response } from "express";
import { verifyToken } from "../middleware/auth";
import * as controller from '../controllers/authController';
import { check, validationResult } from "express-validator";
import multer from "multer";

const router = express.Router();


// GET Methods
router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
  res.status(200).send({ userId: req.userId });
});
router.route("/users").get(verifyToken, controller.fetchAllUsers);
router.route("/users/:id").get(verifyToken, controller.fetchUserById);

// POST Methods
router.route("/register").post([
    check("email", "Email is required").isEmail(),
    check("phoneNumber", "Phone Number is required").isMobilePhone("en-US"),
    check("password", "Password with 8 or more characters required").isLength({
      min: 8,
    }),
    check("confirmPassword", "Confirm Password is required").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  ], controller.register);
router.route("/login").post([
    check("email", "Email is required").isEmail(),
    check("password", "Password with 8 or more characters required").isLength({
      min: 8,
    }),
    ], controller.login);
router.route("/logout").post(controller.logout);
router.route("/verify-email").post(controller.verifyEmail);
router.route("/forgot-password").post(controller.forgotPassword);
router.route("/reset-password/:token").post(controller.resetPassword);
router.route("/upload-avatar")
    .post(verifyToken, controller.uploadSingleAvatar, controller.uploadAvatar);

// PUT Methods
router.route("/profile")
    .get(verifyToken, controller.getUserProfile)
router.route('/profile/:userId')
    .put(verifyToken, controller.updateUserProfile);


export default router;