import '@/lib/errorReporter';
import { Suspense, lazy, type ComponentType } from 'react';
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import { Skeleton } from '@/components/ui/skeleton';
import '@/index.css'

const HomePage = lazy(() => import('@/pages/HomePage').then((module) => ({ default: module.HomePage })));
const ProfilePage = lazy(() => import('@/pages/ProfilePage').then((module) => ({ default: module.ProfilePage })));
const EditPage = lazy(() => import('@/pages/EditPage').then((module) => ({ default: module.EditPage })));

const RouteFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center p-6">
    <div className="w-full max-w-md space-y-6">
      <Skeleton className="h-[500px] w-full rounded-[2.5rem]" />
    </div>
  </div>
);

const withSuspense = (Component: ComponentType) => (
  <Suspense fallback={<RouteFallback />}>
    <Component />
  </Suspense>
);

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: withSuspense(HomePage),
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
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </QueryClientProvider>
)
