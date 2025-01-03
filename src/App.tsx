import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import AppRoutes from './routes';
import { Toaster } from 'react-hot-toast';
import OfflineIndicator from './components/common/OfflineIndicator';
import { useFirebaseConnection } from './hooks/useFirebaseConnection';
import LoadingAnimation from './components/common/LoadingAnimation';

export default function App() {
  const { isInitialized } = useFirebaseConnection();

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <ThemeProvider>
            <DataProvider>
              <OfflineIndicator />
              <AppRoutes />
              <Toaster position="bottom-center" />
            </DataProvider>
          </ThemeProvider>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}