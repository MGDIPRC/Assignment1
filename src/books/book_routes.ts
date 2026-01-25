import Router from "@koa/router";
import listRouter from "./lists";
import assignment from "../../adapter/assignment-2";

const router = new Router();

// List book route 
router.use(listRouter.routes());
router.use(listRouter.allowedMethods());

function handleError(ctx: any, err: any) {
  const message = err?.message || "Something went wrong";


  if (message.toLowerCase().includes("can't find") || message.toLowerCase().includes("couldn't find")) {
    ctx.status = 404;
  } else if (message.toLowerCase().includes("need") || message.toLowerCase().includes("please") || message.toLowerCase().includes("doesn't look right") || message.toLowerCase().includes("no book")) {
    ctx.status = 400;
  } else {
    ctx.status = 500;
  }

  ctx.body = { error: message };
}

// Create book route
router.post("/books", async (ctx) => {
  try {
    const book = ctx.request.body as any;
    const id = await assignment.createOrUpdateBook(book);
    ctx.status = 201;
    ctx.body = { id };
  } catch (err) {
    handleError(ctx, err);
  }
});

// Update book route
router.put("/books/:id", async (ctx) => {
  try {
    const id = ctx.params.id;
    const book = { ...(ctx.request.body as any), id };
    const updatedId = await assignment.createOrUpdateBook(book);
    ctx.status = 200;
    ctx.body = { id: updatedId };
  } catch (err) {
    handleError(ctx, err);
  }
});

// Delete book route
router.delete("/books/:id", async (ctx) => {
  try {
    const id = ctx.params.id;
    await assignment.removeBook(id);
    ctx.status = 204;
  } catch (err) {
    handleError(ctx, err);
  }
});

export default router;