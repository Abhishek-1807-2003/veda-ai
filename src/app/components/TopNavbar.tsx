import { ArrowLeft, Grid2x2, Bell, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

export default function TopNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const getBreadcrumb = () => {
    if (location.pathname === '/') return 'Home';
    if (location.pathname === '/assignments') return 'Assignments';
    if (location.pathname === '/create-assignment') return 'Create Assignment';
    if (location.pathname.startsWith('/question-paper')) return 'Question Paper';
    if (location.pathname === '/groups') return 'My Groups';
    if (location.pathname === '/toolkit') return 'AI Teacher\'s Toolkit';
    if (location.pathname === '/library') return 'My Library';
    return 'Assignment';
  };

  return (
    <header
      className="h-14 bg-white flex items-center justify-between px-5"
      style={{ borderBottom: '1px solid #EAEAEA' }}
    >
      {/* Left Side */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-0 hover:opacity-70 transition-opacity"
        >
          <ArrowLeft size={20} style={{ color: '#1A1A1A' }} />
        </button>
        <Grid2x2 size={16} style={{ color: '#7A7A7A' }} />
        <span style={{ fontSize: '14px', color: '#7A7A7A' }}>{getBreadcrumb()}</span>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Bell size={20} style={{ color: '#1A1A1A' }} />
          <div
            className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full"
            style={{ background: '#EF4444' }}
          />
        </div>
        <div className="h-5 w-px" style={{ background: '#EAEAEA' }} />
        <div className="w-8 h-8 rounded-full overflow-hidden" style={{ background: '#E5E7EB' }}>
          <div className="w-full h-full flex items-center justify-center text-sm">👤</div>
        </div>
        <span style={{ fontSize: '14px', color: '#1A1A1A' }}>John Doe</span>
        <ChevronDown size={16} style={{ color: '#7A7A7A' }} />
      </div>
    </header>
  );
}
