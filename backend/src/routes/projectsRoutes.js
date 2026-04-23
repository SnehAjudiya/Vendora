import express from "express";
import {
  deleteProject,
  getAllProjects,
  getProjectById,
  postProject,
  updateProject,
} from "../controllers/Projects/projectsController.js";
import { validationHandler } from "../middleware/validationHandler.js";
import {
  createProject_validation_schema,
  updateProject_validation_schema,
} from "../validation/Validation Schema/Project_Validation.js";
import userAuth from "../middleware/userAuth.js";

const projectRouter = express.Router();

projectRouter
  .route("/")
  .get(userAuth, getAllProjects)
  .post(
    userAuth,
    validationHandler(createProject_validation_schema),
    postProject,
  );

projectRouter
  .route("/:id")
  .get(userAuth, getProjectById)
  .put(
    userAuth,
    validationHandler(updateProject_validation_schema),
    updateProject,
  )
  .delete(userAuth, deleteProject);

export default projectRouter;
