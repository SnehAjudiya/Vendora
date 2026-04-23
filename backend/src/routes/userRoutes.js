import express from "express";
import {
  deleteUser,
  getAllUsers,
  getProfile,
  getUserById,
  postUsers,
  updateUser,
  editProfile,
} from "../controllers/User/userController.js";
import userAuth from "../middleware/userAuth.js";
import { validationHandler } from "../middleware/validationHandler.js";
import {
  updateUser_validation_schema,
  createUser_validation_schema,
} from "../validation/Validation Schema/User_Validation.js";
import { upload } from "../middleware/multer.js";
import allowRoles from "../middleware/allowRoles.js";
import { AppConstants } from "../constant/appConstants.js";

const userRouter = express.Router();

userRouter

  // Profile
  .get("/profile", userAuth, getProfile);

userRouter

  // Edit Profile
  .post(
    "/profile/edit",
    userAuth,
    upload.fields([
      { name: AppConstants.UploadFileNames.Avatar, maxCount: 1 },
      { name: AppConstants.UploadFileNames.Gallery, maxCount: 8 },
    ]),
    validationHandler(updateUser_validation_schema),
    editProfile,
  );

userRouter
  .route("/")

  // Fetch all users
  .get(userAuth, allowRoles([AppConstants.Role.Admin]), getAllUsers)

  // Create new user
  .post(
    userAuth,
    allowRoles([AppConstants.Role.Admin]),
    upload.fields([
      { name: AppConstants.UploadFileNames.Avatar, maxCount: 1 },
      { name: AppConstants.UploadFileNames.Gallery, maxCount: 8 },
    ]),
    validationHandler(createUser_validation_schema),
    postUsers,
  );

userRouter
  .route("/:id")

  // Fetch Single User by id
  .get(userAuth, allowRoles([AppConstants.Role.Admin]), getUserById)

  // Update user
  .put(
    userAuth,
    allowRoles([AppConstants.Role.Admin]),
    upload.fields([
      { name: AppConstants.UploadFileNames.Avatar, maxCount: 1 },
      { name: AppConstants.UploadFileNames.Gallery, maxCount: 8 },
    ]),
    validationHandler(updateUser_validation_schema),
    updateUser,
  )

  // Delete user
  .delete(userAuth, allowRoles([AppConstants.Role.Admin]), deleteUser);

export default userRouter;
