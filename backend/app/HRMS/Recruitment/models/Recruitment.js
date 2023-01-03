import mongoose from "mongoose";

const recruitmentSchema = new mongoose.Schema(
  {
   applicant_name: {
		type: String,
	},
	date: {
		type: String,
	},
	department: {
		type: String,
	},
	company: {
		type: String,
	},
	applicant: {
		type: String,
	},
	letter: {
		type: String,
	},
	status: {
		type: String,
	},
  },
  { timestamp: true }
);

export default mongoose.model("Recruitment", recruitmentSchema);
