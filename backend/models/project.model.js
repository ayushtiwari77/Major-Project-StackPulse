import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    lowercase: true,
    unique: [true, "Project name must be unique"],
    trim: true,
    required: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],

  fileTree: {
    type: Object,
    default: {},
  },
});

const Project = mongoose.model("project", projectSchema);

export default Project;
