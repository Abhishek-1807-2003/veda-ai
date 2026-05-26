import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import MobileNavbar from './components/MobileNavbar';
import MobileBottomBar from './components/MobileBottomBar';
import FloatingActionButton from './components/FloatingActionButton';
import Home from './screens/Home';
import AssignmentsContainer from './screens/AssignmentsContainer';
import CreateAssignment from './screens/CreateAssignment';
import QuestionPaper from './screens/QuestionPaper';
import { useWebSocket } from './hooks/useWebSocket';

function WebSocketProvider({ children }: { children: React.ReactNode }) {
  useWebSocket();
  return <>{children}</>;
}

function Layout({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#E5E7EB' }}>
        <div
          className="w-full max-w-[390px] h-[844px] flex flex-col overflow-hidden"
          style={{
            background: '#2C2C2E',
            borderRadius: '40px',
            boxShadow: '0 0 0 12px #1a1a1a, 0 24px 48px rgba(0,0,0,0.3)'
          }}
        >
          <MobileNavbar />
          <div className="flex-1 overflow-auto pb-14" style={{ background: '#F5F5F5' }}>
            {children}
          </div>
          <MobileBottomBar />
          <FloatingActionButton />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex" style={{ background: '#F5F5F5' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <WebSocketProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: '12px',
              background: '#1A1A1A',
              color: '#fff',
              fontSize: '13px',
            },
          }}
        />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/assignments" element={<AssignmentsContainer />} />
            <Route path="/create-assignment" element={<CreateAssignment />} />
            <Route path="/question-paper/:id" element={<QuestionPaper />} />
            <Route path="/question-paper" element={<QuestionPaper />} />
            <Route path="/groups" element={<Home />} />
            <Route path="/toolkit" element={<Home />} />
            <Route path="/library" element={<Home />} />
          </Routes>
        </Layout>
      </WebSocketProvider>
    </Router>
  );
}