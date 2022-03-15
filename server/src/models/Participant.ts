import mongoose from "mongoose";
import { Password } from "../utils/password";

//TODO: add resume file upload
interface ParticipantAttrs {
  name: string;
  email: string;
}

interface ParticipantModel extends mongoose.Model<ParticipantDoc> {
  build(attrs: ParticipantAttrs): ParticipantDoc;
}

interface ParticipantDoc extends mongoose.Document {
  name: string;
  email: string;
  interviews: string[];
}

const participantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    interviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Interview",
      },
    ],
  },
  {
    // * JSON.stringify()
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

participantSchema.statics.build = (attrs: ParticipantAttrs) => {
  return new Participant(attrs);
};

const Participant = mongoose.model<ParticipantDoc, ParticipantModel>(
  "Participant",
  participantSchema
);

export { Participant };
