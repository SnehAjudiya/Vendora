import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../../models/Users.js";
import transporter, { mailOptionsHelper } from "../../config/nodemailer.js";
import { CommonResponse } from "../../constant/commonResponse.js";
import { MESSAGES } from "../../constant/messages.js";
import { StatusCodes } from "../../constant/statusCodes.js";
import { stripe_create_customer } from "../User/stripeCustomerController.js";
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from "url";

// Register
export const register = async (req, res, next) => {
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
    } = req.body;

    const avatar = req.files?.avatar ? req.files.avatar[0].filename : null;
    const gallery = req.files?.gallery
      ? req.files.gallery.map((g) => g.filename)
      : [];

    const existingEmail = await userModel.findOne({ email });
    if (existingEmail) {
      return res
        .status(StatusCodes.CONFLICT)
        .json(CommonResponse.Conflict({}, MESSAGES.USER.ALREADY_EXISTS));
    }

    const lastUser = await userModel.findOne().sort({ id: -1 });
    const nextId = lastUser ? lastUser.id + 1 : 1;
    const createdAt = new Date().toLocaleDateString();

    const hashedPassword = await bcrypt.hash(password, 10);

    const stripeCustomerId = await stripe_create_customer({ name: fullName, email: email });

    const user = new userModel({
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
      avatar,
      gallery,
      createdAt: createdAt,
      stripeCustomerId,
    });

    await user.save();


    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    const templatePath = path.join(__dirname, "../../utils/templates/emailTemplate.ejs");
    const html = await ejs.renderFile(templatePath, { email: email });

    const mailoptions = mailOptionsHelper(
      process.env.SENDER_EMAIL,
      email,
      MESSAGES.NODEMAILER.REGISTER.SUBJECT,
      html,
    );

    await transporter.sendMail(mailoptions);

    return res
      .status(StatusCodes.CREATED)
      .json(CommonResponse.Created(user, MESSAGES.USER.CREATED));
  } catch (error) {
    next(error);
  }
};

// Login
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          CommonResponse.Bad_Request({}, MESSAGES.AUTH.INVALID_CREDENTIALS),
        );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          CommonResponse.Bad_Request({}, MESSAGES.AUTH.INVALID_CREDENTIALS),
        );
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, fullName: user.fullName },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    return res
      .status(StatusCodes.OK)
      .json(CommonResponse.Success({ token }, MESSAGES.AUTH.LOGGED_IN));
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res
      .status(StatusCodes.OK)
      .json(CommonResponse.Success({}, MESSAGES.AUTH.LOGGED_OUT));
  } catch (error) {
    next(error);
  }
};

export const sendVerifyOtp = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);

    if (user.isAccountVerified) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(CommonResponse.Bad_Request({}, MESSAGES.AUTH.ALREADY_VERIFIED));
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOptions = mailOptionsHelper(
      process.env.SENDER_EMAIL,
      user.email,
      MESSAGES.NODEMAILER.EMAIL_VERIFY_OTP.SUBJECT,
      MESSAGES.NODEMAILER.EMAIL_VERIFY_OTP.TEXT(otp),
    );

    await transporter.sendMail(mailOptions);

    res
      .status(StatusCodes.OK)
      .json(CommonResponse.Success({}, MESSAGES.AUTH.OTP_SENT));
  } catch (error) {
    next(error);
  }
};

// Verify the Email using the OTP
export const verifyEmail = async (req, res, next) => {
  const { otp } = req.body;
  const userId = req.user.id;
  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(CommonResponse.Not_Found({}, MESSAGES.USER.NOT_FOUND));
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          CommonResponse.Bad_Request({}, MESSAGES.AUTH.INVALID_CREDENTIALS),
        );
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res
        .status(StatusCodes.GONE)
        .json(CommonResponse.Gone({}, MESSAGES.AUTH.OTP_EXPIRED));
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();

    return res
      .status(StatusCodes.OK)
      .json(CommonResponse.Success({}, MESSAGES.AUTH.VERIFIED));
  } catch (error) {
    next(error);
  }
};

// Check if user is authenticated
export const isAuthenticated = async (req, res, next) => {
  try {
    const { id, role, fullName } = req.user;
    return res
      .status(StatusCodes.OK)
      .json(
        CommonResponse.Success(
          { id, role, fullName },
          MESSAGES.USER.AUTHENTICATED,
        ),
      );
  } catch (error) {
    next(error);
  }
};

// Send Password Reset OTP
export const sendResetOtp = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(CommonResponse.Not_Found({}, MESSAGES.USER.NOT_FOUND));
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    const mailOptions = mailOptionsHelper(
      process.env.SENDER_EMAIL,
      user.email,
      MESSAGES.NODEMAILER.RESET_PASSWORD_OTP.SUBJECT,
      MESSAGES.NODEMAILER.RESET_PASSWORD_OTP.TEXT(otp),
    );

    await transporter.sendMail(mailOptions);

    return res
      .status(StatusCodes.OK)
      .json(CommonResponse.Success({}, MESSAGES.AUTH.OTP_SENT));
  } catch (error) {
    next(error);
  }
};

// Reset User Password
export const resetPassword = async (req, res, next) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(CommonResponse.Not_Found({}, MESSAGES.USER.NOT_FOUND));
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          CommonResponse.Bad_Request({}, MESSAGES.AUTH.INVALID_CREDENTIALS),
        );
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res
        .status(StatusCodes.GONE)
        .json(CommonResponse.Gone({}, MESSAGES.AUTH.OTP_EXPIRED));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    return res
      .status(StatusCodes.CREATED)
      .json(CommonResponse.Created({}, MESSAGES.AUTH.RESET_PASS_SUCCESS));
  } catch (error) {
    next(error);
  }
};
