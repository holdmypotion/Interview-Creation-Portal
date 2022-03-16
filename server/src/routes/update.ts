import express, { Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../errors/bad-request-error";
import { NotAuthorizedError } from "../errors/not-authorized-error";
import { NotFoundError } from "../errors/not-found-error";
import { requireAuth } from "../middlewares/require-auth";
import { validateRequest } from "../middlewares/validate-request";
import { Interview } from "../models/Interview";
import { Participant } from "../models/Participant";

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

    const currentInterview = await Interview.findById(req.params.id);
    if (!currentInterview) throw new NotFoundError();
    if (currentInterview.hostId !== req.currentUser!.id)
      throw new NotAuthorizedError();

    if (!startTime && !endTime && !participants) {
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

    // check if the timings overlap
    await Promise.all(
      participants.map(async (email: string) => {
        const participant = await Participant.findOne({ email }).populate(
          "interviews"
        );
        if (!participant) {
          throw new NotFoundError();
        }
        if (participant.interviews) {
          participant.interviews.map(interview => {
            if (currentInterview.id !== interview.id) {
              if (
                (startTime < interview.startTime &&
                  endTime > interview.startTime) ||
                (startTime < interview.endTime &&
                  endTime > interview.endTime) ||
                (startTime > interview.startTime && endTime < interview.endTime)
              ) {
                throw new BadRequestError(
                  `The interview timings overlap for ${participant.email}`
                );
              }
            }
          });
        }
      })
    );

    currentInterview.set({
      startTime: startTime,
      endTime: endTime,
      participants: participants,
    });

    await currentInterview.save();

    res.send(currentInterview);
  }
);

export { router as updateRouter };
