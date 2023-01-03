import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
      
appliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },
     leaveType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LeaveType",
       required: true,
    enum: [
        "Sick",
        "Casual",
        "Special",
        "Bereavement",
        "Metarnity"
      ],
   
    },
      reason: {
      type: String,
      required: true,
    },
    leaveStart: {
      type: Date,
      required: true,
      defaults: new Date(),
    },
    leaveEnd: {
      type: Date,
      required: true,
      defaults: new Date(),

    },
     department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },
    reviewers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Staff",
    },
    leaveStatus: {
      type: Number, // Could be one of these four 0 --> Cancelled by Employee , 1 --> Applied ,2 --> Approved 3 --> Rejected
      required: true,
      default: rolesConfig.leaves.APPLIED,
    },
    
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },
      
    leavePolicy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LeavePolicy',
    required: true,
    },

    employeeAcknowledgements: [
      {
          items: {
          type: String,
           }
      },
    ],
      grievances:  [
      {
          items: {
          type: String,
           }
      },
    ],
  hr_manager: {
       type: String
         },
 line_manager: {
         type: String
         },
     
 leave_period: {
		type: String,
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

export default mongoose.model("Leave", leaveSchema);
