import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ProfileCard } from '@/components/ProfileCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Info, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-24 text-center space-y-6 flex flex-col items-center">
          <div className="inline-flex items-center justify-center size-16 rounded-full bg-muted text-muted-foreground">
            <Info size={32} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Profile Not Found</h1>
            <p className="text-muted-foreground">The profile you're looking for doesn't exist or has been removed.</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/">Create your own MeetingMe page</Link>
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle />
      <div className="max-w-2xl mx-auto py-12 md:py-24 px-4 flex flex-col items-center">
        <div className="w-full max-w-md mb-8 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ChevronLeft size={16} />
            Back to MeetingMe
          </Link>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400/80">
            <Sparkles size={14} />
            <span className="text-xs font-bold uppercase tracking-widest">Verified Intro</span>
          </div>
        </div>
        <ProfileCard data={data} />
        <footer className="mt-12 text-center space-y-4">
          <div className="h-px w-12 bg-border mx-auto dark:bg-slate-800" />
          <p className="text-2xs text-muted-foreground uppercase tracking-widest font-bold dark:text-slate-500">
            Powered by <Link to="/" className="text-indigo-600 dark:text-indigo-400 hover:underline">MeetingMe</Link>
          </p>
          <p className="text-[10px] text-muted-foreground/60 max-w-[200px] mx-auto dark:text-slate-600">
            The minimal, professional way to share who you are before the meeting starts.
          </p>
        </footer>
      </div>
    </div>
  );
}