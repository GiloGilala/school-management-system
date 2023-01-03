import mongoose from 'mongoose';

const policySchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  departments: [{
    type: mongoose.Types.ObjectId,
    ref: 'department'
  }],
  annual_allocation: {
		type: String,
	},
  lists: [
    {
      stacked: { type: Boolean },
      leavetype: [
        {
        type: mongoose.Types.ObjectId,
        ref: 'leaveType'
        }
      ],
      policy: [],
    },
  ],
});

export default mongoose.model('Policy', policySchema);

 policyModel;
