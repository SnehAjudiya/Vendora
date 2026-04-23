import { MESSAGES } from "../constant/messages.js";
import { StatusCodes } from "../constant/statusCodes.js";
import { CommonResponse } from "../constant/commonResponse.js";

// Which roles can access a controller
const allowRoles = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json(CommonResponse.Forbidden({}, MESSAGES.AUTH.FORBIDDEN));
    }
    next();
  };
};

export default allowRoles;
