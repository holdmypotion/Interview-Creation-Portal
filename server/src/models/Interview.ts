import mongoose from "mongoose";

interface InterviewAttrs {
  hostId: string;
  startTime: string;
  endTime: string;
  participants: string[];
}

interface InterviewDoc extends mongoose.Document {
  hostId: string;
  startTime: string;
  endTime: string;
  participants: string[];
}

interface InterviewModel extends mongoose.Model<InterviewDoc> {
  build(attrs: InterviewAttrs): InterviewDoc;
}

const interviewSchema = new mongoose.Schema(
  {
    hostId: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    participants: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

interviewSchema.statics.build = (attr: InterviewAttrs): InterviewDoc => {
  return new Interview(attr);
};

const Interview = mongoose.model<InterviewDoc, InterviewModel>(
  "Interview",
  interviewSchema
);

export { Interview };
