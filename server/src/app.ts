import express from "express";
import cors from "cors";
import "express-async-errors";
import cookieSession from "cookie-session";

import { indexRouter } from "./routes";
import { signinRouter } from "./routes/signin";
import { createRouter } from "./routes/new";
import { updateRouter } from "./routes/update";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";
import { addParticipantRouter } from "./routes/new-participants";
import { signupRouter } from "./routes/signup";
import { currentUser } from "./middlewares/current-user";
import { listParticipantsRouter } from "./routes/list-participants";
import { currentUserRouter } from "./routes/current-user";
import { signoutRouter } from "./routes/signout";
import { showInterviewRouter } from "./routes/show";

const app = express();
app.set("trust proxy", true);

app.use(cors());
app.use(express.json());
app.use(
  cookieSession({
    signed: false, // disable encryption on cookies
    secure: process.env.NODE_ENV !== "test", // enable HTTPS // ! False for test, True otherwise
  })
);

app.use(currentUser);
app.use(currentUserRouter);
app.use(indexRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(showInterviewRouter);
app.use(createRouter);
app.use(updateRouter);
app.use(addParticipantRouter);
app.use(listParticipantsRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
