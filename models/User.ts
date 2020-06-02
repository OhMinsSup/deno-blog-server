import { hash, compare, setExpiration } from "../deps.ts";
import database from "../common/db/mongo.ts";
import { authToken, AuthTokenDocument } from "./AuthToken.ts";
import { generateToken } from "../libs/tokens.ts";

if (!database) {
  throw "Database connect error";
}

export const user = database.collection("user");

export interface UserDocument {
  _id?: {
    $oid: any;
  };
  $oid?: any;
  username: string;
  password: string;
}

class Model {
  async findByUsername(username: string) {
    const userData: UserDocument = await user.findOne({
      username,
    });

    return userData;
  }

  async findByObjectId(objId: any) {
    const userData: UserDocument = await user.findOne({ _id: { $oid: objId } });

    return userData;
  }

  async create(username: string, password: string) {
    const hashPassword = await hash(password);

    const { $oid: objId }: UserDocument = await user.insertOne({
      username,
      password: hashPassword,
    });

    const userData = await this.findByObjectId(objId);

    return userData;
  }

  async validPassword(password: string, hashedPassword: string) {
    return await compare(password, hashedPassword);
  }

  serialize(userData: UserDocument) {
    const { _id, username, password } = userData;
    return {
      _id: _id && _id.$oid,
      username,
      password,
    };
  }

  async generateUserToken(user_ref: any) {
    const authTokenData: AuthTokenDocument = await authToken.insertOne({
      user_ref,
      disabled: false,
    });

    const accessToken = await generateToken({
      sub: "access_token",
      exp: setExpiration(new Date().getTime() + 60 * 60 * 1000),
      user_ref,
    });

    const refreshToken = await generateToken({
      sub: "refresh_token",
      exp: setExpiration(new Date().getTime() + 60 * 60 * 1000),
      user_ref,
      token_ref: authTokenData.$oid,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}

const UserModel = new Model();

export default UserModel;
