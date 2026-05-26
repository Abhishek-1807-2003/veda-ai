import { z } from 'zod';
import type { CreateAssignmentDTO, GeneratedPaper } from '@vedaai/shared-types';

const DifficultyEnum = z.enum(['easy', 'moderate', 'hard']);

const QuestionSchema = z.object({
  id: z.string(),
  text: z.string().min(10),
  difficulty: DifficultyEnum,
  marks: z.number().positive(),
  type: z.string(),
  sectionLabel: z.string(),
});

const SectionSchema = z.object({
  label: z.string(),
  title: z.string(),
  instruction: z.string(),
  questions: z.array(QuestionSchema).min(1),
});

const PaperSchema = z.object({
  schoolName: z.string(),
  subject: z.string(),
  className: z.string(),
  timeAllowed: z.number().positive(),
  totalMarks: z.number().positive(),
  sections: z.array(SectionSchema).min(1),
  answerKey: z.array(
    z.object({ questionId: z.string(), answer: z.string() })
  ),
});

export function parsePaperFromLLMResponse(
  rawResponse: string,
  dto: CreateAssignmentDTO
): GeneratedPaper {
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawResponse);
  } catch {
    throw new Error('AI returned invalid JSON');
  }

  const result = PaperSchema.safeParse(parsed);

  if (!result.success) {
    console.error('Paper validation errors:', result.error.flatten());
    throw new Error(
      `Generated paper failed schema validation: ${result.error.message}`
    );
  }

  // Sanitize: ensure marks match what was configured
  const paper = result.data as GeneratedPaper;
  const totalMarks = dto.questionTypes.reduce(
    (s, q) => s + q.count * q.marks,
    0
  );
  paper.totalMarks = totalMarks; // enforce correct total, don't trust AI

  return paper;
}
