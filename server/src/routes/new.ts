import express, { Request, Response } from "express";
import { body } from "express-validator";
import moment from "moment";
import { BadRequestError } from "../errors/bad-request-error";
import { requireAuth } from "../middlewares/require-auth";
import { validateRequest } from "../middlewares/validate-request";
import { Interview } from "../models/Interview";
import sendEmail from "../utils/sendEmails";
import { Participant } from "../models/Participant";
import { NotFoundError } from "../errors/not-found-error";
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
    if (startTime < Date.now()) {
      throw new BadRequestError(
        "Meeting can't be in the past. Start time is before current time"
      );
    }
    if (endTime < startTime) {
      throw new BadRequestError(
        "Meeting duration can not be negative. End Time is before Start Time."
      );
    }

    if (participants.length < 1) {
      throw new BadRequestError("Please provide at least 1 participants");
    }

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
            if (
              (startTime < interview.startTime &&
                endTime > interview.startTime) ||
              (startTime < interview.endTime && endTime > interview.endTime) ||
              (startTime > interview.startTime && endTime < interview.endTime)
            ) {
              throw new BadRequestError(
                `The interview timings overlap for ${participant.email}`
              );
            }
          });
        }
      })
    );

    const interview = Interview.build({
      hostId: req.currentUser!.id,
      startTime: startTime,
      endTime: endTime,
      participants: participants,
    });

    await interview.save();

    participants.map(async (email: string) => {
      const participant = await Participant.findOne({ email });
      if (!participant) {
        throw new NotFoundError();
      }
      const updatedInterview = participant.interviews;
      updatedInterview.push(interview);
      participant.set({
        interviews: updatedInterview,
      });
      await participant.save();
    });

    // sending email to participants
    for (let email of participants) {
      console.log(`Sending mail to ${email}`);
      sendEmail({
        email: email,
        subject: "Interviewbit Engineering Role Interview",
        message: `Timing: ${moment(startTime).format("hh:mm A")} - ${moment(
          endTime
        ).format("hh:mm A")} on ${moment(startTime).format("DD-MM-YYYY")}`,
      });
      console.log("mail sent!");
    }

    res.status(201).send(interview);
  }
);

export { router as createRouter };
