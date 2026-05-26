import { useAssignments } from '../hooks/useAssignments';
import EmptyAssignments from './EmptyAssignments';
import AssignmentsList from './AssignmentsList';

export default function AssignmentsContainer() {
  const { assignments, loading, fetchAssignments, deleteAssignment } =
    useAssignments();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full py-12">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: '#FF6A3D', borderTopColor: 'transparent' }}
          />
          <p style={{ fontSize: '14px', color: '#7A7A7A' }}>
            Loading assignments...
          </p>
        </div>
      </div>
    );
  }

  return assignments.length === 0 ? (
    <EmptyAssignments />
  ) : (
    <AssignmentsList
      assignments={assignments}
      onSearch={(q) => fetchAssignments(q)}
      onDelete={deleteAssignment}
    />
  );
}
