import { z } from 'zod';

export const CreateAssignmentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  subject: z.string().min(1, 'Subject is required'),
  className: z.string().min(1, 'Class is required'),
  schoolName: z.string().min(1, 'School name is required'),
  dueDate: z
    .string()
    .min(1, 'Due date is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  timeAllowed: z.coerce
    .number()
    .int()
    .min(15, 'Minimum 15 minutes')
    .max(300, 'Maximum 300 minutes'),
  questionTypes: z
    .array(
      z.object({
        type: z.enum([
          'Multiple Choice Questions',
          'Short Questions',
          'Diagram/Graph-Based Questions',
          'Numerical Problems',
        ]),
        count: z.coerce.number().int().min(1, 'At least 1 question').max(50),
        marks: z.coerce.number().int().min(1, 'At least 1 mark').max(20),
      })
    )
    .min(1, 'Add at least one question type')
    .max(4),
  additionalInstructions: z.string().max(500).optional(),
  uploadedFileText: z.string().max(10000).optional(),
});

export type CreateAssignmentFormData = z.infer<typeof CreateAssignmentSchema>;
