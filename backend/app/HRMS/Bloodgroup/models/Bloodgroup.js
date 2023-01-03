import mongoose from "mongoose";

const bloodgroupSchema = new mongoose.Schema(
  {
    blood_type: {
      type: String,
      required: true,
      enum: ["A+", "O+", "B+", "AB+", "A-", "O-", "B-", "AB-"],
    },
    created_by: {
      type: Number,
    },
    updated_by: {
      type: Number,
    },
  },
  { timestamp: true }
);

export default mongoose.model("Bloodgroup", bloodgroupSchema);
