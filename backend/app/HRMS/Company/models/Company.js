import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    branchName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    companyCode: {
      type: Number,
      required: true,
    },
    cacRegNo: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      required: true,
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      cc: {
        type: String,
        required: true,
      },
    },
    phone: {
      type: Number,
      required: true,
    },

    is_email_verified: {
      type: String,
      required: true,
    },
    starting_date: {
      type: Date,
      required: true,
    },
    ending_date: {
      type: Date,
      required: true,
    },
    package_id: {
      type: Number,
      required: true,
    },
    plan_type: {
      type: String,
      required: true,
    },
    is_enabled: {
      type: Boolean,
      required: true,
    },
    ifsc_code: {
      type: String,
      required: true,
    },
    active_status: {
      type: Boolean,
      required: true,
    },
    custom_field: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Number,
      required: true,
    },
    updatedBy: {
      type: Number,
      required: true,
    },
  },
  { timestamp: true }
);

export default mongoose.model("Company", companySchema);
