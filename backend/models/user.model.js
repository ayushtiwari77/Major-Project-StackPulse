import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: [6, "Email must be at least 6 characters long"],
    maxLength: [50, "Email must be at most 50 characters long"],
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
});

//method to hash password
userSchema.statics.hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

//method to check if it is correct
userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//method to generate authentication token
userSchema.methods.generateJWT = function () {
  return jwt.sign({ email: this.email }, process.env.JWT_KEY, {
    expiresIn: "24h",
  });
};

const User = mongoose.model("user", userSchema);

export default User;
