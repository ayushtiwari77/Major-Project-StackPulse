import express from "express";
import * as projectController from "../controllers/project.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/create",
  authUser,
  body("projectName").isString().withMessage("Name is required"),
  projectController.createProjectController
);

router.get("/all", authUser, projectController.getAllProjects);

router.put(
  "/add-user",
  authUser,

  body("projectId").isString().withMessage("Project ID is required"),
  body("users")
    .isArray({ min: 1 })
    .withMessage("Users must be an array of strings")
    .bail()
    .custom((users) => users.every((user) => typeof user === "string"))
    .withMessage("Each user must be a string"),

  projectController.addUserToProject
);

//detail of a particular project
router.get(
  "/get-project/:projectid",
  authUser,
  projectController.getProjectById
);

//
//
router.put(
  "/update-file-tree",
  authUser,
  body("projectId").isString().withMessage("Project ID is required"),
  body("fileTree").isObject().withMessage("File tree is required"),
  projectController.updateFileTree
);

export default router;
