import express, { Request, Response } from "express";
import { requireAuth } from "../middlewares/require-auth";
import { Interview } from "../models/Interview";

const router = express.Router();

router.get(
  "/api/interviews",
  requireAuth,
  async (req: Request, res: Response) => {
    const interviews = await Interview.find({
      hostId: req.currentUser!.id,
    }).sort("startTime");

    res.send(interviews);
  }
);

export { router as indexRouter };
