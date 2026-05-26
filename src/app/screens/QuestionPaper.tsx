import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import toast from 'react-hot-toast';
import { AssignmentAPI } from '../lib/api';
import { useAssignmentStore } from '../store/assignmentStore';
import AIBanner from '../components/paper/AIBanner';
import PaperViewer from '../components/paper/PaperViewer';
import LoadingSkeleton from '../components/paper/LoadingSkeleton';
import type { Assignment } from '../../../packages/shared-types/src/index';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function QuestionPaper() {
  const { id } = useParams<{ id: string }>();
  const { selectedAssignment, setSelectedAssignment } = useAssignmentStore();
  const [loading, setLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get latest status from store (updated by WebSocket)
  const storeAssignment = useAssignmentStore((state) =>
    state.assignments.find((a) => a._id === id)
  );
  const jobStatus = useAssignmentStore(
    (state) => (id ? state.jobStatuses[id] : undefined) ?? storeAssignment?.jobStatus
  );

  // Use store data if available, otherwise local state
  const assignment = storeAssignment || selectedAssignment;

  useEffect(() => {
    if (!id) return;

    const fetchAssignment = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await AssignmentAPI.get(id);
        setSelectedAssignment(data);
      } catch (err: any) {
        setError('Failed to load assignment');
        toast.error('Failed to load assignment');
      } finally {
        setLoading(false);
      }
    };

    // If we already have it in the store, just use that
    if (storeAssignment) {
      setLoading(false);
    } else {
      fetchAssignment();
    }
  }, [id]);

  // Re-fetch when jobStatus changes to completed
  useEffect(() => {
    if (
      id &&
      jobStatus === 'completed' &&
      !assignment?.generatedPaper
    ) {
      AssignmentAPI.get(id).then((data) => {
        setSelectedAssignment(data);
      });
    }
  }, [jobStatus, id]);

  const handleDownloadPDF = () => {
    if (!id) return;
    const url = AssignmentAPI.getPDFUrl(id);
    window.open(url, '_blank');
  };

  const handleRegenerate = async () => {
    if (!id) return;
    setIsRegenerating(true);
    try {
      await AssignmentAPI.regenerate(id);
      toast.success('Regenerating paper...');
    } catch (err) {
      toast.error('Failed to regenerate');
    } finally {
      setIsRegenerating(false);
    }
  };

  // Loading state
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-full py-12">
        <div className="flex flex-col items-center gap-3 text-center px-4">
          <AlertCircle size={48} style={{ color: '#EF4444' }} />
          <h2
            style={{ fontSize: '18px', fontWeight: '600', color: '#1A1A1A' }}
          >
            Something went wrong
          </h2>
          <p style={{ fontSize: '14px', color: '#7A7A7A' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 h-10 px-6 rounded-lg flex items-center gap-2"
            style={{
              background: '#111111',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Still generating
  const currentStatus =
    jobStatus || assignment?.jobStatus || 'pending';
  if (
    currentStatus === 'pending' ||
    currentStatus === 'processing'
  ) {
    return <LoadingSkeleton />;
  }

  // Failed
  if (currentStatus === 'failed') {
    return (
      <div className="flex items-center justify-center min-h-full py-12">
        <div className="flex flex-col items-center gap-3 text-center px-4">
          <AlertCircle size={48} style={{ color: '#EF4444' }} />
          <h2
            style={{ fontSize: '18px', fontWeight: '600', color: '#1A1A1A' }}
          >
            Generation Failed
          </h2>
          <p style={{ fontSize: '14px', color: '#7A7A7A' }}>
            The AI could not generate your question paper. Please try again.
          </p>
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="mt-2 h-10 px-6 rounded-lg flex items-center gap-2"
            style={{
              background: '#111111',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '500',
              opacity: isRegenerating ? 0.6 : 1,
            }}
          >
            <RefreshCw
              size={14}
              className={isRegenerating ? 'animate-spin' : ''}
            />
            {isRegenerating ? 'Regenerating...' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  // Completed — show paper
  const paper = assignment?.generatedPaper;
  if (!paper) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <AIBanner
        assignmentTitle={assignment?.title || 'Assignment'}
        onDownloadPDF={handleDownloadPDF}
        onRegenerate={handleRegenerate}
        isRegenerating={isRegenerating}
      />
      <PaperViewer paper={paper} />
    </div>
  );
}
