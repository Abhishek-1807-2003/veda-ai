import mongoose, { Schema, Document } from 'mongoose';
import type {
  Assignment,
  GeneratedPaper,
  QuestionTypeConfig,
  JobStatus,
} from '@vedaai/shared-types';

export interface AssignmentDocument extends Omit<Assignment, '_id'>, Document {}

const QuestionTypeConfigSchema = new Schema<QuestionTypeConfig>(
  {
    type: { type: String, required: true },
    count: { type: Number, required: true, min: 1 },
    marks: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const AssignmentSchema = new Schema<AssignmentDocument>(
  {
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true },
    className: { type: String, required: true },
    schoolName: { type: String, required: true },
    dueDate: { type: String, required: true },
    assignedDate: { type: String, default: () => new Date().toISOString() },
    timeAllowed: { type: Number, required: true },
    questionTypes: { type: [QuestionTypeConfigSchema], required: true },
    additionalInstructions: { type: String },
    jobId: { type: String, required: true },
    jobStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    generatedPaper: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Index for efficient listing
AssignmentSchema.index({ createdAt: -1 });

export default mongoose.model<AssignmentDocument>('Assignment', AssignmentSchema);
