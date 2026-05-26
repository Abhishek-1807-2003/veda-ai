import { useEffect, useState } from 'react';
import { useAssignmentStore } from '../store/assignmentStore';
import { AssignmentAPI } from '../lib/api';
import toast from 'react-hot-toast';

export function useAssignments() {
  const { assignments, setAssignments, removeAssignment } =
    useAssignmentStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignments = async (search?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await AssignmentAPI.list(search);
      setAssignments(data);
    } catch (err: any) {
      const message = err.response?.data?.error?.message || 'Failed to fetch assignments';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const deleteAssignment = async (id: string) => {
    try {
      await AssignmentAPI.delete(id);
      removeAssignment(id);
      toast.success('Assignment deleted');
    } catch (err: any) {
      toast.error('Failed to delete assignment');
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  return {
    assignments,
    loading,
    error,
    fetchAssignments,
    deleteAssignment,
  };
}
