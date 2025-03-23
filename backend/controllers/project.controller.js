import User from "../models/user.model.js";
import Project from "../models/project.model.js";
import * as projectService from "../services/project.service.js";
import { validationResult } from "express-validator";

export const createProjectController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try {
    const { projectName } = req.body;
    const loggedInUser = await User.findOne({ email: req.user.email });

    const userId = loggedInUser._id;
    const newProject = await projectService.createProject(projectName, userId);

    res.status(201).json(newProject);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const LoggedInUser = await User.findOne({ email: req.user.email });

    const projects = await projectService.getAllProjectsByUserId(LoggedInUser);

    res.status(200).json(projects);
  } catch (error) {
    console.log(error);
    res.status(200).send(error.message);
  }
};

export const addUserToProject = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try {
    const { projectId, users } = req.body;

    const loggedInUser = await User.findOne({ email: req.user.email });

    const updatedProject = await projectService.addUsersToProject(
      projectId,
      users,
      loggedInUser._id
    );

    res.status(200).json(updatedProject);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { projectid } = req.params;

    const projectDetail = await projectService.getProjectById(projectid);

    res.status(200).json(projectDetail);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

export const updateFileTree = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { projectId, fileTree } = req.body;

    const project = await projectService.updateFileTree({
      projectId,
      fileTree,
    });

    return res.status(200).json({
      project,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};
