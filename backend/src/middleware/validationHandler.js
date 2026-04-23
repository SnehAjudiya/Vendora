import { StatusCodes } from "../constant/statusCodes.js";
import { CommonResponse } from "../constant/commonResponse.js";

// Validate Req body before reaching Controller
export const validationHandler = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: true });
    if (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(CommonResponse.Bad_Request({}, error.details[0].message));
    }
    next();
  };
};
