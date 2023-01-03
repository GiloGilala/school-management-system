const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const jobOffer = new Schema({
    name: {
        type: String,
    },
    date: {
        type: String,
    },
    job_applicant: {
        type: String,
    },
    designation: {
        type: String,
    },
    email: {
        type: String,
    },
    status: {
        type: String,
    },
    company: {
        type: String,
    },
    offer:{
        type: String,
    },
    description:{
        type:String,
    }
});

jobOffer.set("toJSON", { virtuals: false });

module.exports = mongoose.model("jobOffer", jobOffer);
