import { Router } from "../deps.ts";
import * as controllers from "../auth/controller/authController.ts";

const auth = new Router();

auth.post("/signin", controllers.signin);

auth.post("/signup", (context, next) => {
  context.response.body = "test";
});

export default auth;
