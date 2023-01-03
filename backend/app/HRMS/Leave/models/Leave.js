import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {

    EmployeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },

    role: {
      type: Number, // Could be one of these three 1 --> Owner , 2 --> Admin/HR , 3 --> Manager , 4 --> Employee
      required: true,
    },
    leaveApplied: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Leaves",
      default: [],
    },
    leaveApproved: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Leaves",
      default: [],
    },
    leaveRejected: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Leaves",
      default: [],
    },
    leaveToApprove: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Leaves",
      default: [],
    },
  reason: {
      type: String,
      required: true,
    },
   max_leave_allowed: {
		type: String,
	},
	applicable_after: {
		type: String,
	},
	
	TotalLeavesUtilized: {
		type: String,
	},
	LeaveBalance: {
		type: String,
	},
	CasualLeavesUtilized: {
		type: String,
	},
	SickLeavesUtilized: {
		type: String,
	},
	CasualLeavesUtilized: {
		type: String,
	},
	  
  annual_allocation: {
		type: String,
    },
  
    holiday: {
      name: {
        type: String,
      },
      description: {
        type: String,
      },
      from_date: {
        type: String,
      },
      to_date: {
        type: String,

      },
    },
  
       
    package_id: {
      type: Number,
      required: true,
    },
    plan_type: {
      type: String,
      required: true,
    },
    
  },
  { timestamp: true }
);

export default mongoose.model("Leave", leaveSchema);
