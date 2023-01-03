const mongoose = require("mongoose");


const attendanceRequest = new mongoose.Schema({
	employee_id: {
		type: String,
	},
	name: {
		type: String,
	},
    department:{
        type: String,
    },
	attendanceDate: {
		type: String,
	},
	from_date: {
		type: String,
	},
	to_date: {
		type: String,
	},
    reason: {
		type: String,
	},
    explanation: {
		type: String,
	},
});



module.exports = mongoose.model("AttendanceRequest", attendanceRequest);
