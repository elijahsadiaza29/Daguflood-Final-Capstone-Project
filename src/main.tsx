// main.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './pages/app/layout';
import '../style/globals.css';
import MyMap from './pages/app/components/map-section/map';
import { ThemeProvider } from './theme-context';
import { HelpCenter } from './pages/app/components/help-center-section/help-center';
import { NotificationProvider } from './pages/app/components/notificationContext/noticationContext';
import ReactDOM from 'react-dom/client';
import { Preloader } from './pre-loader';
import loader from './assets/pre-loader.png';
import { FeedbackTimer } from './pages/app/components/feedback/feedbackForm';
import { Toaster } from '@/components/ui/sonner'; // Update this import
import { NotificationService } from './services/notificationService';
import { useEffect } from 'react';
import Weather from './pages/app/components/weather/hourly-weatherforecast/weather';
import PWAInstaller from './pages/app/components/pwa/PWAInstaller';
import FloodLayout from './pages/app/components/status-levels-section/layout';
// import LevelsContent from './pages/app/components/status-levels-section/chart-container';

const MainApp = () => {
  useEffect(() => {
    NotificationService.setupNotifications();
    return () => {
      NotificationService.cleanup();
    };
  }, []);

  return (
    <>
      <Preloader imageUrl={loader}>
        <NotificationProvider>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Router>
              <AppLayout>
                <div className="relative h-full w-full">
                  <Routes>
                    <Route index element={<MyMap />} />
                    <Route path='/help-center' element={<HelpCenter />} />
                    <Route path='/weather' element={<Weather />} />
                    <Route path='/pwa' element={<PWAInstaller />} />
                    <Route path='/data' element={<FloodLayout />} />
                  </Routes>
                </div>
                <FeedbackTimer />
              </AppLayout>
            </Router>
          </ThemeProvider>
        </NotificationProvider>
      </Preloader>
      <Toaster />
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<MainApp />);