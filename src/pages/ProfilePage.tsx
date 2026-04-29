import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ProfileCard } from '@/components/ProfileCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, Info, Lock, KeyRound, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { toast } from 'sonner';
export function ProfilePage() {
  const { slug, variant: variantSlug } = useParams<{ slug: string; variant?: string }>();
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [unlockedData, setUnlockedData] = useState<any>(null);
  const { data: initialData, isLoading, error } = useQuery({
    queryKey: ['profile', slug, variantSlug],
    queryFn: async () => {
      const url = variantSlug ? `/api/profiles/${slug}?variant=${variantSlug}` : `/api/profiles/${slug}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Not Found');
      const result = await response.json();
      return result.data;
    },
    retry: false,
    enabled: !!slug,
  });
  const displayData = unlockedData || initialData;
  const isLocked = displayData?.isLocked && !unlockedData;
  const handleVerify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!password || !slug) return;
    setIsVerifying(true);
    try {
      const res = await fetch(`/api/profiles/${slug}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, variantSlug }),
      });
      const result = await res.json();
      if (result.success) {
        setUnlockedData(result.data);
        toast.success('Unlocked');
      } else { toast.error('Wrong password'); }
    } catch { toast.error('Verification failed'); }
    finally { setIsVerifying(false); }
  };
  if (isLoading) return <div className="max-w-2xl mx-auto py-24 px-4 flex justify-center"><Skeleton className="h-[400px] w-full max-w-md rounded-2xl" /></div>;
  if (error || !initialData) return (
    <div className="max-w-7xl mx-auto px-4 py-24 text-center">
      <div className="size-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6"><Info size={32} className="text-muted-foreground" /></div>
      <h1 className="text-2xl font-bold mb-2">Version Not Found</h1>
      <p className="text-muted-foreground mb-8">This intro might have been archived or removed.</p>
      <Button asChild><Link to="/">Start your own</Link></Button>
    </div>
  );
  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle />
      <main className="max-w-2xl mx-auto py-10 md:py-20 px-6 flex flex-col items-center">
        <div className="w-full max-w-md mb-8 flex items-center justify-between no-print">
          <Link to="/" className="text-xs font-bold text-muted-foreground hover:text-indigo-600 flex items-center gap-1">
            <ChevronLeft size={14} /> BACK
          </Link>
          <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
            Version: {displayData?.activeVariant?.name || 'Standard'}
          </div>
        </div>
        <AnimatePresence mode="wait">
          {isLocked ? (
            <motion.div key="locked" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm">
              <Card className="border-border shadow-soft rounded-3xl overflow-hidden bg-card/40 backdrop-blur-sm">
                <CardContent className="p-8 text-center space-y-8">
                  <div className="size-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border-2 border-background shadow-sm"><Lock size={28} /></div>
                  <h2 className="text-xl font-bold">{initialData.fullName}</h2>
                  <form onSubmit={handleVerify} className="space-y-4 text-left">
                    <div className="relative">
                      <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                      <Input type="password" placeholder="Enter password..." className="pl-10 h-11 bg-secondary/30" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <Button type="submit" className="w-full h-11" disabled={isVerifying || !password}>
                      {isVerifying ? 'Verifying...' : 'Unlock Intro'} <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div key="unlocked" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
              <ProfileCard data={{ ...displayData, bio: displayData.activeVariant?.bio }} slug={slug} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}