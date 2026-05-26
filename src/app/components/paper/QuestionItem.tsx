import type { Question } from '../../../../packages/shared-types/src/index';
import DifficultyBadge from './DifficultyBadge';

export default function QuestionItem({
  question,
  index,
}: {
  question: Question;
  index: number;
}) {
  return (
    <div
      className="flex gap-3 py-3"
      style={{ borderBottom: '1px solid #F3F4F6' }}
    >
      <span
        style={{
          fontSize: '13px',
          fontWeight: '600',
          color: '#374151',
          minWidth: '24px',
        }}
      >
        {index + 1}.
      </span>
      <div className="flex-1">
        <p
          style={{
            fontSize: '13px',
            color: '#1F2937',
            lineHeight: '1.7',
            marginBottom: '6px',
          }}
        >
          {question.text}
        </p>
        <div className="flex items-center gap-2">
          <DifficultyBadge difficulty={question.difficulty} />
          <span style={{ fontSize: '11px', color: '#6B7280' }}>
            {question.marks} Mark{question.marks > 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
