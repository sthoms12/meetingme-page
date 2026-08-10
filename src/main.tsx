import '@/lib/errorReporter';
import { Suspense, lazy, type ComponentType } from 'react';
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import { Skeleton } from '@/components/ui/skeleton';
import '@/index.css'
import { HomePage } from '@/pages/HomePage';

const ProfilePage = lazy(() => import('@/pages/ProfileRoute'));
const EditPage = lazy(() => import('@/pages/EditRoute'));

const routeFallback = (
  <div className="min-h-screen bg-background flex items-center justify-center p-6">
    <div className="w-full max-w-md space-y-6">
      <Skeleton className="h-[500px] w-full rounded-[2.5rem]" />
    </div>
  </div>
);

const withSuspense = (Component: ComponentType) => (
  <Suspense fallback={routeFallback}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/:slug/edit",
    element: withSuspense(EditPage),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/:slug",
    element: withSuspense(ProfilePage),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/:slug/:variant",
    element: withSuspense(ProfilePage),
    errorElement: <RouteErrorBoundary />,
  },
]);
createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <RouterProvider router={router} />
  </ErrorBoundary>
)
