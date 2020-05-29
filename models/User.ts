import { hash, compare } from "../deps.ts";
import database from "../common/db/mongo.ts";

if (!database) {
  throw Deno.errors.NotConnected("Database connect error");
}

const user = database.collection("user");

export interface UserDocument {
  _id: {
    $oid: any;
  };
  username: string;
  password: string;
}

class User {
  static async findByUsername(username: string) {
    const userData: UserDocument = await user.findOne({
      username,
    });

    return userData;
  }

  static async create(username: string, password: string) {
    const hashPassword = await hash(password);

    const userData: UserDocument = await user.insertOne({
      username,
      password: hashPassword,
    });

    return userData;
  }

  static async validPassword(password: string, hashedPassword: string) {
    return await compare(password, hashedPassword);
  }

  static serialize(userData: UserDocument) {
    const { _id, username, password } = userData;
    return {
      _id: _id.$oid,
      username,
      password,
    };
  }
}

export default User;
