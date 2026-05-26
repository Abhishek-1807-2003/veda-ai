import { Plus } from 'lucide-react';
import { Link } from 'react-router';

export default function FloatingActionButton() {
  return (
    <Link to="/create-assignment">
      <button
        className="fixed w-11 h-11 rounded-full flex items-center justify-center"
        style={{
          background: '#111111',
          bottom: '72px',
          right: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
        }}
      >
        <Plus size={20} style={{ color: '#FFFFFF' }} />
      </button>
    </Link>
  );
}
