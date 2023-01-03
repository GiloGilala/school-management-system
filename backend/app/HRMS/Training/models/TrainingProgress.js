import mongoose from 'mongoose';

const trainingProgressSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  training: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'training',
    required: true,
  },
  status: { type: String, default: 'Waiting Completion' },
  attachments: [],
});

export default  mongoose.model(
  'TrainingProgress',
  trainingProgressSchema
);


