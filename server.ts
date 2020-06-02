import {
  Application,
  config,
  Router,
  yellow,
  bold,
  green,
  cyan,
  isHttpError,
  oakCors,
  CorsOptions,
} from "./deps.ts";
import auth from "./routes/auth.ts";

const app = new Application();
const router = new Router();

const env = config();
const port = parseInt(env["PORT"]);

// Logger
app.use(async (context, next) => {
  await next();
  const rt = context.response.headers.get("X-Response-Time");
  console.log(
    `${green(context.request.method)} ${cyan(
      context.request.url.pathname
    )} - ${bold(String(rt))}`
  );
});

// Response Time
app.use(async (context, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  context.response.headers.set("X-Response-Time", `${ms}ms`);
});

// Error handler
app.use(async (context, next) => {
  try {
    await next();
  } catch (err) {
    if (isHttpError(err)) {
      context.response.status = err.status as any;
      const { message, status, stack } = err;
      context.response.body = { message, status, stack };
      context.response.type = "json";
    } else {
      console.log(err);
      throw err;
    }
  }
});

const allowedHosts = [/^https:\/\/blog.io$/, /^http:\/\/localhost/];

// if (env["NODE_ENV"] === "development") {
//   allowedHosts.push(/^http:\/\/localhost/);
// }

const corsOptions: CorsOptions = {
  origin: async (requestOrigin) => {
    if (!requestOrigin) return false;
    const valid = allowedHosts.some((regex) => regex.test(requestOrigin));
    if (!valid) return false;
    return true; //  Reflect (enable) the requested origin in the CORS response for this origins
  },
  credentials: true,
};

app.use(oakCors(corsOptions)); // Enable CORS for All Routes
app.use(auth.routes());
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen" as any, ({ hostname, port }: any) => {
  console.log(bold("Start listening on ") + yellow(`${hostname}:${port}`));
});

console.log(`🦕 deno server is started at http://localhost:${port}`);
await app.listen({ port });
console.log(bold("Finished."));
