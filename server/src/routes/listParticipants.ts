import express, { Request, Response } from "express";
import { requireAuth } from "../middlewares/require-auth";
import { Participant } from "../models/Participant";

const router = express.Router();

router.get(
  "/api/participants",
  requireAuth,
  async (req: Request, res: Response) => {
    const participants = await Participant.find().populate("interviews");
    res.send(participants);
  }
);

export { router as listParticipantsRouter };
