import { AuthRegisterParam } from "../model/auth.ts";
import UserModel from "../../models/User.ts";
import { Status } from "../../deps.ts";
import {
  StatusCode,
  ResponseMessage,
  responseBody,
} from "../../common/exception/APIResponse.ts";

export const signinService = async (body: AuthRegisterParam) => {
  try {
    const userData = await UserModel.findByUsername(body.username);
    if (!userData) {
      return responseBody({
        statusCode: StatusCode.FAILURE,
        status: Status.Forbidden,
        message: ResponseMessage.NOT_FOUND,
        payload: null,
      });
    }

    const validPass = await UserModel.validPassword(
      body.password,
      userData.password
    );

    if (!validPass) {
      return responseBody({
        statusCode: StatusCode.FAILURE,
        status: Status.Forbidden,
        message: ResponseMessage.PASSWORD,
        payload: null,
      });
    }

    const payload = UserModel.serialize(userData);
    const token = await UserModel.generateUserToken(payload._id);

    return responseBody({
      statusCode: StatusCode.SUCCESS,
      status: Status.OK,
      message: null,
      payload: {
        ...payload,
        ...token,
      },
    });
  } catch (e) {
    throw e;
  }
};

export const signupService = async (body: AuthRegisterParam) => {
  try {
    const exists = await UserModel.findByUsername(body.username);
    if (exists) {
      return responseBody({
        statusCode: StatusCode.EXIST,
        status: Status.Conflict,
        message: "이미 존재하는 유저입니다.",
        payload: null,
      });
    }

    const userData = await UserModel.create(body.username, body.password);
    const payload = UserModel.serialize(userData);
    const token = await UserModel.generateUserToken(payload._id);

    return responseBody({
      statusCode: StatusCode.SUCCESS,
      status: Status.OK,
      message: null,
      payload: {
        ...payload,
        ...token,
      },
    });
  } catch (e) {
    throw e;
  }
};
