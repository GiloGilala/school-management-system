const mongoose = require("mongoose");


const EmployeeReferralSchema = new mongoose.Schema({
	name: {
		type: String,
	},
	email: {
		type: String,
	},
	department: {
		type: String,
	},
	ref_name: {
		type: String,
	},
	ref_email: {
		type: String,
	},
	ref_pnumber: {
		type: String,
	},
	curr_position: {
		type: String,
	},
	dep_positon_to: {
		type: String,
	},
    position_to: {
		type: String,
	},
	cv: {
		type: String,
	},
	comment: {
		type: String,
	},
});

export default mongoose.model("EmployeeReferral", EmployeeReferralSchema);
