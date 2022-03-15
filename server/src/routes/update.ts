import express, { Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../errors/bad-request-error";
import { NotAuthorizedError } from "../errors/not-authorized-error";
import { NotFoundError } from "../errors/not-found-error";
import { requireAuth } from "../middlewares/require-auth";
import { validateRequest } from "../middlewares/validate-request";
import { Interview } from "../models/Interview";

const router = express.Router();
router.put(
  "/api/interviews/:id",
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

    const interview = await Interview.findById(req.params.id);
    if (!interview) throw new NotFoundError();
    if (interview.hostId !== req.currentUser!.id)
      throw new NotAuthorizedError();

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
      throw new BadRequestError("Please provide at least 1 participants");

    interview.set({
      startTime: startTime,
      endTime: endTime,
      participants: participants,
    });

    await interview.save();

    res.send(interview);
  }
);

export { router as updateRouter };
