import React, { useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ProfileCard } from '@/components/ProfileCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, Info, Lock, KeyRound, ArrowRight, Share2, Calendar } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CopyBlurbGroup } from '@/components/CopyBlurbGroup';
import { toast } from 'sonner';
import { downloadMeetingICS } from '@/lib/calendar-utils';
export function ProfilePage() {
  const { slug, variant: variantSlug } = useParams<{ slug: string; variant?: string }>();
  const [searchParams] = useSearchParams();
  const isEmbed = searchParams.get('embed') === '1';
  const isOwner = slug ? !!localStorage.getItem(`profile_${slug}_token`) : false;
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [unlockedData, setUnlockedData] = useState<any>(null);
  const { data: initialData, isLoading, error } = useQuery({
    queryKey: ['profile', slug, variantSlug, isEmbed],
    queryFn: async () => {
      const url = variantSlug 
        ? `/api/profiles/${slug}?variant=${variantSlug}${isEmbed ? '&embed=1' : ''}` 
        : `/api/profiles/${slug}${isEmbed ? '?embed=1' : ''}`;
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
  const handleCalendarExport = () => {
    if (!displayData) return;
    downloadMeetingICS({
      fullName: displayData.fullName,
      jobTitle: displayData.jobTitle,
      company: displayData.company,
      bio: displayData.activeVariant?.bio || '',
      url: window.location.href
    });
    toast.success('Calendar invite downloaded');
  };
  if (isLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <Skeleton className="h-[500px] w-full rounded-[2.5rem]" />
      </div>
    </div>
  );
  if (error || !initialData) return (
    <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-8">
      <div className="size-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-6"><Info size={40} className="text-muted-foreground" /></div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Profile Unavailable</h1>
        <p className="text-muted-foreground text-lg">This introduction version couldn't be located.</p>
      </div>
      <Button asChild size="lg" className="rounded-2xl h-14 px-8"><Link to="/">Create My Own Page</Link></Button>
    </div>
  );
  if (isEmbed) return (
    <div className="bg-transparent overflow-hidden h-screen flex flex-col items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {isLocked ? (
          <Card className="border-border shadow-soft rounded-[2.5rem] w-full max-w-md bg-card/90">
            <CardContent className="p-8 text-center space-y-6">
              <Lock size={32} className="mx-auto text-primary" />
              <div className="space-y-1">
                <h3 className="font-bold">{initialData.fullName}</h3>
                <p className="text-xs text-muted-foreground">Protected Intro</p>
              </div>
              <form onSubmit={handleVerify} className="space-y-3">
                <Input type="password" placeholder="Password..." className="h-12 rounded-xl" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button type="submit" className="w-full h-12 rounded-xl font-bold">Unlock</Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="w-full h-full flex flex-col items-center">
             <ProfileCard data={{ ...displayData, bio: displayData.activeVariant?.bio }} slug={slug} className="shadow-none border-none scale-[0.98]" />
             <Button variant="ghost" size="sm" onClick={handleCalendarExport} className="mt-4 text-[10px] uppercase font-black tracking-widest text-muted-foreground">
               <Calendar size={12} className="mr-2" /> Add to Calendar
             </Button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
  return (
    <div className="min-h-screen bg-background selection:bg-primary/10">
      <ThemeToggle className="fixed top-6 right-6" />
      <main className="max-w-2xl mx-auto py-16 md:py-24 lg:py-32 px-6 flex flex-col items-center">
        <div className="w-full max-w-md mb-12 flex items-center justify-between no-print">
          <Link to="/" className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
            <ChevronLeft size={14} /> Back
          </Link>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
            {displayData?.activeVariant?.name || 'Standard'}
          </div>
        </div>
        <AnimatePresence mode="wait">
          {isLocked ? (
            <motion.div key="locked" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm">
              <Card className="border-border shadow-soft rounded-[2.5rem] overflow-hidden bg-card/50 backdrop-blur-sm">
                <CardContent className="p-10 text-center space-y-8">
                  <div className="size-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto border-2 border-background shadow-sm"><Lock size={36} /></div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">{initialData.fullName}</h2>
                    <p className="text-sm text-muted-foreground">This introduction is password protected.</p>
                  </div>
                  <form onSubmit={handleVerify} className="space-y-4 text-left">
                    <div className="relative">
                      <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                      <Input type="password" placeholder="Enter password..." className="pl-12 h-14 rounded-2xl bg-secondary/30 border-none" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold" disabled={isVerifying || !password}>
                      {isVerifying ? 'Unlocking...' : 'Unlock Intro'} <ArrowRight size={20} className="ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div key="unlocked" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
              <div className="relative">
                 <ProfileCard data={{ ...displayData, bio: displayData.activeVariant?.bio }} slug={slug} />
                 <Button variant="outline" size="icon" onClick={handleCalendarExport} className="absolute -right-16 top-0 hidden lg:flex rounded-2xl size-14 border-2 shadow-soft bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800" title="Export to Calendar">
                    <Calendar className="size-6 text-primary" />
                 </Button>
              </div>
              {isOwner && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-20 w-full pt-12 border-t border-dashed no-print"
                >
                  <div className="flex items-center gap-3 mb-6 text-primary">
                    <Share2 size={20} />
                    <span className="text-xs font-black uppercase tracking-[0.3em]">Creator Tools</span>
                  </div>
                  <CopyBlurbGroup
                    fullName={displayData.fullName}
                    jobTitle={displayData.jobTitle}
                    company={displayData.company}
                    url={window.location.href}
                    className="bg-card/30 p-8 rounded-[2rem] border-2 border-dashed border-primary/10"
                  />
                  <div className="mt-8 text-center">
                    <Button variant="ghost" asChild className="text-[11px] uppercase font-black tracking-widest text-muted-foreground hover:text-primary rounded-xl">
                      <Link to={`/${slug}/edit`}>Open Management Dashboard</Link>
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}