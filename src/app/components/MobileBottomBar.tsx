import { Home, ClipboardList, Library, Wand2 } from 'lucide-react';
import { Link, useLocation } from 'react-router';

const tabs = [
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'assignments', label: 'Assignments', icon: ClipboardList, path: '/assignments' },
  { id: 'library', label: 'Library', icon: Library, path: '/library' },
  { id: 'toolkit', label: 'AI Toolkit', icon: Wand2, path: '/toolkit' },
];

export default function MobileBottomBar() {
  const location = useLocation();

  return (
    <div
      className="fixed bottom-0 left-0 right-0 h-14 bg-white flex items-center justify-around"
      style={{ borderTop: '1px solid #EAEAEA' }}
    >
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        const Icon = tab.icon;

        return (
          <Link key={tab.id} to={tab.path} className="flex flex-col items-center justify-center gap-1">
            <Icon
              size={22}
              style={{ color: isActive ? '#1A1A1A' : '#9CA3AF' }}
            />
            <span
              style={{
                fontSize: '10px',
                color: isActive ? '#1A1A1A' : '#9CA3AF',
                fontWeight: isActive ? '600' : '400'
              }}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
