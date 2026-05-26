import { useState, useEffect, useRef } from 'react';
import { Search, Filter, MoreVertical } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import type { Assignment } from '../../../packages/shared-types/src/index';

interface AssignmentsListProps {
  assignments: Assignment[];
  onSearch: (query: string) => void;
  onDelete: (id: string) => void;
}

function AssignmentCard({
  assignment,
  onDelete,
}: {
  assignment: Assignment;
  onDelete: (id: string) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const statusConfig: Record<
    string,
    { label: string; bg: string; text: string }
  > = {
    pending: { label: 'Pending', bg: '#FEF3C7', text: '#92400E' },
    processing: { label: 'Generating...', bg: '#DBEAFE', text: '#1E40AF' },
    completed: { label: 'Ready', bg: '#DCFCE7', text: '#166534' },
    failed: { label: 'Failed', bg: '#FEE2E2', text: '#991B1B' },
  };

  const status = statusConfig[assignment.jobStatus] || statusConfig.pending;

  return (
    <div
      ref={menuRef}
      className="bg-white rounded-xl p-4 relative transition-shadow hover:shadow-md cursor-pointer"
      style={{
        border: '1px solid #EAEAEA',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}
      onClick={() => {
        if (assignment.jobStatus === 'completed') {
          navigate(`/question-paper/${assignment._id}`);
        }
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className="absolute top-4 right-4 p-1 hover:bg-gray-50 rounded"
      >
        <MoreVertical size={18} style={{ color: '#9CA3AF' }} />
      </button>

      {showMenu && (
        <div
          className="absolute top-12 right-4 bg-white rounded-lg overflow-hidden z-10"
          style={{
            border: '1px solid #EAEAEA',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            minWidth: '160px',
          }}
        >
          <button
            className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors"
            style={{ fontSize: '14px', color: '#1A1A1A' }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/question-paper/${assignment._id}`);
              setShowMenu(false);
            }}
          >
            View Assignment
          </button>
          <button
            className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors"
            style={{ fontSize: '14px', color: '#EF4444' }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(assignment._id);
              setShowMenu(false);
            }}
          >
            Delete
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 mb-2">
        <h3
          style={{
            fontSize: '15px',
            fontWeight: '600',
            color: '#1A1A1A',
          }}
        >
          {assignment.title}
        </h3>
        <span
          className="px-2 py-0.5 rounded-full"
          style={{
            fontSize: '10px',
            fontWeight: '500',
            background: status.bg,
            color: status.text,
          }}
        >
          {status.label}
        </span>
      </div>

      <p
        style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '8px' }}
      >
        {assignment.subject} • Class {assignment.className}
      </p>

      <div className="flex items-center gap-4">
        <div style={{ fontSize: '12px', color: '#7A7A7A' }}>
          Assigned on :{' '}
          <span style={{ color: '#1A1A1A', fontWeight: '600' }}>
            {formatDate(assignment.assignedDate)}
          </span>
        </div>
        <div style={{ fontSize: '12px', color: '#7A7A7A' }}>
          Due :{' '}
          <span style={{ color: '#1A1A1A', fontWeight: '600' }}>
            {formatDate(assignment.dueDate)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function AssignmentsList({
  assignments,
  onSearch,
  onDelete,
}: AssignmentsListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    // Debounce-like: only search if user stops typing
    // For simplicity, search on each change (client-side filtering is fast)
    if (q.length === 0 || q.length >= 2) {
      onSearch(q);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: '#22C55E' }}
          />
          <h1
            style={{ fontSize: '20px', fontWeight: '600', color: '#1A1A1A' }}
          >
            Assignments
          </h1>
        </div>
        <p style={{ fontSize: '13px', color: '#7A7A7A' }}>
          Manage and create assignments for your classes.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <button
          className="h-9 px-4 flex items-center gap-2 rounded-lg"
          style={{ border: '1px solid #EAEAEA' }}
        >
          <Filter size={14} style={{ color: '#1A1A1A' }} />
          <span style={{ fontSize: '13px', color: '#1A1A1A' }}>Filter By</span>
        </button>

        <div
          className="h-9 px-3 flex items-center gap-2 rounded-lg"
          style={{ border: '1px solid #EAEAEA', width: '220px' }}
        >
          <Search size={16} style={{ color: '#9CA3AF' }} />
          <input
            type="text"
            placeholder="Search Assignment"
            value={searchQuery}
            onChange={handleSearch}
            className="flex-1 bg-transparent border-none outline-none"
            style={{ fontSize: '13px' }}
          />
        </div>
      </div>

      {/* Assignment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {assignments.map((assignment) => (
          <AssignmentCard
            key={assignment._id}
            assignment={assignment}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Floating CTA */}
      <div className="flex justify-center mt-8">
        <Link to="/create-assignment">
          <button
            className="h-11 px-6 rounded-full"
            style={{
              background: '#111111',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            + Create Assignment
          </button>
        </Link>
      </div>
    </div>
  );
}
