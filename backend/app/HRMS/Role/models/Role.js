import mongoose from "mongoose";

const rolesSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    name: { type: String, required: true },
    permissions: { type: [String] },
  },
  { timestamp: true }
);

export default mongoose.model("Roles", rolesSchema);
