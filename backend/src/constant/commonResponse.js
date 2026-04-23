import { StatusCodes } from "./statusCodes.js";

export class CommonResponse {
  // 2xx
  static Success(data = {}, message, code = StatusCodes.OK) {
    return {
      statusCode: code,
      message: message,
      data: data,
      success: true,
    };
  }
  static Created(data = {}, message, code = StatusCodes.CREATED) {
    return {
      statusCode: code,
      message: message,
      data: data,
      success: true,
    };
  }
  static Accepted(data = {}, message, code = StatusCodes.ACCEPTED) {
    return {
      statusCode: code,
      message: message,
      data: data,
      success: true,
    };
  }

  static Error(data = {}, message, code = StatusCodes.INTERNAL_SERVER_ERROR) {
    return {
      statusCode: code,
      message: message,
      data: data,
      success: true,
    };
  }

  // 4xx
  static Bad_Request(data = {}, message, code = StatusCodes.BAD_REQUEST) {
    return {
      statusCode: code,
      message: message,
      data: data,
      success: false,
    };
  }
  static Unauthorized(data = {}, message, code = StatusCodes.UNAUTHORIZED) {
    return {
      statusCode: code,
      message: message,
      data: data,
      success: false,
    };
  }
  static Forbidden(data = {}, message, code = StatusCodes.FORBIDDEN) {
    return {
      statusCode: code,
      message: message,
      data: data,
      success: false,
    };
  }
  static Not_Found(data = {}, message, code = StatusCodes.NOT_FOUND) {
    return {
      statusCode: code,
      message: message,
      data: data,
      success: false,
    };
  }
  static Method_Not_Allowed(
    data = {},
    message,
    code = StatusCodes.METHOD_NOT_ALLOWED,
  ) {
    return {
      statusCode: code,
      message: message,
      data: data,
      success: false,
    };
  }
  static Conflict(data = {}, message, code = StatusCodes.CONFLICT) {
    return {
      data: data,
      statusCode: code,
      message: message,
      success: false,
    };
  }
  static Gone(data = {}, message, code = StatusCodes.GONE) {
    return {
      data: data,
      statusCode: code,
      message: message,
      success: false,
    };
  }
  static Unprocessable_Content(
    data = {},
    message,
    code = StatusCodes.UNPROCESSABLE_CONTENT,
  ) {
    return {
      data: data,
      statusCode: code,
      message: message,
      success: false,
    };
  }
  static Too_Many_Requests(
    data = {},
    message,
    code = StatusCodes.TOO_MANY_REQUESTS,
  ) {
    return {
      data: data,
      statusCode: code,
      message: message,
      success: false,
    };
  }

  // 5xx
  static Internal_Server_Error(
    data = {},
    message,
    code = StatusCodes.INTERNAL_SERVER_ERROR,
  ) {
    return {
      statusCode: code,
      message: message,
      data: data,
      success: false,
    };
  }
  static Not_Implemented(
    data = {},
    message,
    code = StatusCodes.NOT_IMPLEMENTED,
  ) {
    return {
      statusCode: code,
      message: message,
      data: data,
      success: false,
    };
  }
  static Bad_Gateway(data = {}, message, code = StatusCodes.BAD_GATEWAY) {
    return {
      statusCode: code,
      message: message,
      data: data,
      success: false,
    };
  }
  static Service_Unavailable(
    data = {},
    message,
    code = StatusCodes.SERVICE_UNAVAILABLE,
  ) {
    return {
      statusCode: code,
      message: message,
      data: data,
      success: false,
    };
  }
  static Gateway_Timeout(
    data = {},
    message,
    code = StatusCodes.GATEWAY_TIMEOUT,
  ) {
    return {
      statusCode: code,
      message: message,
      data: data,
      success: false,
    };
  }
}
