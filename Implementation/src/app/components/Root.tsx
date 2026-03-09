import { Outlet } from 'react-router';
import { AppProvider } from '../contexts/AppContext';
import { Toaster } from './ui/sonner';

export default function Root() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <Outlet />
      </div>
      <Toaster richColors position="top-center" />
    </AppProvider>
  );
}