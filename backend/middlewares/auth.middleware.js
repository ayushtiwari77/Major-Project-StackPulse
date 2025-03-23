import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";

export const authUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1] || req.cookies.token;

    if (!token) {
      return res.status(401).json({
        errors: "unauthorized user",
      });
    }

    const isBlackListed = await redisClient.get(token);

    if (isBlackListed) {
      res.cookie("token", "");
      return res.status(401).send({ error: "unauthorized user" });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);

    if (!decoded) {
      return res.status(401).json({
        errors: "unauthorized user",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      errors: "unauthorized user",
    });
  }
};
