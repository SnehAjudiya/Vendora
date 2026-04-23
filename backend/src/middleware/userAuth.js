import jwt from "jsonwebtoken";
import { StatusCodes } from "../constant/statusCodes.js";
import { CommonResponse } from "../constant/commonResponse.js";
import { MESSAGES } from "../constant/messages.js";

const userAuth = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(CommonResponse.Unauthorized({}, MESSAGES.AUTH.NO_TOKEN));
    }

    // Bearer <token>
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(CommonResponse.Unauthorized({}, MESSAGES.AUTH.NO_TOKEN));
    }

    // Decode token
    req.user = {};
    try {
      const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
      if (tokenDecode) {
        if (tokenDecode.id) req.user.id = tokenDecode.id;
        if (tokenDecode.role) req.user.role = tokenDecode.role;
        if (tokenDecode.fullName) req.user.fullName = tokenDecode.fullName;

      } else {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json(CommonResponse.Unauthorized({}, MESSAGES.AUTH.INVALID_TOKEN));
      }

      next();
    } catch (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(CommonResponse.Bad_Request({}, error.message));
    }
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(CommonResponse.Internal_Server_Error({}, error.message));
  }
};

export default userAuth;
