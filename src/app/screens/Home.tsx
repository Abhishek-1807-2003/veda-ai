export default function Home() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full" style={{ background: '#22C55E' }} />
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#1A1A1A' }}>
            Home
          </h1>
        </div>
        <p style={{ fontSize: '13px', color: '#7A7A7A' }}>
          Welcome to VedaAI
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className="bg-white rounded-xl p-6"
          style={{ border: '1px solid #EAEAEA' }}
        >
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1A1A1A', marginBottom: '8px' }}>
            Assignments
          </h3>
          <p style={{ fontSize: '32px', fontWeight: '700', color: '#1A1A1A' }}>32</p>
          <p style={{ fontSize: '13px', color: '#7A7A7A' }}>Total active assignments</p>
        </div>

        <div
          className="bg-white rounded-xl p-6"
          style={{ border: '1px solid #EAEAEA' }}
        >
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1A1A1A', marginBottom: '8px' }}>
            Students
          </h3>
          <p style={{ fontSize: '32px', fontWeight: '700', color: '#1A1A1A' }}>248</p>
          <p style={{ fontSize: '13px', color: '#7A7A7A' }}>Across all groups</p>
        </div>

        <div
          className="bg-white rounded-xl p-6"
          style={{ border: '1px solid #EAEAEA' }}
        >
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1A1A1A', marginBottom: '8px' }}>
            Submissions
          </h3>
          <p style={{ fontSize: '32px', fontWeight: '700', color: '#1A1A1A' }}>156</p>
          <p style={{ fontSize: '13px', color: '#7A7A7A' }}>Pending review</p>
        </div>
      </div>
    </div>
  );
}
