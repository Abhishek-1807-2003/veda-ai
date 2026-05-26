import { Home, Users, ClipboardList, Wand2, Library, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router';

const navItems = [
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'groups', label: 'My Groups', icon: Users, path: '/groups' },
  { id: 'assignments', label: 'Assignments', icon: ClipboardList, path: '/assignments' },
  { id: 'toolkit', label: "AI Teacher's Toolkit", icon: Wand2, path: '/toolkit' },
  { id: 'library', label: 'My Library', icon: Library, path: '/library' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-[220px] h-screen bg-white flex flex-col" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      {/* Logo */}
      <div className="h-14 flex items-center px-5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center mr-2.5" style={{ background: '#FF6A3D' }}>
          <span className="text-white font-semibold text-base">V</span>
        </div>
        <span className="text-base font-semibold" style={{ color: '#1A1A1A' }}>VedaAI</span>
      </div>

      {/* CTA Button */}
      <div className="px-5 mb-4 mt-4">
        <Link to="/create-assignment">
          <button
            className="w-full h-10 rounded-[10px] flex items-center justify-center gap-2"
            style={{
              background: '#111111',
              color: '#FFFFFF',
              border: '1.5px solid #FF6A3D',
              boxShadow: '0 0 8px rgba(255,106,61,0.35)',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <span>✦</span>
            <span>Create Assignment</span>
          </button>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          const showBadge = item.id === 'assignments' && isActive;

          return (
            <Link key={item.id} to={item.path}>
              <div
                className="h-10 px-3 flex items-center gap-2.5 mb-1 rounded-[10px] transition-all relative"
                style={{
                  background: isActive ? '#F0F0F0' : 'transparent',
                  color: '#1A1A1A',
                  fontWeight: isActive ? '500' : '400'
                }}
              >
                <Icon size={18} style={{ color: isActive ? '#1A1A1A' : '#7A7A7A' }} />
                <span style={{ fontSize: '14px' }}>{item.label}</span>
                {showBadge && (
                  <div
                    className="absolute right-3 h-5 px-2 rounded-full flex items-center justify-center"
                    style={{ background: '#EF4444' }}
                  >
                    <span className="text-white" style={{ fontSize: '10px', fontWeight: '500' }}>
                      32
                    </span>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="px-5 pb-6">
        {/* Settings */}
        <div className="h-10 px-3 flex items-center gap-2.5 mb-3 cursor-pointer">
          <Settings size={18} style={{ color: '#7A7A7A' }} />
          <span style={{ fontSize: '14px', color: '#1A1A1A' }}>Settings</span>
        </div>

        {/* School Profile Card */}
        <div
          className="p-3 rounded-xl flex items-center gap-3"
          style={{ border: '1px solid #EAEAEA' }}
        >
          <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0" style={{ background: '#FEF3C7' }}>
            <div className="w-full h-full flex items-center justify-center text-2xl">🎓</div>
          </div>
          <div className="flex-1 min-w-0">
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#1A1A1A' }}>
              Delhi Public School
            </div>
            <div style={{ fontSize: '12px', color: '#7A7A7A' }}>
              Bokaro Steel City
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
