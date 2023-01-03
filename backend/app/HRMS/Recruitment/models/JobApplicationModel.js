const mongoose = require("mongoose");


const jobApplicationSchema = new mongoose.Schema({
	name: {
		type: String,
	},
	email: {
		type: String,
	},
	jobopening: {
		type: String,
	},
	source: {
		type: String,
	},
	phonenumber: {
		type: String,
	},
	estimated_cost: {
		type: String,
	},
	total_estimated_cost: {
		type: String,
	},
	rating: {
		type: String,
	},
});

export default mongoose.model("Jobapplication", jobApplicationSchema);
