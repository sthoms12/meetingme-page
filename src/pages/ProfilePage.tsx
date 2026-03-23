import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import QRCode from 'qrcode';
import { ProfileCard } from '@/components/ProfileCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Info, Printer, Share2, Mail, Download } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
export function ProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const [qrCode, setQrCode] = useState<string>('');
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
  useEffect(() => {
    if (data?.slug) {
      QRCode.toDataURL(`${window.location.origin}/${data.slug}`, { 
        margin: 2,
        width: 600,
        color: { dark: '#0f172a', light: '#ffffff' }
      }).then(setQrCode);
    }
  }, [data?.slug]);
  const shareViaEmail = () => {
    if (!data) return;
    const url = window.location.href;
    const subject = encodeURIComponent(`Meet ${data.fullName}`);
    const body = encodeURIComponent(`Hi,\n\nWanted to share my intro page with you before we meet:\n\n${url}\n\n"${data.bio}"\n\nSee you soon!`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };
  if (isLoading) return <div className="max-w-2xl mx-auto py-16 md:py-24 px-4 flex flex-col items-center"><Skeleton className="h-[450px] w-full max-w-md rounded-2xl" /></div>;
  if (error || !data) return (
    <div className="max-w-7xl mx-auto px-4 py-24 text-center flex flex-col items-center">
      <div className="size-20 rounded-full bg-muted flex items-center justify-center mb-8">
        <Info size={40} className="text-muted-foreground" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">Profile Not Found</h1>
      <p className="text-muted-foreground mb-8 max-w-sm">This page might have been removed or the URL is incorrect.</p>
      <Button asChild size="lg">
        <Link to="/">Create your own page</Link>
      </Button>
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
                <div className="p-3 bg-white rounded-xl border shadow-sm">
                  <img src={qrCode} className="w-full aspect-square" alt="QR" />
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Button variant="outline" size="sm" onClick={shareViaEmail} className="gap-2 h-10">
                    <Mail size={14} /> Send via Email
                  </Button>
                  <Button variant="primary" size="sm" asChild className="gap-2 h-10">
                    <a href={qrCode} download={`meetingme-${slug}.png`}>
                      <Download size={14} /> Download QR
                    </a>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <ProfileCard data={data} slug={slug} />
        <footer className="mt-16 text-center no-print">
          <div className="flex flex-col items-center gap-2">
            <div className="h-px w-8 bg-border mb-4" />
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black">MeetingMe</p>
            <Link to="/" className="text-[9px] text-indigo-500 hover:underline transition-all">Create yours for free</Link>
          </div>
        </footer>
      </main>
      <div className="hidden print:block fixed bottom-8 left-0 right-0 text-center text-[10px] text-slate-400 font-medium">
        meetingme.page/{slug}
      </div>
    </div>
  );
}