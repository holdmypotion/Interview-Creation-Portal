import express, { Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../errors/bad-request-error";
import { requireAuth } from "../middlewares/require-auth";
import { validateRequest } from "../middlewares/validate-request";
import { Interview } from "../models/Interview";

const router = express.Router();

router.post(
  "/api/interviews/create",
  requireAuth,
  [
    body("startTime").not().isEmpty().withMessage("Start Time is required"),
    body("endTime").not().isEmpty().withMessage("Start Time is required"),
    body("participants")
      .not()
      .isEmpty()
      .withMessage("At least one other participant is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    let { startTime, endTime, participants } = req.body;
    if (!startTime || !endTime || !participants) {
      throw new BadRequestError(
        "Please enter startTime, endTime and participants email list properly."
      );
    }
    startTime = new Date(startTime);
    endTime = new Date(endTime);

    if (startTime < Date.now())
      throw new BadRequestError(
        "Start time can not be before current Time. (Are you a time traveller?)"
      );
    if (endTime < startTime)
      throw new BadRequestError(
        "Meeting duration can not be negative. endTime is before startTime."
      );

    if (participants.length < 1)
      throw new BadRequestError("Please provide atleast 1 participants");

    const interview = Interview.build({
      hostId: req.currentUser!.id,
      startTime: startTime,
      endTime: endTime,
      participants: participants,
    });

    await interview.save();

    res.status(201).send(interview);
  }
);

export { router as createRouter };
