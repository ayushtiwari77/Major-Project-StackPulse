import mongoose from "mongoose";
import User from "../models/user.model.js";

//service to create user

export const createUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email or Password are required");
  }

  const hashedPassword = await User.hashPassword(password);

  //creating the user
  const user = await User.create({
    email,
    password: hashedPassword,
  });

  return user;
};

export const getAllUsers = async (userId) => {
  if (!userId) {
    throw new Error("userId is not present");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("userId is not valid");
  }

  const allUsers = await User.find({
    _id: {
      $ne: userId,
    },
  });

  return allUsers;
};
