import { Bell, Menu } from 'lucide-react';

export default function MobileNavbar() {
  return (
    <div className="bg-white">
      {/* Browser Chrome */}
      <div className="h-11 px-4 flex items-center justify-between" style={{ background: '#2C2C2E', color: 'white' }}>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '13px', fontWeight: '600' }}>9:41</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
            <rect width="3" height="12" rx="1" fill="white" />
            <rect x="5" width="3" height="9" rx="1" fill="white" fillOpacity="0.6" />
            <rect x="10" width="3" height="6" rx="1" fill="white" fillOpacity="0.4" />
            <rect x="15" width="2" height="3" rx="1" fill="white" fillOpacity="0.2" />
          </svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path d="M0 5.5C0 3.567 1.567 2 3.5 2H12.5C14.433 2 16 3.567 16 5.5V6.5C16 8.433 14.433 10 12.5 10H3.5C1.567 10 0 8.433 0 6.5V5.5Z" fill="white" />
            <path d="M0 3C0 1.34315 1.34315 0 3 0H13C14.6569 0 16 1.34315 16 3V9C16 10.6569 14.6569 12 13 12H3C1.34315 12 0 10.6569 0 9V3Z" fill="white" fillOpacity="0.3" />
          </svg>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
            <rect x="1" y="1" width="21" height="10" rx="2" stroke="white" strokeWidth="1" fill="none" />
            <rect x="23" y="4" width="2" height="4" rx="1" fill="white" />
            <rect x="3" y="3" width="17" height="6" rx="1" fill="white" />
          </svg>
        </div>
      </div>

      {/* Address Bar */}
      <div className="h-9 px-4 flex items-center justify-center" style={{ background: '#2C2C2E' }}>
        <div className="flex items-center gap-2">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5" stroke="white" strokeWidth="1.5" fill="none" />
            <path d="M6 3V6L8 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: '12px', color: 'white' }}>web-to-figma.design</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="h-[52px] px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#FF6A3D' }}>
            <span className="text-white font-semibold text-base">V</span>
          </div>
          <span className="text-base font-semibold" style={{ color: '#1A1A1A' }}>VedaAI</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell size={20} style={{ color: '#1A1A1A' }} />
            <div
              className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full"
              style={{ background: '#EF4444' }}
            />
          </div>
          <div className="w-8 h-8 rounded-full overflow-hidden" style={{ background: '#E5E7EB' }}>
            <div className="w-full h-full flex items-center justify-center text-sm">👤</div>
          </div>
          <Menu size={24} style={{ color: '#1A1A1A' }} />
        </div>
      </div>
    </div>
  );
}
