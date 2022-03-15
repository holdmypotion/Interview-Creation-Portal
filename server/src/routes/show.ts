import express, { Request, Response } from "express";
import { NotFoundError } from "../errors/not-found-error";
import { Interview } from "../models/Interview";

const router = express.Router();

router.get("/api/interviews/:id", async (req: Request, res: Response) => {
  const interview = await Interview.findById(req.params.id);

  if (!interview) throw new NotFoundError();

  res.send(interview);
});

export { router as showInterviewRouter };
