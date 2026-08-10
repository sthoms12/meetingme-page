import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EditPage } from '@/pages/EditPage';

export default function EditRoute() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <EditPage />
    </QueryClientProvider>
  );
}
