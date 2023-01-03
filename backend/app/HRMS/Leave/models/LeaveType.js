import mongoose from 'mongoose';

const leaveTypeSchema = mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    default: 'blue'
  },
  startDate: {
    type: String,
    default: 'year'
  },
  endDate: {
    type: String,
    default: 'year'
  },
});

export default mongoose.model('LeaveType', leaveTypeSchema);


