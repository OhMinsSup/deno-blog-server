import { RouterContext, Status } from "../../deps.ts";
import { AuthRegisterParam } from "../model/auth.ts";
import { signinService, signupService } from "../service/authService.ts";
import { ResponseOne, StatusCode } from "../../common/exception/APIResponse.ts";

const authValidation = {
  username: (username: string) => {
    if (!username) {
      return "username is required";
    }

    if (username.length < 3 && username.length > 20) {
      return "username is min 3, max 20 length";
    }

    if (!/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/.test(username)) {
      return "username is alphanumeric";
    }
  },
  password: (password: string) => {
    if (!password) {
      return "password is required";
    }

    if (typeof password !== "string") {
      return "places password type string";
    }
  },
};

export const signin = async (ctx: RouterContext) => {
  const { value } = await ctx.request.body();
  const body = value as AuthRegisterParam;
  const valid =
    authValidation.username(body.username) ||
    authValidation.password(body.password) ||
    null;

  if (valid) {
    return new ResponseOne(
      StatusCode.FAILURE,
      Status.BadRequest,
      valid,
      null
    ).send(ctx);
  }

  const result = await signinService(body);
  const { statusCode, status, message, payload } = result;

  ctx.cookies.set("access_token", payload!.accessToken as string, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
  });

  ctx.cookies.set("refresh_token", payload!.refreshToken as string, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });

  return new ResponseOne(statusCode, status, message, payload).send(ctx);
};

export const signup = async (ctx: RouterContext) => {
  const { value } = await ctx.request.body();
  const body = value as AuthRegisterParam;

  const valid =
    authValidation.username(body.username) ||
    authValidation.password(body.password) ||
    null;

  if (valid) {
    return new ResponseOne(
      StatusCode.FAILURE,
      Status.BadRequest,
      valid,
      null
    ).send(ctx);
  }

  const result = await signupService(body);
  const { statusCode, status, message, payload } = result;

  ctx.cookies.set("access_token", payload!.accessToken as string, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
  });

  ctx.cookies.set("refresh_token", payload!.refreshToken as string, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });

  return new ResponseOne(statusCode, status, message, payload).send(ctx);
};

export const check = async (ctx: RouterContext) => {
  const { user } = ctx.state;
  if (!user) {
    return new ResponseOne(
      StatusCode.EXIST,
      Status.Forbidden,
      "로그인을 한 유저가 아닙니다",
      null
    ).send(ctx);
  }

  return new ResponseOne(StatusCode.SUCCESS, Status.OK, null, user).send(ctx);
};
