import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { TransactionProvider } from '@/contexts/TransactionContext';
import { OptimisticProvider } from '@/contexts/OptimisticContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToastContainer } from '@/components/ui/toast-container';
import { TransactionToastBridge } from '@/components/transactions/TransactionToastBridge';
import { Home } from '@/pages/Home';
import { Feed } from '@/pages/Feed';
import { Profile } from '@/pages/Profile';
import { Discover } from '@/pages/Discover';
import { Transactions } from '@/pages/Transactions';
import { NotFound } from '@/pages/NotFound';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <Router>
            <AuthProvider>
              <TransactionProvider>
              <OptimisticProvider>
                <div className="min-h-screen bg-background">
                  <Header />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/feed" element={<Feed />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/discover" element={<Discover />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Footer />
                </div>
                <ToastContainer />
                <TransactionToastBridge />
              </OptimisticProvider>
              </TransactionProvider>
            </AuthProvider>
          </Router>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
