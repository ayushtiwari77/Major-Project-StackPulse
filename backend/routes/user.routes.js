import express from "express";
import * as userController from "../controllers/user.controller.js";
import { body } from "express-validator";
import { authUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

//post request for registering user
router.post(
  "/register",
  body("email").isEmail().withMessage("Email must be valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 characters long"),
  userController.createUserController
);

//post request for login user
router.post(
  "/login",
  body("email").isEmail().withMessage("Email must be valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 characters long"),
  userController.userLoginController
);

//request for profile
router.get("/profile", authUser, userController.profileController);

//request for logout

router.get("/logout", authUser, userController.logoutController);

//for getAllUsers

router.get("/all", authUser, userController.getAllUsers);

export default router;
