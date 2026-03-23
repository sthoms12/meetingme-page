import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';
import { ProfileCard } from '@/components/ProfileCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, Info, Printer, Share2, Mail, Download, Lock, KeyRound, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
export function ProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const [qrCode, setQrCode] = useState<string>('');
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [unlockedData, setUnlockedData] = useState<any>(null);
  const { data: initialData, isLoading, error } = useQuery({
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
  const displayData = unlockedData || initialData;
  const isLocked = displayData?.isLocked && !unlockedData;
  useEffect(() => {
    if (displayData?.slug) {
      QRCode.toDataURL(`${window.location.origin}/${displayData.slug}`, {
        margin: 2,
        width: 600,
        color: { dark: '#0f172a', light: '#ffffff' }
      }).then(setQrCode);
    }
  }, [displayData?.slug]);
  const handleVerify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!password || !slug) return;
    setIsVerifying(true);
    try {
      const res = await fetch(`/api/profiles/${slug}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const result = await res.json();
      if (result.success) {
        setUnlockedData(result.data);
        toast.success('Profile unlocked');
      } else {
        toast.error('Incorrect password');
      }
    } catch {
      toast.error('Verification failed');
    } finally { setIsVerifying(false); }
  };
  const shareViaEmail = () => {
    if (!displayData) return;
    const url = window.location.href;
    const subject = encodeURIComponent(`Meet ${displayData.fullName}`);
    const body = encodeURIComponent(`Hi,\n\nWanted to share my intro page with you before we meet:\n\n${url}\n\nSee you soon!`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };
  if (isLoading) return <div className="max-w-2xl mx-auto py-16 md:py-24 px-4 flex flex-col items-center"><Skeleton className="h-[450px] w-full max-w-md rounded-2xl" /></div>;
  if (error || !initialData) return (
    <div className="max-w-7xl mx-auto px-4 py-24 text-center flex flex-col items-center">
      <div className="size-20 rounded-full bg-muted flex items-center justify-center mb-8"><Info size={40} className="text-muted-foreground" /></div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">Profile Not Found</h1>
      <p className="text-muted-foreground mb-8 max-w-sm">This page might have been removed or the URL is incorrect.</p>
      <Button asChild size="lg"><Link to="/">Create your own page</Link></Button>
    </div>
  );
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="no-print"><ThemeToggle /></div>
      <main className="flex-1 max-w-2xl mx-auto py-10 md:py-20 px-6 flex flex-col items-center w-full relative">
        <div className="w-full max-w-md mb-10 flex items-center justify-between no-print">
          <Link to="/" className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-indigo-600 transition-colors">
            <ChevronLeft size={16} /> Home
          </Link>
          {!isLocked && (
            <div className="flex items-center gap-1.5">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => window.print()} className="hover:bg-secondary">
                      <Printer size={18} className="text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Print Profile</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Popover>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-secondary">
                          <Share2 size={18} className="text-muted-foreground" />
                        </Button>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Share Profile</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <PopoverContent className="w-72 p-6 text-center space-y-5" align="end">
                  <p className="text-sm font-bold tracking-tight">Share Profile</p>
                  <div className="p-3 bg-white rounded-xl border shadow-sm"><img src={qrCode} className="w-full aspect-square" alt="QR" /></div>
                  <div className="grid grid-cols-1 gap-2">
                    <Button variant="outline" size="sm" onClick={shareViaEmail} className="gap-2 h-10"><Mail size={14} /> Send via Email</Button>
                    <Button variant="default" size="sm" asChild className="gap-2 h-10"><a href={qrCode} download={`meetingme-${slug}.png`}><Download size={14} /> Download QR</a></Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
        <AnimatePresence mode="wait">
          {isLocked ? (
            <motion.div key="locked" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-sm">
              <Card className="border-border shadow-soft rounded-3xl overflow-hidden bg-card/40 backdrop-blur-sm">
                <CardContent className="p-8 text-center space-y-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="size-20 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 flex items-center justify-center border-4 border-background shadow-sm">
                      <Lock size={32} />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-2xl font-bold tracking-tight">{initialData.fullName}</h2>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Protected Profile</p>
                    </div>
                  </div>
                  <form onSubmit={handleVerify} className="space-y-4 text-left">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Password Required</label>
                      <div className="relative group">
                        <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-indigo-500 transition-colors" />
                        <Input type="password" placeholder="Enter password..." className="h-11 pl-10 bg-secondary/30 border-none ring-offset-background focus-visible:ring-1 focus-visible:ring-indigo-500" value={password} onChange={(e) => setPassword(e.target.value)} />
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-11 gap-2 font-bold" disabled={isVerifying || !password}>
                      {isVerifying ? 'Unlocking...' : 'Verify Access'} <ArrowRight size={18} />
                    </Button>
                  </form>
                  <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
                    This profile is private. If you were invited by {initialData.fullName.split(' ')[0]}, please use the password they provided.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div key="unlocked" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
              <ProfileCard data={displayData} slug={slug} />
            </motion.div>
          )}
        </AnimatePresence>
        <footer className="mt-16 text-center no-print">
          <div className="flex flex-col items-center gap-2">
            <div className="h-px w-8 bg-border mb-4" />
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black">MeetingMe</p>
            <Link to="/" className="text-[9px] text-indigo-500 hover:underline transition-all font-bold">Create yours for free</Link>
          </div>
        </footer>
      </main>
      <div className="hidden print:block fixed bottom-8 left-0 right-0 text-center text-[10px] text-slate-400 font-medium">
        meetingme.page/{slug}
      </div>
    </div>
  );
}