import { Download, RefreshCw } from 'lucide-react';

interface AIBannerProps {
  assignmentTitle: string;
  onDownloadPDF: () => void;
  onRegenerate: () => void;
  isRegenerating?: boolean;
}

export default function AIBanner({
  assignmentTitle,
  onDownloadPDF,
  onRegenerate,
  isRegenerating,
}: AIBannerProps) {
  return (
    <div
      className="rounded-xl p-5 mb-6"
      style={{
        background: 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)',
      }}
    >
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: '#FF6A3D' }}
        >
          <span className="text-white text-sm font-bold">✦</span>
        </div>
        <p
          style={{
            fontSize: '14px',
            color: '#FFFFFF',
            lineHeight: '1.6',
          }}
        >
          Here is your customized Question Paper for{' '}
          <strong>{assignmentTitle}</strong>. Review the sections below and
          download when ready.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onDownloadPDF}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
          style={{
            background: '#FFFFFF',
            color: '#1A1A1A',
            fontSize: '13px',
            fontWeight: '500',
          }}
        >
          <Download size={14} />
          <span>Download as PDF</span>
        </button>
        <button
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
          style={{
            background: 'transparent',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: '500',
            border: '1px solid rgba(255,255,255,0.3)',
            opacity: isRegenerating ? 0.5 : 1,
          }}
        >
          <RefreshCw
            size={14}
            className={isRegenerating ? 'animate-spin' : ''}
          />
          <span>{isRegenerating ? 'Regenerating...' : 'Regenerate'}</span>
        </button>
      </div>
    </div>
  );
}
