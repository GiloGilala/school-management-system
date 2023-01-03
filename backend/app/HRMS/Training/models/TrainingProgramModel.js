const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const trainingProgram = new Schema({
    trainerName: {
        type: String,
    },
    trainerEmail: {
        type: String,
    },
    programTitle: {
        type: String,
    },
    introduction: {
        type: String,
    },
    type: {
        type: String,
    },
    location: {
        type: String,
    },
    startDate: {
        type: String,
    },
    endDate:{
        type: String,
    },
    description:{
        type:String,
    }
});



export default mongoose.model("TrainingProgram", trainingProgram);
