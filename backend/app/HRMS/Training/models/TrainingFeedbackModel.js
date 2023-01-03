const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const trainingFeedback = new Schema({
    employeeId: {
        type: String,
    },
    employeeName: {
        type: String,
    },
    programName: {
        type: String,
    },
    feedback: {
        type: String,
    }
});

export default mongoose.model("TrainingFeedback", trainingFeedback);
