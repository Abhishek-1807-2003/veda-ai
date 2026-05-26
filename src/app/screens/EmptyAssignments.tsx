import { Link } from 'react-router';

export default function EmptyAssignments() {
  return (
    <div className="flex items-center justify-center min-h-full py-12">
      <div className="flex flex-col items-center max-w-md px-4">
        {/* Illustration */}
        <div className="relative mb-5 w-[160px] h-[160px] md:w-[180px] md:h-[180px]">
          {/* Main Circle */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: '#EBEBF5',
              width: '150px',
              height: '150px',
              left: '15px',
              top: '15px'
            }}
          />

          {/* Document Icon */}
          <div
            className="absolute w-16 h-20 rounded-lg transform -rotate-6"
            style={{
              background: 'white',
              border: '2px solid #E5E7EB',
              left: '50px',
              top: '35px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <div className="flex flex-col gap-1.5 p-2">
              <div className="h-1 bg-gray-200 rounded w-full" />
              <div className="h-1 bg-gray-200 rounded w-4/5" />
              <div className="h-1 bg-gray-200 rounded w-full" />
            </div>
          </div>

          {/* Magnifying Glass */}
          <div className="absolute" style={{ left: '80px', top: '50px' }}>
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="32" cy="32" r="28" stroke="#9CA3AF" strokeWidth="3" fill="none" />
              <line x1="52" y1="52" x2="75" y2="75" stroke="#9CA3AF" strokeWidth="6" strokeLinecap="round" />
              {/* Red X Mark */}
              <line x1="22" y1="22" x2="42" y2="42" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
              <line x1="42" y1="22" x2="22" y2="42" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>

          {/* Decorative Sparkles */}
          <div className="absolute" style={{ left: '10px', top: '10px' }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="#C4B5F4">
              <path d="M5 0L5.5 4.5L10 5L5.5 5.5L5 10L4.5 5.5L0 5L4.5 4.5Z" />
            </svg>
          </div>
          <div className="absolute" style={{ right: '10px', bottom: '20px' }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="#C4B5F4">
              <path d="M5 0L5.5 4.5L10 5L5.5 5.5L5 10L4.5 5.5L0 5L4.5 4.5Z" />
            </svg>
          </div>

          {/* Blue Dot */}
          <div
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{ background: '#3B82F6', right: '25px', bottom: '35px' }}
          />
        </div>

        {/* Text Content */}
        <h1
          className="text-center mb-2"
          style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1A1A1A'
          }}
        >
          No assignments yet
        </h1>
        <p
          className="text-center mb-6 max-w-xs md:max-w-sm"
          style={{
            fontSize: '14px',
            color: '#7A7A7A',
            lineHeight: '1.6'
          }}
        >
          Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
        </p>

        {/* CTA Button */}
        <Link to="/create-assignment">
          <button
            className="h-11 px-6 rounded-full"
            style={{
              background: '#111111',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            + Create Your First Assignment
          </button>
        </Link>
      </div>
    </div>
  );
}
