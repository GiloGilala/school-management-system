const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const jobOpeningSchema = new Schema({
	jobTitle: {
		type: String,
	},
	company: {
		type: String,
	},
	status: {
		type: String,
		enum: [
        "open",
        "closed"
      ]
	},
	designation: {
		type: String,
	},
	department: {
		type: String,
	},
	stuffPlan: {
		type: String,
	},
	plannedNumberPositions: {
		type: Number,
	},

	Requirements: {
		type: String,
	},
	Responsibilities: {
		type: String,
	},
	Experience: {
		type: String,
	},
	
});

export default mongoose.model("jobOpening", jobOpeningSchema);
