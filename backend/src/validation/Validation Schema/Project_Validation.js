import Joi from "joi";
import {
  date_validator,
  name_validator,
  projectBudget_validator,
  projectPriority_validator,
  projectProgress_validator,
  projectStatus_validator,
  projectTeamSize_validator,
  createdDate_validator,
} from "../validators.js";

// PROJECTS
// Create Project
export const createProject_validation_schema = Joi.object({
  project_name: name_validator,
  client_name: name_validator,
  project_manager: name_validator,
  start_date: date_validator,
  end_date: date_validator,
  status: projectStatus_validator,
  priority: projectPriority_validator,
  team_size: projectTeamSize_validator,
  progress: projectProgress_validator,
  budget: projectBudget_validator,
  created_date: createdDate_validator,
});

// Update Project
export const updateProject_validation_schema =
  createProject_validation_schema.fork(
    [
      "project_name",
      "client_name",
      "project_manager",
      "start_date",
      "end_date",
      "status",
      "priority",
      "team_size",
      "progress",
      "budget",
      "created_date",
    ],
    (schema) => schema.optional(),
  );