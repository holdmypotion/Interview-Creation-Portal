import express from "express";
import cors from "cors";
import { indexRouter } from "./routes";
import { signinRouter } from "./routes/signin";
import { createRouter } from "./routes/new";
import { updateRouter } from "./routes/update";

const app = express();

app.use(cors());
app.use(express.json());

app.use(indexRouter);
app.use(signinRouter);
app.use(createRouter);
app.use(updateRouter);

app.all("*", async (req, res) => {
  res.send("nothing");
});

export { app };
