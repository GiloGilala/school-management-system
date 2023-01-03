import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    posting_date: {
        type: String,
    },
    currency: {
        type: String,
    },
    py_frequency: {
        type: String,
    },
    exchange_rate: {
        type: String,
    },
    company: {
        type: String,
    },
    pay_account: {
        type: String,
    },
    branch: {
        type: String,
    },
    designation:{
        type: String,
    },
    depratment:{
        type:String,
    },
    employee_number:{
        type:Number,
    },
    ref_number:{
        type:Number,
    },
    ttl_debt:{
        type:Number,
    },
    rfnc_date:{
        type:Number,
    },
    ttl_creadit:{
        type:Number,
    },
    remark:{
        type:Number,
    }
  },
  { timestamp: true }
);

export default mongoose.model("Payroll", payrollSchema);
