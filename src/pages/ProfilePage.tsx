import React, { useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ProfileCard } from '@/components/ProfileCard';
import { QRCodeDialog } from '@/components/QRCodeDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, Info, Lock, KeyRound, ArrowRight, Share2, Calendar, Sparkles, QrCode } from 'lucide-react';
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
  const handleShare = async () => {
    const shareData = {
      title: `MeetingMe | ${displayData.fullName}`,
      text: `Quick intro before our meeting: ${displayData.fullName} (${displayData.jobTitle})`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') toast.error('Sharing failed');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-10 animate-in fade-in zoom-in duration-500">
        <div className="size-24 rounded-[2rem] bg-white dark:bg-slate-900 flex items-center justify-center mx-auto shadow-soft border border-slate-200 dark:border-slate-800">
          <Info size={48} className="text-primary" />
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">Introduction Not Found</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">This page or version is no longer active. It may have been moved or the handle was changed.</p>
        </div>
        <div className="grid gap-3">
          <Button asChild size="lg" className="rounded-2xl h-14 px-8 font-bold text-lg"><Link to="/">Start Your Own Intro Page</Link></Button>
          <Button variant="ghost" asChild className="text-muted-foreground font-bold"><Link to="/">Learn More</Link></Button>
        </div>
      </div>
    </div>
  );
  if (isEmbed) return (
    <div className="bg-transparent overflow-hidden flex flex-col items-center justify-center p-2">
      <AnimatePresence mode="wait">
        {isLocked ? (
          <Card className="border-border shadow-soft rounded-[2.5rem] w-full max-w-md bg-card/90">
            <CardContent className="p-8 text-center space-y-6">
              <Lock size={32} className="mx-auto text-primary" />
              <div className="space-y-1">
                <h3 className="font-bold">{initialData.fullName}</h3>
                <p className="text-xs text-muted-foreground">Protected Introduction</p>
              </div>
              <form onSubmit={handleVerify} className="space-y-3">
                <Input type="password" placeholder="Password..." className="h-12 rounded-xl" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button type="submit" className="w-full h-12 rounded-xl font-bold">Unlock</Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="w-full flex flex-col items-center">
             <ProfileCard data={{ ...displayData, bio: displayData.activeVariant?.bio }} slug={slug} className="shadow-none border-none" />
             <div className="flex gap-4 mt-6">
               <Button variant="ghost" size="sm" onClick={handleCalendarExport} className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                 <Calendar size={12} className="mr-2" /> Calendar
               </Button>
               <Button variant="ghost" size="sm" onClick={handleShare} className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                 <Share2 size={12} className="mr-2" /> Share
               </Button>
             </div>
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
          <Link to="/" className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group">
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back
          </Link>
          <div className="flex items-center gap-3">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
              {displayData?.activeVariant?.name || 'Standard'}
            </div>
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
              <div className="relative group/card">
                 <ProfileCard data={{ ...displayData, bio: displayData.activeVariant?.bio }} slug={slug} />
                 <div className="absolute -right-20 top-0 hidden lg:flex flex-col gap-3 no-print">
                   <Button variant="outline" size="icon" onClick={handleCalendarExport} className="rounded-2xl size-14 border-2 shadow-soft bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 transition-all hover:scale-110 active:scale-95" title="Export to Calendar">
                      <Calendar className="size-6 text-primary" />
                   </Button>
                   <Button variant="outline" size="icon" onClick={handleShare} className="rounded-2xl size-14 border-2 shadow-soft bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 transition-all hover:scale-110 active:scale-95" title="Share Profile">
                      <Share2 className="size-6 text-muted-foreground" />
                   </Button>
                   <QRCodeDialog 
                    url={window.location.href} 
                    label={displayData?.activeVariant?.name || 'Standard'}
                    trigger={
                      <Button variant="outline" size="icon" className="rounded-2xl size-14 border-2 shadow-soft bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 transition-all hover:scale-110 active:scale-95" title="QR Code">
                        <QrCode className="size-6 text-muted-foreground" />
                      </Button>
                    } 
                   />
                 </div>
              </div>
              <div className="mt-12 flex lg:hidden justify-center gap-3 no-print flex-wrap">
                <Button onClick={handleCalendarExport} className="rounded-2xl h-14 px-6 gap-3 font-bold shadow-soft">
                  <Calendar size={20} /> Add to Calendar
                </Button>
                <Button variant="outline" onClick={handleShare} className="rounded-2xl h-14 px-6 gap-3 font-bold">
                  <Share2 size={20} /> Share
                </Button>
                <QRCodeDialog 
                  url={window.location.href} 
                  label={displayData?.activeVariant?.name || 'Standard'}
                  trigger={
                    <Button variant="outline" className="rounded-2xl h-14 px-6 gap-3 font-bold">
                      <QrCode size={20} /> QR Code
                    </Button>
                  } 
                 />
              </div>
              {isOwner && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-20 w-full pt-12 border-t border-dashed no-print"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3 text-primary">
                      <Sparkles size={20} />
                      <span className="text-xs font-black uppercase tracking-[0.3em]">Owner Dashboard</span>
                    </div>
                    <Button variant="ghost" asChild className="text-[10px] uppercase font-black tracking-widest text-muted-foreground hover:text-primary rounded-xl">
                      <Link to={`/${slug}/edit`}>Manage Introduction</Link>
                    </Button>
                  </div>
                  <CopyBlurbGroup
                    fullName={displayData.fullName}
                    jobTitle={displayData.jobTitle}
                    company={displayData.company}
                    url={window.location.href}
                    className="bg-card/30 p-8 rounded-[2rem] border-2 border-dashed border-primary/10"
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}