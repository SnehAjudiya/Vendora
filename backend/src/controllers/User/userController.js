import userModel from "../../models/Users.js";
import bcrypt from "bcryptjs";
import { MESSAGES } from "../../constant/messages.js";
import { CommonResponse } from "../../constant/commonResponse.js";
import { StatusCodes } from "../../constant/statusCodes.js";
import mongoose from "mongoose";
import { AppConstants } from "../../constant/appConstants.js";
import { stripe_create_customer } from "./stripeCustomerController.js";

// GET /users
export const getAllUsers = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    const { userRole } = req.query

    // filter 
    let filterQuery = {};
    if (role === AppConstants.Role.Admin) {
      // 1. Dont show Admin,
      if (userRole === "All") {
        filterQuery.role = { $ne: AppConstants.Role.Admin };
      }
      // 2. Is Vendor, Customer
      else {
        filterQuery.role = {
          $in: [userRole],
        };
      }
    }

    // whole query
    const users = await userModel.find({
      ...filterQuery,
      isDeleted: false,
    });

    if (!users.length)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(CommonResponse.Not_Found({}, MESSAGES.USER.NOT_FOUND));
    res
      .status(StatusCodes.OK)
      .json(CommonResponse.Success(users, MESSAGES.USER.FETCH_ALL));
  } catch (error) {
    next(error);
  }
};

// POST /users
export const postUsers = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phone,
      gender,
      dob,
      address,
      country,
      state,
      city,
      username,
      password,
      role,
      status,
    } = req.body;
    const avatar = req.files?.avatar ? req.files.avatar[0].filename : null;
    const gallery = req.files?.gallery
      ? req.files.gallery.map((g) => g.filename)
      : [];

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingEmail = await userModel.findOne({ email });
    if (existingEmail) {
      return res
        .status(StatusCodes.CONFLICT)
        .json(CommonResponse.Conflict({}, MESSAGES.USER.ALREADY_EXISTS));
    }

    const lastUser = await userModel.findOne().sort({ id: -1 });
    const nextId = lastUser ? lastUser.id + 1 : 1;
    const createdAt = new Date().toLocaleDateString();

    // stripe create new customer
    const stripeCustomerId = await stripe_create_customer({ name: fullName, email: email });

    const addedUser = await new userModel({
      id: nextId,
      fullName,
      email,
      phone,
      gender,
      dob,
      address,
      country,
      state,
      city,
      username,
      password: hashedPassword,
      role,
      status,
      avatar,
      gallery,
      createdAt: createdAt,
      stripeCustomerId,
    });

    await addedUser.save();
    res
      .status(StatusCodes.CREATED)
      .json(CommonResponse.Created(addedUser, MESSAGES.USER.CREATED));
  } catch (error) {
    next(error);
  }
};

// GET /users/:id
export const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;

    let query;
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = userModel.findOne({
        _id: id,
        isDeleted: false,
        role: { $ne: AppConstants.Role.Admin },
      });
    } else {
      query = userModel.findOne({
        id: Number(id),
        isDeleted: false,
        role: { $ne: AppConstants.Role.Admin },
      });
    }

    const findUser = await query;

    if (!findUser)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(CommonResponse.Not_Found({}, MESSAGES.USER.NOT_FOUND));

    res
      .status(StatusCodes.OK)
      .json(CommonResponse.Success(findUser, MESSAGES.USER.FETCH));
  } catch (error) {
    next(error);
  }
};

// PUT /users/:id
export const updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    let {
      fullName,
      email,
      phone,
      gender,
      dob,
      address,
      country,
      state,
      city,
      username,
      role,
      status,
      existing_avatar,
      existing_gallery,
    } = req.body;

    const prevUser = await userModel.findOne({ id, isDeleted: false });

    let avatar = req.files?.avatar ? req.files.avatar[0].filename : null;
    let gallery = req.files?.gallery
      ? req.files.gallery.map((g) => g.filename)
      : [];

    if (existing_avatar) avatar = existing_avatar;

    if (!Array.isArray(existing_gallery)) existing_gallery = [existing_gallery];
    if (existing_gallery) gallery = [...gallery, ...existing_gallery];

    const updateUser = {
      fullName,
      email,
      phone,
      gender,
      dob,
      address,
      country,
      state,
      city,
      username,
      role,
      status,
      avatar,
      gallery,
    };

    const updated = await userModel.findByIdAndUpdate(
      prevUser._id,
      updateUser,
      {
        new: true,
      },
    );

    if (!updated)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(CommonResponse.Not_Found({}, MESSAGES.USER.NOT_FOUND));

    res
      .status(StatusCodes.OK)
      .json(CommonResponse.Success(updated, MESSAGES.USER.UPDATED));
  } catch (error) {
    next(error);
  }
};

// DELETE /users/:id
export const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { _id } = await userModel.findOne(
      { id, isDeleted: false },
      { _id: 1 },
    );

    const deleted = await userModel.findByIdAndUpdate(
      _id,
      { isDeleted: true },
      { new: true },
    );

    if (!deleted)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(CommonResponse.Not_Found({}, MESSAGES.USER.NOT_FOUND));

    res
      .status(StatusCodes.OK)
      .json(CommonResponse.Success({}, MESSAGES.USER.DELETED));
  } catch (error) {
    next(error);
  }
};

// GET /users/profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await userModel.findOne(
      { _id: req.user.id, isDeleted: false },
      {
        fullName: 1,
        email: 1,
        gender: 1,
        phone: 1,
        dob: 1,
        country: 1,
        state: 1,
        city: 1,
        address: 1,
        username: 1,
        avatar: 1,
        gallery: 1,
      },
    );
    res
      .status(StatusCodes.OK)
      .json(CommonResponse.Success(user, MESSAGES.USER.FETCH));
  } catch (error) {
    next(error);
  }
};

// EDIT PROFILE
export const editProfile = async (req, res, next) => {
  try {
    const { id } = req.user;
    const {
      fullName,
      email,
      phone,
      gender,
      dob,
      address,
      country,
      state,
      city,
      username,
      existing_avatar,
      existing_gallery,
    } = req.body;

    const prevUser = await userModel.findOne({ _id: id, isDeleted: false });

    let avatar = req.files?.avatar ? req.files.avatar[0].filename : null;
    let gallery = req.files?.gallery
      ? req.files.gallery.map((g) => g.filename)
      : [];

    if (existing_avatar) avatar = existing_avatar;

    if (!Array.isArray(existing_gallery)) existing_gallery = [existing_gallery];
    if (existing_gallery) gallery = [...gallery, ...existing_gallery];

    const updateUser = {
      id: prevUser.id,
      fullName,
      email,
      phone,
      gender,
      dob,
      address,
      country,
      state,
      city,
      username,
      password: prevUser.password,
      role: prevUser.role,
      status: prevUser.status,
      avatar,
      gallery,
    };

    const updated = await userModel.findByIdAndUpdate(id, updateUser, {
      new: true,
    });

    if (!updated)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(CommonResponse.Not_Found({}, MESSAGES.USER.NOT_FOUND));

    res
      .status(StatusCodes.OK)
      .json(CommonResponse.Success(updated, MESSAGES.USER.UPDATED));
  } catch (error) {
    next(error);
  }
};
