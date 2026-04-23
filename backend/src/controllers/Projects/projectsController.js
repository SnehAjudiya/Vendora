import projectsModel from "../../models/Projects.js";
import { MESSAGES } from "../../constant/messages.js";
import { CommonResponse } from "../../constant/commonResponse.js";
import { StatusCodes } from "../../constant/statusCodes.js";

// GET /projects
export const getAllProjects = async (req, res, next) => {
  try {
    const projects = await projectsModel.find({ isDeleted: false });

    res
      .status(StatusCodes.OK)
      .json(CommonResponse.Success(projects, MESSAGES.PROJECT.FETCH_ALL));
  } catch (error) {
    next(error);
  }
};

// POST /projects
export const postProject = async (req, res, next) => {
  try {
    const newProject = req.body;

    const lastProject = await projectsModel
      .findOne()
      .sort({ project_code: -1 });
    const nextCode = lastProject ? lastProject.project_code + 1 : 1;
    const created_date = new Date().toLocaleDateString();

    const addedProject = await projectsModel.create({
      ...newProject,
      project_code: nextCode,
      created_date: created_date,
    });

    res
      .status(StatusCodes.CREATED)
      .json(CommonResponse.Created(addedProject, MESSAGES.PROJECT.CREATED));
  } catch (error) {
    next(error);
  }
};

// GET /projects/:id
export const getProjectById = async (req, res, next) => {
  try {
    const project_code = req.params.id;
    const project = await projectsModel.findOne({
      project_code,
      isDeleted: false,
    });
    if (!project) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(CommonResponse.Not_Found({}, MESSAGES.PROJECT.NOT_FOUND));
    }

    res
      .status(StatusCodes.OK)
      .json(CommonResponse.Success(project, MESSAGES.PROJECT.FETCH));
  } catch (error) {
    next(error);
  }
};

// PUT /projects/:id
export const updateProject = async (req, res, next) => {
  try {
    const project_code = req.params.id;
    const updateData = req.body;
    const { _id } = await projectsModel.findOne(
      { project_code, isDeleted: false },
      { _id: 1 },
    );

    const updatedProject = await projectsModel.findByIdAndUpdate(
      _id,
      updateData,
      { new: true },
    );

    if (!updatedProject) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          CommonResponse.Not_Found(updatedProject, MESSAGES.PROJECT.NOT_FOUND),
        );
    }

    res
      .status(StatusCodes.OK)
      .json(CommonResponse.Success(updatedProject, MESSAGES.PROJECT.UPDATED));
  } catch (error) {
    next(error);
  }
};

// DELETE /projects/:id
export const deleteProject = async (req, res, next) => {
  try {
    const project_code = req.params.id;
    const { _id } = await projectsModel.findOne(
      { project_code, isDeleted: false },
      { _id: 1 },
    );

    const deletedProject = await projectsModel.findByIdAndUpdate(
      _id,
      { isDeleted: true },
      { new: true },
    );

    if (!deletedProject) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(CommonResponse.Not_Found({}, MESSAGES.PROJECT.NOT_FOUND));
    }

    res
      .status(StatusCodes.OK)
      .json(CommonResponse.Success({}, MESSAGES.PROJECT.DELETED));
  } catch (error) {
    next(error);
  }
};
