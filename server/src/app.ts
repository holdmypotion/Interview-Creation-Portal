import express from "express";
import cors from "cors";
import "express-async-errors";
import { indexRouter } from "./routes";
import { signinRouter } from "./routes/signin";
import { createRouter } from "./routes/new";
import { updateRouter } from "./routes/update";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();

app.use(cors());
app.use(express.json());

app.use(indexRouter);
app.use(signinRouter);
app.use(createRouter);
app.use(updateRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
