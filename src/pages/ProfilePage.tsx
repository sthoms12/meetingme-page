import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ProfileCard } from '@/components/ProfileCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Info } from 'lucide-react';
export function ProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = useQuery({
    queryKey: ['profile', slug],
    queryFn: async () => {
      const response = await fetch(`/api/profiles/${slug}`);
      if (!response.ok) throw new Error('Profile not found');
      const result = await response.json();
      return result.data;
    },
    retry: false,
    enabled: !!slug,
  });
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-16 md:py-24 px-4 flex flex-col items-center">
        <Skeleton className="h-[450px] w-full max-w-md rounded-2xl" />
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center space-y-6 flex flex-col items-center">
        <div className="inline-flex items-center justify-center size-16 rounded-full bg-slate-100 text-slate-400">
          <Info size={32} />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">Profile Not Found</h1>
          <p className="text-muted-foreground">The profile you're looking for doesn't exist or has been removed.</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/">Create your own MeetingMe page</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-2xl mx-auto py-16 md:py-24 px-4 relative flex flex-col items-center">
        <Link 
          to="/" 
          className="absolute top-8 left-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-slate-900 transition-colors"
        >
          <ChevronLeft size={16} />
          MeetingMe
        </Link>
        <ProfileCard data={data} />
        <footer className="mt-12 text-center">
          <p className="text-2xs text-slate-400 uppercase tracking-widest font-bold">
            Powered by <Link to="/" className="text-indigo-600 hover:underline">MeetingMe</Link>
          </p>
        </footer>
      </div>
    </div>
  );
}