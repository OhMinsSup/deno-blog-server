import {
  config,
  Payload,
  Jose,
  makeJwt,
  setExpiration,
  validateJwt,
} from "../deps.ts";

const env = config();

if (!env["SECRET_KEY"]) {
  throw "Secret key for JWT is missing.";
}

async function generateToken(payload: Payload) {
  const header: Jose = {
    alg: "HS256" as const,
    typ: "JWT",
  };

  const key = env["SECRET_KEY"];

  payload = {
    ...payload,
    iss: "veloss",
    exp: setExpiration(new Date().getTime() + 1000 * 60 * 60 * 24 * 7),
  };

  try {
    const jwt = makeJwt({ header, payload, key });
    const validatedJwt = await validateJwt(jwt, key, {
      isThrowing: true,
    });

    if (!validatedJwt) {
      throw "invalid Jwt";
    }

    return jwt;
  } catch (e) {
    console.log(e);
  }
}

export { generateToken };
