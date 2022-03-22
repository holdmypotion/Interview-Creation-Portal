import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { BadRequestError } from "../errors/bad-request-error";
import { requireAuth } from "../middlewares/require-auth";
import { upload } from "../middlewares/upload-file";
import { validateRequest } from "../middlewares/validate-request";
import { Participant } from "../models/Participant";
import { uploader } from "../utils/cloudinary";

const router = express.Router();

router.post(
  "/api/participants/create",
  requireAuth,
  upload.single("file"),
  [
    body("name").not().isEmpty().withMessage("Name must not be empty"),
    body("email").isEmail().withMessage("Email must be valid"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    console.log(req.file);
    const { name, email } = req.body;

    const existingParticipant = await Participant.findOne({ email });

    if (existingParticipant) {
      throw new BadRequestError("Email in use");
    }

    try {
      if (req.file) {
        console.log(req.file);
        const result = await uploader.upload(req.file?.path);
        console.log(result);
      }
    } catch (err) {
      console.log("I an erro", err);
    }

    const participant = Participant.build({ name, email });
    await participant.save();
    res.send(participant);
  }
);

export { router as addParticipantRouter };
