import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Globe, Video, User, Link as LinkIcon, Target, Info, Calendar, Twitter, Github, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { downloadMeetingICS } from '@/lib/calendar-utils';
import { toast } from 'sonner';
interface ProfileCardProps {
  data: {
    fullName?: string;
    jobTitle?: string;
    company?: string;
    bio?: string;
    focus?: string;
    topics?: string[] | string;
    meetingNote?: string;
    profilePhoto?: string;
    linkedinUrl?: string;
    websiteUrl?: string;
    videoUrl?: string;
    twitterUrl?: string;
    githubUrl?: string;
    phone?: string;
  };
  className?: string;
  slug?: string;
}
export function ProfileCard({ data, className, slug }: ProfileCardProps) {
  const {
    fullName = '',
    jobTitle = '',
    company = '',
    bio = '',
    focus = '',
    topics = [],
    meetingNote = '',
    profilePhoto = '',
    linkedinUrl,
    websiteUrl,
    videoUrl,
    twitterUrl,
    githubUrl,
    phone,
  } = data;
  const displayFullName = fullName || 'Professional Name';
  const displayJobTitle = jobTitle || 'Professional Role';
  const displayCompany = company || 'Organization';
  const displayBio = bio || 'Craft a brief, powerful introduction to share before your next high-stakes meeting. Introduce yourself on your own terms.';
  const topicsArray = Array.isArray(topics)
    ? topics
    : (typeof topics === 'string' ? topics.split(',').map(t => t.trim()).filter(Boolean) : []);
  const handleCalendarExport = (e: React.MouseEvent) => {
    e.preventDefault();
    downloadMeetingICS({
      fullName: displayFullName,
      jobTitle: displayJobTitle,
      company: displayCompany,
      bio: displayBio,
      url: slug ? `${window.location.origin}/${slug}` : window.location.href
    });
    toast.success('Meeting invite downloaded');
  };
  const actions = [
    linkedinUrl && { href: linkedinUrl, icon: Linkedin, label: 'LinkedIn', tone: 'text-[#0077b5]' },
    twitterUrl && { href: twitterUrl, icon: Twitter, label: 'X / Twitter', tone: 'text-slate-900 dark:text-white' },
    githubUrl && { href: githubUrl, icon: Github, label: 'GitHub', tone: 'text-slate-800 dark:text-white' },
    phone && { href: `tel:${phone}`, icon: Phone, label: 'Call Direct', tone: 'text-primary' },
    websiteUrl && { href: websiteUrl, icon: Globe, label: 'Website', tone: 'text-emerald-600 dark:text-emerald-400' },
    videoUrl && { href: videoUrl, icon: Video, label: 'Video Intro', tone: 'text-rose-600 dark:text-rose-400' },
  ].filter(Boolean) as { href: string; icon: typeof Linkedin; label: string; tone: string }[];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn("w-full max-w-md mx-auto print:max-w-none print:transform-none", className)}
    >
      <Card className="overflow-hidden border bg-card/95 shadow-soft rounded-3xl print:border print:bg-white print:text-black transition-colors duration-300">
        <CardHeader className="relative px-7 pt-7 pb-0 print:pt-6">
          <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(135deg,hsl(var(--primary)/0.16),hsl(var(--accent)/0.16))]" />
          <div className="relative flex items-start justify-between gap-4">
            <Avatar className="h-24 w-24 border-4 border-card shadow-soft print:border-slate-100 overflow-hidden bg-muted">
            {profilePhoto && profilePhoto.trim() !== '' ? (
              <AvatarImage src={profilePhoto} alt={displayFullName} className="object-cover" />
            ) : null}
            <AvatarFallback className="bg-muted text-muted-foreground print:bg-slate-50">
              <User size={34} />
            </AvatarFallback>
          </Avatar>
            <div className="rounded-full border bg-card/85 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-primary backdrop-blur">
              Meeting Context
            </div>
          </div>
          <div className="relative mt-7 space-y-3">
            <h2 className="font-display text-4xl leading-[0.95] text-foreground break-words">
              {displayFullName}
            </h2>
            <div className="h-px w-16 bg-primary" />
            <p className="text-sm font-semibold text-muted-foreground leading-relaxed">
              {displayJobTitle} at {displayCompany}
            </p>
          </div>
        </CardHeader>
        <CardContent className="px-7 pb-8 pt-7 space-y-7 print:pb-6">
          {(focus || topicsArray.length > 0) && (
            <div className="space-y-5 rounded-2xl border bg-muted/35 p-5">
              {focus && (
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5 p-1.5 rounded-md bg-primary/10 text-primary">
                    <Target size={16} className="shrink-0" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground block leading-none">Primary Focus</span>
                    <p className="text-[15px] font-bold text-foreground leading-tight">
                      {focus}
                    </p>
                  </div>
                </div>
              )}
              {topicsArray.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {topicsArray.map((topic, i) => (
                    <Badge key={i} variant="secondary" className="rounded-full border bg-card text-[10px] font-black uppercase px-3 py-1 cursor-default break-words max-w-full">
                      {topic}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="text-foreground leading-relaxed text-base md:text-[17px] print:text-slate-700 font-medium whitespace-pre-wrap break-words">
            {displayBio}
          </div>
          {meetingNote && meetingNote.trim() !== '' && (
            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/15 relative group transition-all print:bg-slate-50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-1.5 rounded-md bg-primary text-primary-foreground shadow-sm flex items-center justify-center">
                  <Info size={14} />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.18em] text-primary">Before We Meet</span>
              </div>
              <p className="text-sm md:text-base font-bold text-foreground leading-relaxed print:text-black whitespace-pre-wrap break-words">
                {meetingNote}
              </p>
            </div>
          )}
          <div className="flex flex-col gap-3 no-print pt-1">
            <Button
              onClick={handleCalendarExport}
              className="w-full justify-start gap-4 h-[52px] rounded-xl transition-all active:scale-[0.99] bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
            >
              <div className="p-2 rounded-md bg-white/15"><Calendar className="size-5 text-primary-foreground" /></div>
              <span className="text-[15px]">Add to Calendar</span>
            </Button>
            {actions.map(({ href, icon: Icon, label, tone }) => (
              <Button key={`${label}-${href}`} asChild variant="outline" className="w-full justify-start gap-4 h-[52px] rounded-xl transition-all active:scale-[0.99] group bg-card">
                <a href={href} target={href.startsWith('tel:') ? undefined : '_blank'} rel={href.startsWith('tel:') ? undefined : 'noopener noreferrer'}>
                  <div className="p-2 rounded-md bg-muted transition-colors"><Icon className={cn("size-5", tone)} /></div>
                  <span className="font-bold text-[15px]">{label}</span>
                </a>
              </Button>
            ))}
          </div>
          <div className="hidden print:block space-y-3 pt-8 border-t border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Digital Identity</p>
            {linkedinUrl && <div className="flex items-center gap-3 text-sm text-slate-600 truncate"><Linkedin size={14} /> {linkedinUrl}</div>}
            {websiteUrl && <div className="flex items-center gap-3 text-sm text-slate-600 truncate"><Globe size={14} /> {websiteUrl}</div>}
            {phone && <div className="flex items-center gap-3 text-sm text-slate-600 truncate"><Phone size={14} /> {phone}</div>}
            {slug && <div className="flex items-center gap-2 text-sm font-black text-primary truncate mt-6 pt-6 border-t border-slate-50"><LinkIcon size={14} /> meetingme.page/{slug}</div>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
