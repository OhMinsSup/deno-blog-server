import database from "../common/db/mongo.ts";

if (!database) {
  throw "Database connect error";
}

export const authToken = database.collection("auth_token");

export interface AuthTokenDocument {
  _id?: {
    $oid: any;
  };
  $oid?: any;
  user_ref: string;
  disabled: boolean;
}

class Model {}

const AuthTokenModel = new Model();

export default AuthTokenModel;
