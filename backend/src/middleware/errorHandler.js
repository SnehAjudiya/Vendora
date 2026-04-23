import { StatusCodes } from "../constant/statusCodes.js";
import { CommonResponse } from "../constant/commonResponse.js";
import { MESSAGES } from "../constant/messages.js";

// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  if (err.statusCode) {
    return res
      .status(err.statusCode)
      .json(CommonResponse.Error(err.data || {}, err));
  }

  // Duplicate Key error
  if (err.code === 11000) {
    return res
      .status(StatusCodes.CONFLICT)
      .json(CommonResponse.Conflict({}, MESSAGES.ERROR.CONFLICT));
  }
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(CommonResponse.Internal_Server_Error({}, err.message));
};
