import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Header } from '@/components/layout/Header';
import { Home } from '@/pages/Home';
import { Feed } from '@/pages/Feed';
import { Profile } from '@/pages/Profile';
import { NotFound } from '@/pages/NotFound';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
>>>>>>> 0e34bd3 (Add a 404 catch-all route for invalid URLs)
  );
}

export default App;
