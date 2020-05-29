import { RouterContext, Status } from "../../deps.ts";

export enum StatusCode {
  SUCCESS = "10000",
  FAILURE = "10001",
  RETRY = "10002",
  INVALID_ACCESS_TOKEN = "10003",
  DUPLICATE_ACCOUNTS = "10004",
  EXIST = "10005",
  CONTENT_TYPE_ERROR = "10006",
}

export enum ResponseMessage {
  NOT_FOUND = "NOT_FOUND_DATA",
  FORBIDDEN = "FORBIDDEN",
  PASSWORD = "PASSWORD_VALID",
}

export enum ErrorType {
  BAD_TOKEN = "BadTokenError",
  TOKEN_EXPIRED = "TokenExpiredError",
  UNAUTHORIZED = "AuthFailureError",
  ACCESS_TOKEN = "AccessTokenError",
  INTERNAL = "InternalError",
  NOT_FOUND = "NotFoundError",
  NO_ENTRY = "NoEntryError",
  NO_DATA = "NoDataError",
  BAD_REQUEST = "BadRequestError",
  FORBIDDEN = "ForbiddenError",
}

interface ResponseBody<P = any> {
  statusCode: StatusCode;
  status: Status;
  message: string | null;
  payload: P;
}

export const responseBody = <P>({
  statusCode,
  status,
  message,
  payload,
}: ResponseBody<P>) => {
  return {
    statusCode,
    status,
    message,
    payload,
  };
};

abstract class ApiResponse<D> {
  constructor(
    protected statusCode: StatusCode,
    protected status: Status,
    protected message: string | null,
    protected data: D
  ) {}

  protected prepare(ctx: RouterContext): any {
    ctx.response.status = this.status;
    ctx.response.body = {
      result: {
        statusCode: this.statusCode,
        message: this.message,
      },
      payload: this.data,
    };
  }

  public send(ctx: RouterContext): any {
    return this.prepare(ctx);
  }
}

export class ResponseOne<D> extends ApiResponse<D> {
  constructor(
    statusCode: StatusCode,
    status: Status,
    message: string | null,
    data: D
  ) {
    super(statusCode, status, message, data);
  }

  send(ctx: RouterContext) {
    return super.prepare(ctx);
  }
}
