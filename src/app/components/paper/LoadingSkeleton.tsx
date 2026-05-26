export default function LoadingSkeleton() {
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* AI Banner Skeleton */}
      <div
        className="rounded-xl p-5 mb-6 animate-pulse"
        style={{ background: '#1A1A1A' }}
      >
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-8 h-8 rounded-lg flex-shrink-0"
            style={{ background: '#333' }}
          />
          <div className="flex-1 space-y-2">
            <div
              className="h-3 rounded"
              style={{ background: '#333', width: '80%' }}
            />
            <div
              className="h-3 rounded"
              style={{ background: '#333', width: '60%' }}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <div
            className="h-9 w-36 rounded-lg"
            style={{ background: '#333' }}
          />
          <div
            className="h-9 w-32 rounded-lg"
            style={{ background: '#333' }}
          />
        </div>
      </div>

      {/* Paper Skeleton */}
      <div
        className="bg-white rounded-xl p-6 md:p-10 animate-pulse"
        style={{
          border: '1px solid #EAEAEA',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          maxWidth: '595px',
          margin: '0 auto',
        }}
      >
        {/* Header skeleton */}
        <div className="text-center mb-6 space-y-2">
          <div
            className="h-5 rounded mx-auto"
            style={{ background: '#E5E7EB', width: '60%' }}
          />
          <div
            className="h-3 rounded mx-auto"
            style={{ background: '#E5E7EB', width: '40%' }}
          />
        </div>

        {/* Meta row skeleton */}
        <div className="flex justify-between mb-6">
          <div
            className="h-3 rounded"
            style={{ background: '#E5E7EB', width: '30%' }}
          />
          <div
            className="h-3 rounded"
            style={{ background: '#E5E7EB', width: '25%' }}
          />
        </div>

        {/* Student info skeleton */}
        <div
          className="mb-6 p-3 rounded-lg space-y-2"
          style={{ border: '1px solid #E5E7EB' }}
        >
          <div
            className="h-3 rounded"
            style={{ background: '#E5E7EB', width: '50%' }}
          />
          <div
            className="h-3 rounded"
            style={{ background: '#E5E7EB', width: '50%' }}
          />
          <div
            className="h-3 rounded"
            style={{ background: '#E5E7EB', width: '35%' }}
          />
        </div>

        {/* Section skeleton */}
        <div className="text-center mb-4">
          <div
            className="h-4 rounded mx-auto"
            style={{ background: '#E5E7EB', width: '20%' }}
          />
        </div>

        {/* Question skeletons */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex gap-3 py-3"
            style={{ borderBottom: '1px solid #F3F4F6' }}
          >
            <div
              className="h-3 rounded"
              style={{ background: '#E5E7EB', width: '20px' }}
            />
            <div className="flex-1 space-y-2">
              <div
                className="h-3 rounded"
                style={{ background: '#E5E7EB', width: `${70 + Math.random() * 25}%` }}
              />
              <div
                className="h-3 rounded"
                style={{ background: '#E5E7EB', width: `${40 + Math.random() * 30}%` }}
              />
              <div className="flex gap-2">
                <div
                  className="h-5 rounded-full"
                  style={{ background: '#E5E7EB', width: '60px' }}
                />
                <div
                  className="h-5 rounded-full"
                  style={{ background: '#E5E7EB', width: '50px' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress indicator */}
      <div className="text-center mt-6">
        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full" style={{ background: '#FFF7ED', border: '1px solid #FED7AA' }}>
          <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#FF6A3D', borderTopColor: 'transparent' }} />
          <span style={{ fontSize: '13px', color: '#9A3412', fontWeight: '500' }}>
            Generating your question paper...
          </span>
        </div>
      </div>
    </div>
  );
}
