import type { Difficulty } from '../../../../packages/shared-types/src/index';

const config: Record<
  Difficulty,
  { label: string; bg: string; text: string; border: string }
> = {
  easy: {
    label: 'Easy',
    bg: '#DCFCE7',
    text: '#166534',
    border: '#BBF7D0',
  },
  moderate: {
    label: 'Moderate',
    bg: '#FEF3C7',
    text: '#92400E',
    border: '#FDE68A',
  },
  hard: {
    label: 'Hard',
    bg: '#FEE2E2',
    text: '#991B1B',
    border: '#FECACA',
  },
};

export default function DifficultyBadge({
  difficulty,
}: {
  difficulty: Difficulty;
}) {
  const { label, bg, text, border } = config[difficulty];
  return (
    <span
      style={{
        fontSize: '11px',
        fontWeight: '500',
        padding: '2px 8px',
        borderRadius: '999px',
        background: bg,
        color: text,
        border: `1px solid ${border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}
