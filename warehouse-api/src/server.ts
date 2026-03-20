import Koa from "koa";

const app = new Koa();

app.use(async (ctx) => {
  ctx.body = { message: "warehouse api is running" };
});

export default app;