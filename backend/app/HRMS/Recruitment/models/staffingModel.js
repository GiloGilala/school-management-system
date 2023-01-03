const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const staffingSchema = new Schema({
	name: {
		type: String,
	},
	date: {
		type: String,
	},
	department: {
		type: String,
	},
	designation: {
		type: String,
	},
	vacancies: {
		type: String,
	},
	estimated_cost: {
		type: String,
	},
	total_estimated_cost: {
		type: String,
	},
	number_of_position: {
		type: String,
	},
});

export default mongoose.model("Staffing", staffingSchema);
