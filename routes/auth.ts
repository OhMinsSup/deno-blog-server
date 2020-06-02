import { Router } from "../deps.ts";
import * as controllers from "../auth/controller/authController.ts";

const auth = new Router();

auth.post("/api/v1.0/auth/signin", controllers.signin);

auth.post("/api/v1.0/auth/signup", controllers.signup);

auth.get("/api/v1.0/auth/check", controllers.check);

export default auth;
