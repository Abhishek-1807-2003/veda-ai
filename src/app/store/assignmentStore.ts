import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  Assignment,
  GeneratedPaper,
  JobStatus,
} from '../../../packages/shared-types/src/index';

interface AssignmentState {
  assignments: Assignment[];
  selectedAssignment: Assignment | null;
  jobStatuses: Record<string, JobStatus>;
  showAnswerKey: boolean;

  // Actions
  setAssignments: (items: Assignment[]) => void;
  addAssignment: (item: Assignment) => void;
  removeAssignment: (id: string) => void;
  setSelectedAssignment: (item: Assignment | null) => void;
  updateJobStatus: (
    assignmentId: string,
    status: JobStatus,
    paper?: GeneratedPaper
  ) => void;
  toggleAnswerKey: () => void;
}

export const useAssignmentStore = create<AssignmentState>()(
  devtools((set) => ({
    assignments: [],
    selectedAssignment: null,
    jobStatuses: {},
    showAnswerKey: false,

    setAssignments: (items) => set({ assignments: items }),

    addAssignment: (item) =>
      set((state) => ({ assignments: [item, ...state.assignments] })),

    removeAssignment: (id) =>
      set((state) => ({
        assignments: state.assignments.filter((a) => a._id !== id),
      })),

    setSelectedAssignment: (item) => set({ selectedAssignment: item }),

    updateJobStatus: (assignmentId, status, paper) =>
      set((state) => ({
        jobStatuses: { ...state.jobStatuses, [assignmentId]: status },
        assignments: state.assignments.map((a) =>
          a._id === assignmentId
            ? {
                ...a,
                jobStatus: status,
                ...(paper ? { generatedPaper: paper } : {}),
              }
            : a
        ),
        selectedAssignment:
          state.selectedAssignment?._id === assignmentId
            ? {
                ...state.selectedAssignment,
                jobStatus: status,
                ...(paper ? { generatedPaper: paper } : {}),
              }
            : state.selectedAssignment,
      })),

    toggleAnswerKey: () =>
      set((state) => ({ showAnswerKey: !state.showAnswerKey })),
  }))
);
