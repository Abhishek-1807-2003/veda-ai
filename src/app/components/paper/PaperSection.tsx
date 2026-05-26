import type { Section } from '../../../../packages/shared-types/src/index';
import QuestionItem from './QuestionItem';

export default function PaperSection({ section }: { section: Section }) {
  return (
    <div className="mb-6">
      {/* Section Title */}
      <div className="text-center mb-3">
        <h2
          style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#1A1A1A',
            textDecoration: 'underline',
          }}
        >
          Section {section.label}
        </h2>
      </div>

      {/* Section Subtitle & Instruction */}
      <div className="mb-3">
        <h3
          style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#1A1A1A',
            marginBottom: '4px',
          }}
        >
          {section.title}
        </h3>
        <p
          style={{
            fontSize: '12px',
            color: '#6B7280',
            fontStyle: 'italic',
          }}
        >
          {section.instruction}
        </p>
      </div>

      {/* Questions */}
      <div>
        {section.questions.map((question, i) => (
          <QuestionItem key={question.id} question={question} index={i} />
        ))}
      </div>

      {/* Section End */}
      <div
        className="text-center mt-3"
        style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: '500' }}
      >
        *** End of Section {section.label} ***
      </div>
    </div>
  );
}
