import { MongoClient, config } from "../../deps.ts";

const env = config();
const client = new MongoClient();
client.connectWithUri(env["MONGO_URL"]);
const db = client.database(env["MONGO_DB"]);
export default db;
