export type Difficulty = 'easy' | 'moderate' | 'hard';

export type QuestionTypeName =
  | 'Multiple Choice Questions'
  | 'Short Questions'
  | 'Diagram/Graph-Based Questions'
  | 'Numerical Problems';

export interface QuestionTypeConfig {
  type: QuestionTypeName;
  count: number;    // number of questions
  marks: number;    // marks per question
}

export interface CreateAssignmentDTO {
  title: string;
  subject: string;
  className: string;
  schoolName: string;
  dueDate: string;            // ISO date string
  timeAllowed: number;        // in minutes
  questionTypes: QuestionTypeConfig[];
  additionalInstructions?: string;
  uploadedFileText?: string;  // extracted text from uploaded file (optional)
}

export interface Question {
  id: string;
  text: string;
  difficulty: Difficulty;
  marks: number;
  type: QuestionTypeName;
  sectionLabel: string;       // "A", "B", "C", etc.
}

export interface Section {
  label: string;              // "A", "B", etc.
  title: string;              // e.g. "Short Answer Questions"
  instruction: string;        // e.g. "Attempt all questions. Each carries 2 marks"
  questions: Question[];
}

export interface GeneratedPaper {
  schoolName: string;
  subject: string;
  className: string;
  timeAllowed: number;
  totalMarks: number;
  sections: Section[];
  answerKey: AnswerKeyItem[];
}

export interface AnswerKeyItem {
  questionId: string;
  answer: string;
}

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Assignment {
  _id: string;
  title: string;
  subject: string;
  className: string;
  schoolName: string;
  dueDate: string;
  assignedDate: string;
  timeAllowed: number;
  questionTypes: QuestionTypeConfig[];
  additionalInstructions?: string;
  jobId: string;
  jobStatus: JobStatus;
  generatedPaper?: GeneratedPaper;
  createdAt: string;
  updatedAt: string;
}

export interface WSMessage {
  type: 'JOB_UPDATE';
  payload: {
    jobId: string;
    assignmentId: string;
    status: JobStatus;
    paper?: GeneratedPaper;
    error?: string;
  };
}
