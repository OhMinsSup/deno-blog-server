import { AuthRegisterParam } from "../model/auth.ts";
import User from "../../models/User.ts";
import { Status } from "../../deps.ts";
import {
  StatusCode,
  ResponseMessage,
  responseBody,
} from "../../common/exception/APIResponse.ts";

export const signinService = async (body: AuthRegisterParam) => {
  const userData = await User.findByUsername(body.username);
  if (!userData) {
    return responseBody({
      statusCode: StatusCode.FAILURE,
      status: Status.Forbidden,
      message: ResponseMessage.NOT_FOUND,
      payload: null,
    });
  }

  const validPass = await User.validPassword(body.password, userData.password);
  if (!validPass) {
    return responseBody({
      statusCode: StatusCode.FAILURE,
      status: Status.Forbidden,
      message: ResponseMessage.PASSWORD,
      payload: null,
    });
  }

  const payload = User.serialize(userData);
  return responseBody({
    statusCode: StatusCode.SUCCESS,
    status: Status.OK,
    message: null,
    payload,
  });
};
