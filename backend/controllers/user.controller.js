import User from "../models/user.model.js";
import * as userServices from "../services/user.service.js";
import { validationResult } from "express-validator";
//import redisClient from "../services/redis.service.js";
import bcrypt from "bcryptjs";

//user creation logic
export const createUserController = async (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await userServices.createUser(req.body);

    const token = await user.generateJWT();

    delete user._doc.password;

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

//user login logic
export const userLoginController = async (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        errors: "invalid credentials",
      });
    }

    const isMatched = await user.isValidPassword(password);

    if (!isMatched) {
      return res.status(401).json({ errors: "invalid credentials" });
    }

    const token = await user.generateJWT();

    delete user._doc.password;

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

//profile logic

export const profileController = async (req, res) => {
  console.log(req.user);

  return res.status(200).json({
    user: req.user,
  });
};

//logout logic

export const logoutController = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1] || req.cookies.token;

    //redisClient.set(token, "logout", "EX", 60 * 60 * 24);

    res.status(200).json({
      message: "Logged Out successfully",
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

//get all users

export const getAllUsers = async (req, res) => {
  try {
    const LoggedInUserId = (await User.findOne({ email: req.user.email }))._id;

    const allUsers = await userServices.getAllUsers(LoggedInUserId);

    return res.status(200).json(allUsers);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};
