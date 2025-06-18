import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CustomToaster } from "@/components/ui/custom-toaster";
import { ToastProvider } from '@/contexts/ToastContext';
import { EnvironmentProvider } from '@/contexts/EnvironmentContext';
import { AuthProvider } from '@/contexts/AuthContext';
import ToastContainer from '@/components/ToastContainer';
import Home from './pages/Home';
import AppDetail from './pages/AppDetail';
import Index from './pages/Index';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <EnvironmentProvider>
        <AuthProvider>
          <ToastProvider>
            <div className="App">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/submissions" element={<Index />} />
                <Route path="/home" element={<Home />} />
                <Route path="/app/:appName" element={<AppDetail />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <CustomToaster />
            </div>
          </ToastProvider>
        </AuthProvider>
      </EnvironmentProvider>
    </Router>
  );
}

export default App;