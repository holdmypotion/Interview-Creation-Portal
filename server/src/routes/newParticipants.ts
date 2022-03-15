import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { BadRequestError } from "../errors/bad-request-error";
import { requireAuth } from "../middlewares/require-auth";
import { validateRequest } from "../middlewares/validate-request";
import { Participant } from "../models/Participant";

const router = express.Router();

router.post(
  "/api/participants/create",
  requireAuth,
  [
    body("name").not().isEmpty().withMessage("Name must not be empty"),
    body("email").isEmail().withMessage("Email must be valid"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, email } = req.body;

    const existingParticipant = await Participant.findOne({ email });

    if (existingParticipant) {
      throw new BadRequestError("Email in use");
    }

    const participant = Participant.build({ name, email });
    await participant.save();
    res.send(participant);
  }
);

export { router as addParticipantRouter };
