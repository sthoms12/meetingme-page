import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Globe, Video, User, Link as LinkIcon, Target, Info, Calendar } from 'lucide-react';
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
  } = data;
  const displayFullName = fullName || 'Your Name';
  const displayJobTitle = jobTitle || 'Professional Title';
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn("w-full max-w-md mx-auto print:max-w-none print:transform-none", className)}
    >
      <Card className="overflow-hidden border-border/60 shadow-soft rounded-[2.5rem] bg-white dark:bg-slate-950 print:border print:bg-white print:text-black transition-colors duration-300">
        <CardHeader className="flex flex-col items-center pt-14 pb-8 print:pt-6">
          <Avatar className="w-32 h-32 border-8 border-slate-50 dark:border-slate-900 shadow-sm print:border-slate-100 overflow-hidden bg-slate-100 dark:bg-slate-900">
            {profilePhoto && profilePhoto.trim() !== '' ? (
              <AvatarImage src={profilePhoto} alt={displayFullName} className="object-cover" />
            ) : null}
            <AvatarFallback className="bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-600 print:bg-slate-50">
              <User size={48} />
            </AvatarFallback>
          </Avatar>
          <div className="text-center mt-8 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-none tracking-tighter">
              {displayFullName}
            </h2>
            <p className="text-[11px] font-black text-primary uppercase tracking-[0.25em] leading-none">
              {displayJobTitle} <span className="text-slate-300 dark:text-slate-700 px-1">/</span> {displayCompany}
            </p>
          </div>
        </CardHeader>
        <CardContent className="px-10 pb-14 space-y-10 print:pb-6">
          {(focus || topicsArray.length > 0) && (
            <div className="space-y-5 p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 transition-all hover:border-primary/20">
              {focus && (
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5 p-1.5 rounded-lg bg-primary/10 text-primary">
                    <Target size={16} className="shrink-0" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60 block leading-none">Primary Focus</span>
                    <p className="text-[15px] font-bold text-slate-900 dark:text-slate-100 leading-tight">
                      {focus}
                    </p>
                  </div>
                </div>
              )}
              {topicsArray.length > 0 && (
                <div className="flex flex-wrap gap-2.5 pt-1">
                  {topicsArray.map((topic, i) => (
                    <Badge key={i} variant="secondary" className="bg-white dark:bg-slate-800 border-slate-200/60 text-[10px] font-black uppercase px-3 py-1 shadow-sm hover:scale-105 transition-transform cursor-default">
                      {topic}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="text-slate-600 text-center leading-relaxed text-base md:text-lg dark:text-slate-300 print:text-slate-700 font-medium italic px-2 whitespace-pre-wrap">
            "{displayBio}"
          </div>
          {meetingNote && meetingNote.trim() !== '' && (
            <div className="p-7 rounded-[2rem] bg-primary/5 dark:bg-primary/10 border-2 border-primary/10 relative group transition-all hover:bg-primary/[0.08] print:bg-slate-50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-1.5 rounded-lg bg-primary text-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Info size={14} />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Pre-Meeting Context</span>
              </div>
              <p className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-200 leading-relaxed print:text-black whitespace-pre-wrap">
                {meetingNote}
              </p>
            </div>
          )}
          <div className="flex flex-col gap-3 no-print pt-4">
            <Button 
              onClick={handleCalendarExport} 
              className="w-full justify-start gap-4 h-15 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 text-white font-bold h-14"
            >
              <div className="p-2 rounded-lg bg-white/20">
                <Calendar className="size-5 text-white" />
              </div>
              <span className="text-[15px]">Add to Calendar</span>
            </Button>
            {linkedinUrl && linkedinUrl.trim() !== '' && (
              <Button asChild variant="outline" className="w-full justify-start gap-4 h-14 rounded-2xl transition-all active:scale-[0.98] border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 group">
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                  <div className="p-2 rounded-lg bg-[#0077b5]/10 group-hover:bg-[#0077b5]/20 transition-colors">
                    <Linkedin className="size-5 text-[#0077b5]" />
                  </div>
                  <span className="font-bold text-[15px] group-hover:text-slate-900 dark:group-hover:text-white transition-colors">LinkedIn Profile</span>
                </a>
              </Button>
            )}
            {websiteUrl && websiteUrl.trim() !== '' && (
              <Button asChild variant="outline" className="w-full justify-start gap-4 h-14 rounded-2xl transition-all active:scale-[0.98] border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 group">
                <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                  <div className="p-2 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                    <Globe className="size-5 text-emerald-500" />
                  </div>
                  <span className="font-bold text-[15px] group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Personal Website</span>
                </a>
              </Button>
            )}
            {videoUrl && videoUrl.trim() !== '' && (
              <Button asChild variant="outline" className="w-full justify-start gap-4 h-14 rounded-2xl transition-all active:scale-[0.98] border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 group">
                <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                  <div className="p-2 rounded-lg bg-rose-500/10 group-hover:bg-rose-500/20 transition-colors">
                    <Video className="size-5 text-rose-500" />
                  </div>
                  <span className="font-bold text-[15px] group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Video Introduction</span>
                </a>
              </Button>
            )}
          </div>
          <div className="hidden print:block space-y-3 pt-8 border-t border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Digital Portfolio</p>
            {linkedinUrl && <div className="flex items-center gap-3 text-sm text-slate-600 truncate"><Linkedin size={14} className="text-slate-400" /> {linkedinUrl}</div>}
            {websiteUrl && <div className="flex items-center gap-3 text-sm text-slate-600 truncate"><Globe size={14} className="text-slate-400" /> {websiteUrl}</div>}
            {slug && <div className="flex items-center gap-2 text-sm font-black text-primary truncate mt-6 pt-6 border-t border-slate-50"><LinkIcon size={14} /> meetingme.page/{slug}</div>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}