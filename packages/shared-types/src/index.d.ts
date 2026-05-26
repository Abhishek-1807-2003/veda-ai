export type Difficulty = 'easy' | 'moderate' | 'hard';
export type QuestionTypeName = 'Multiple Choice Questions' | 'Short Questions' | 'Diagram/Graph-Based Questions' | 'Numerical Problems';
export interface QuestionTypeConfig {
    type: QuestionTypeName;
    count: number;
    marks: number;
}
export interface CreateAssignmentDTO {
    title: string;
    subject: string;
    className: string;
    schoolName: string;
    dueDate: string;
    timeAllowed: number;
    questionTypes: QuestionTypeConfig[];
    additionalInstructions?: string;
    uploadedFileText?: string;
}
export interface Question {
    id: string;
    text: string;
    difficulty: Difficulty;
    marks: number;
    type: QuestionTypeName;
    sectionLabel: string;
}
export interface Section {
    label: string;
    title: string;
    instruction: string;
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
