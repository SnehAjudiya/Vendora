import mongoose from "mongoose";
const { Schema } = mongoose;

const projectsSchema = Schema({
  project_code: { type: Number, required: true, unqique: true },
  project_name: { type: String, required: true },
  client_name: { type: String, required: true },
  project_manager: { type: String, required: true },
  start_date: { type: String, required: true },
  end_date: { type: String, required: true },
  status: {
    type: String,
    enum: ["Ongoing", "Completed", "On Hold"],
    required: true,
  },
  priority: { type: String, enum: ["Low", "Medium", "High"], required: true },
  team_size: { type: Number, required: true },
  progress: { type: Number, required: true },
  budget: { type: Number, required: true },
  created_date: { type: String, default: new Date().toLocaleDateString() },
  isDeleted: { type: Boolean, default: false },
});

const projectsModel =
  mongoose.models.projects || mongoose.model("Projects", projectsSchema);

export default projectsModel;
