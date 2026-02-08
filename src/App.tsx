import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { router } from './router';
import { useAuthStore } from './stores/authStore';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#222222',
            color: '#FFFFFF',
            border: '1px solid #333333',
          },
          success: {
            iconTheme: {
              primary: '#C6F135',
              secondary: '#222222',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#222222',
            },
          },
        }}
      />
    </ErrorBoundary>
  );
}

export default App;
