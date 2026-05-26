import type { GeneratedPaper } from '../../../../packages/shared-types/src/index';
import PaperSection from './PaperSection';
import { useAssignmentStore } from '../../store/assignmentStore';
import { Eye, EyeOff } from 'lucide-react';

interface PaperViewerProps {
  paper: GeneratedPaper;
}

export default function PaperViewer({ paper }: PaperViewerProps) {
  const { showAnswerKey, toggleAnswerKey } = useAssignmentStore();

  return (
    <div
      className="bg-white rounded-xl p-6 md:p-10"
      style={{
        border: '1px solid #EAEAEA',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        maxWidth: '595px',
        margin: '0 auto',
      }}
    >
      {/* School Header */}
      <div className="text-center mb-6">
        <h1
          style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#1A1A1A',
            marginBottom: '4px',
          }}
        >
          {paper.schoolName}
        </h1>
        <p style={{ fontSize: '14px', color: '#1A1A1A' }}>
          Subject: {paper.subject} &nbsp;|&nbsp; Class: {paper.className}
        </p>
      </div>

      {/* Time and Marks */}
      <div
        className="flex justify-between mb-4 pb-3"
        style={{
          fontSize: '13px',
          color: '#1A1A1A',
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <span>Time Allowed: {paper.timeAllowed} minutes</span>
        <span>Maximum Marks: {paper.totalMarks}</span>
      </div>

      <p className="mb-4" style={{ fontSize: '12px', color: '#6B7280' }}>
        All questions are compulsory unless stated otherwise.
      </p>

      {/* Student Info */}
      <div
        className="mb-6 p-3 rounded-lg"
        style={{ border: '1px solid #E5E7EB' }}
      >
        <div
          className="flex flex-wrap gap-4"
          style={{ fontSize: '13px', color: '#1A1A1A' }}
        >
          <span>
            Name:{' '}
            <span
              style={{
                borderBottom: '1px solid #1A1A1A',
                display: 'inline-block',
                minWidth: '120px',
              }}
            />
          </span>
          <span>
            Roll Number:{' '}
            <span
              style={{
                borderBottom: '1px solid #1A1A1A',
                display: 'inline-block',
                minWidth: '80px',
              }}
            />
          </span>
          <span>Class: {paper.className}</span>
          <span>
            Section:{' '}
            <span
              style={{
                borderBottom: '1px solid #1A1A1A',
                display: 'inline-block',
                minWidth: '60px',
              }}
            />
          </span>
        </div>
      </div>

      {/* Sections */}
      {paper.sections.map((section) => (
        <PaperSection key={section.label} section={section} />
      ))}

      {/* End of Paper */}
      <div className="text-center my-6">
        <p
          style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#1A1A1A',
          }}
        >
          *** End of Question Paper ***
        </p>
      </div>

      {/* Answer Key Toggle */}
      <div
        className="pt-4"
        style={{ borderTop: '2px solid #E5E7EB' }}
      >
        <button
          onClick={toggleAnswerKey}
          className="flex items-center gap-2 mb-4 transition-colors"
          style={{
            fontSize: '13px',
            fontWeight: '600',
            color: '#FF6A3D',
          }}
        >
          {showAnswerKey ? <EyeOff size={16} /> : <Eye size={16} />}
          <span>
            {showAnswerKey ? 'Hide Answer Key' : 'Show Answer Key'}
          </span>
        </button>

        {showAnswerKey && paper.answerKey.length > 0 && (
          <div>
            <h3
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#1A1A1A',
                textDecoration: 'underline',
                marginBottom: '12px',
              }}
            >
              Answer Key
            </h3>
            <div className="space-y-2">
              {paper.answerKey.map((a) => (
                <div
                  key={a.questionId}
                  className="flex gap-3 py-2"
                  style={{ borderBottom: '1px solid #F3F4F6' }}
                >
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#374151',
                      minWidth: '28px',
                    }}
                  >
                    {a.questionId}.
                  </span>
                  <span
                    style={{
                      fontSize: '13px',
                      color: '#1F2937',
                      lineHeight: '1.6',
                    }}
                  >
                    {a.answer}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
