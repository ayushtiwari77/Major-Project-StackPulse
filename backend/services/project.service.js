import mongoose from "mongoose";
import Project from "../models/project.model.js";

export const createProject = async (projectName, userId) => {
  if (!projectName) {
    throw new Error("Name is required");
  }

  if (!userId) {
    throw new Error("UserId is required");
  }

  let project;

  try {
    project = await Project.create({
      projectName,
      users: [userId],
    });
  } catch (error) {
    console.log(error);
    throw error;
  }

  return project;
};

export const getAllProjectsByUserId = async (userId) => {
  if (!userId) {
    throw new Error("userId is required");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("userId type is not valid");
  }

  const allProjects = await Project.find({
    users: userId,
  });

  return allProjects;
};

export const addUsersToProject = async (projectId, users, loggedId) => {
  if (!projectId) {
    throw new Error("projectId is required");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("invalid project id");
  }

  if (!users) {
    throw new Error("users are required");
  }

  if (!Array.isArray(users)) {
    throw new Error("invalid user ids in array or invalid array");
  }

  if (!mongoose.Types.ObjectId.isValid(loggedId)) {
    throw new Error("invalid logged in user id");
  }

  // we need such project that contains both project and the user in it
  const project = await Project.findOne({
    _id: projectId,
    users: loggedId,
  });

  if (!project) {
    throw new Error("user does not belong to this project ");
  }

  const updatedProject = await Project.findOneAndUpdate(
    {
      _id: projectId,
    },
    {
      $addToSet: {
        users: {
          $each: users,
        },
      },
    },
    {
      new: true,
    }
  );

  return updatedProject;
};

export const getProjectById = async (projectId) => {
  if (!projectId) {
    throw new Error("project id is mandatory");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("id of project is not valid");
  }

  const projectDetail = await Project.findById(projectId).populate("users");

  return projectDetail;
};

export const updateFileTree = async ({ projectId, fileTree }) => {
  if (!projectId) {
    throw new Error("projectId is required");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid projectId");
  }

  if (!fileTree) {
    throw new Error("fileTree is required");
  }

  const project = await Project.findOneAndUpdate(
    {
      _id: projectId,
    },
    {
      fileTree,
    },
    {
      new: true,
    }
  );

  return project;
};
