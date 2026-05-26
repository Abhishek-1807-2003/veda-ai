import type { CreateAssignmentDTO, GeneratedPaper, QuestionTypeName } from '@vedaai/shared-types';

const SECTION_LABELS = ['A', 'B', 'C', 'D', 'E'];

const SECTION_TITLES: Record<string, string> = {
  'Multiple Choice Questions': 'Multiple Choice Questions',
  'Short Questions': 'Short Answer Questions',
  'Diagram/Graph-Based Questions': 'Diagram / Graph Based Questions',
  'Numerical Problems': 'Numerical Problems',
};

const INSTRUCTIONS: Record<string, string> = {
  'Multiple Choice Questions':
    'Choose the correct option. Each question carries {marks} mark(s).',
  'Short Questions':
    'Attempt all questions. Each question carries {marks} mark(s).',
  'Diagram/Graph-Based Questions':
    'Draw neat labeled diagrams wherever required. Each question carries {marks} mark(s).',
  'Numerical Problems':
    'Show all working steps. Each question carries {marks} mark(s).',
};

export function buildPrompt(dto: CreateAssignmentDTO): string {
  const totalQuestions = dto.questionTypes.reduce((s, q) => s + q.count, 0);
  const totalMarks = dto.questionTypes.reduce((s, q) => s + q.count * q.marks, 0);

  const sectionSpecs = dto.questionTypes.map((qt, i) => ({
    sectionLabel: SECTION_LABELS[i],
    sectionTitle: SECTION_TITLES[qt.type] ?? qt.type,
    instruction: (INSTRUCTIONS[qt.type] ?? 'Attempt all questions.').replace(
      '{marks}',
      String(qt.marks)
    ),
    type: qt.type,
    count: qt.count,
    marksEach: qt.marks,
  }));

  const jsonSchema: GeneratedPaper = {
    schoolName: dto.schoolName,
    subject: dto.subject,
    className: dto.className,
    timeAllowed: dto.timeAllowed,
    totalMarks,
    sections: sectionSpecs.map((s) => ({
      label: s.sectionLabel,
      title: s.sectionTitle,
      instruction: s.instruction,
      questions: Array.from({ length: s.count }, (_, idx) => ({
        id: `${s.sectionLabel}${idx + 1}`,
        text: '<<GENERATE>>',
        difficulty: 'moderate' as const,
        marks: s.marksEach,
        type: s.type as QuestionTypeName,
        sectionLabel: s.sectionLabel,
      })),
    })),
    answerKey: [],
  };

  return `
Generate a complete question paper for the following exam.
Return ONLY a JSON object matching this exact schema (replace <<GENERATE>> with actual question text):

SCHEMA:
${JSON.stringify(jsonSchema, null, 2)}

REQUIREMENTS:
- School: "${dto.schoolName}"
- Subject: "${dto.subject}"
- Class: "${dto.className}"
- Time Allowed: ${dto.timeAllowed} minutes
- Total Questions: ${totalQuestions}
- Total Marks: ${totalMarks}
${dto.additionalInstructions ? `- Special Instructions: ${dto.additionalInstructions}` : ''}
${dto.uploadedFileText ? `- Base questions on this content:\n${dto.uploadedFileText.slice(0, 3000)}` : ''}

SECTION SPECS:
${sectionSpecs.map((s) => `- Section ${s.sectionLabel}: ${s.count} ${s.type} questions, ${s.marksEach} marks each`).join('\n')}

DIFFICULTY DISTRIBUTION per section:
- 30% easy, 50% moderate, 20% hard

RULES:
1. difficulty must be exactly "easy", "moderate", or "hard"
2. Every question must have a corresponding answerKey entry with id matching question id
3. MCQ answer text should include the correct option letter and full answer
4. All question text must be complete, grammatically correct sentences
5. Do not number questions in the text field (numbers are added by the UI)
6. Return valid JSON only — no markdown, no code fences
`.trim();
}
