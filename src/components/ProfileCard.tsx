import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Globe, Video, User, Link as LinkIcon, Target, Info } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
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
  const displayJobTitle = jobTitle || 'Your Title';
  const displayCompany = company || 'Company';
  const displayBio = bio || 'Tell people a little bit about yourself and what you bring to the meeting...';
  const topicsArray = Array.isArray(topics)
    ? topics
    : (typeof topics === 'string' ? topics.split(',').map(t => t.trim()).filter(Boolean) : []);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("w-full max-w-md mx-auto print:max-w-none print:transform-none", className)}
    >
      <Card className="overflow-hidden border-border shadow-soft rounded-3xl bg-card text-card-foreground dark:bg-slate-900/40 print:border print:bg-white print:text-black">
        <CardHeader className="flex flex-col items-center pt-12 pb-6 print:pt-6">
          <Avatar className="w-28 h-28 border-4 border-muted shadow-sm dark:border-slate-800 print:border-slate-200 overflow-hidden">
            {profilePhoto && profilePhoto.trim() !== '' ? (
              <AvatarImage
                src={profilePhoto}
                alt={displayFullName}
                className="object-cover"
                loading="lazy"
              />
            ) : null}
            <AvatarFallback className="bg-muted text-muted-foreground dark:bg-slate-800 print:bg-slate-50 print:text-slate-400">
              <User size={40} />
            </AvatarFallback>
          </Avatar>
          <div className="text-center mt-6 space-y-1.5">
            <h2 className="text-2xl font-bold text-foreground tracking-tight print:text-black leading-none">{displayFullName}</h2>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em] print:text-slate-500">
              {displayJobTitle} <span className="opacity-40 px-0.5">/</span> {displayCompany}
            </p>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-12 space-y-7 print:pb-6">
          {(focus || topicsArray.length > 0) && (
            <div className="space-y-4 p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 transition-all mb-1">
              {focus && (
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1 rounded-md bg-indigo-600/10 text-indigo-600">
                    <Target size={14} className="shrink-0" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-black tracking-widest text-indigo-600/60 block leading-none">Primary Focus</span>
                    <p className="text-sm font-bold text-indigo-950 dark:text-indigo-200 leading-tight">
                      {focus}
                    </p>
                  </div>
                </div>
              )}
              {topicsArray.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {topicsArray.map((topic, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Badge variant="secondary" className="bg-white/90 dark:bg-slate-800 border-indigo-100/50 text-[10px] font-bold px-2.5 py-0.5 shadow-sm hover:scale-105 transition-transform cursor-default">
                        #{topic}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="text-muted-foreground text-center leading-relaxed text-sm md:text-base dark:text-slate-300 print:text-slate-700 px-2 italic font-medium">
            "{displayBio}"
          </div>
          {meetingNote && meetingNote.trim() !== '' && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 relative group transition-all hover:bg-slate-100/50 dark:hover:bg-slate-800 print:bg-slate-50 print:border-slate-200">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-sm flex items-center justify-center">
                  <Info size={12} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Before we meet</span>
              </div>
              <p className="text-sm font-medium text-foreground leading-relaxed dark:text-slate-200 print:text-black">
                {meetingNote}
              </p>
            </div>
          )}
          <div className="flex flex-col gap-3 no-print pt-2">
            {linkedinUrl && linkedinUrl.trim() !== '' && (
              <Button asChild variant="outline" className="w-full justify-start gap-3 h-12 rounded-xl transition-all active:scale-[0.98] border-muted-foreground/10 hover:bg-muted/50">
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                  <div className="p-1.5 rounded bg-[#0077b5]/10">
                    <Linkedin className="size-4 text-[#0077b5]" />
                  </div>
                  <span className="font-bold text-sm tracking-tight">LinkedIn Profile</span>
                </a>
              </Button>
            )}
            {websiteUrl && websiteUrl.trim() !== '' && (
              <Button asChild variant="outline" className="w-full justify-start gap-3 h-12 rounded-xl transition-all active:scale-[0.98] border-muted-foreground/10 hover:bg-muted/50">
                <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                  <div className="p-1.5 rounded bg-indigo-500/10">
                    <Globe className="size-4 text-indigo-500" />
                  </div>
                  <span className="font-bold text-sm tracking-tight">Personal Website</span>
                </a>
              </Button>
            )}
            {videoUrl && videoUrl.trim() !== '' && (
              <Button asChild variant="outline" className="w-full justify-start gap-3 h-12 rounded-xl transition-all active:scale-[0.98] border-muted-foreground/10 hover:bg-muted/50">
                <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                  <div className="p-1.5 rounded bg-rose-500/10">
                    <Video className="size-4 text-rose-500" />
                  </div>
                  <span className="font-bold text-sm tracking-tight">Intro Video</span>
                </a>
              </Button>
            )}
          </div>
          <div className="hidden print:block space-y-2 pt-6 border-t border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Links & Contact</p>
            {linkedinUrl && <div className="flex items-center gap-2.5 text-xs text-slate-600 truncate"><Linkedin size={11} className="text-slate-400" /> {linkedinUrl}</div>}
            {websiteUrl && <div className="flex items-center gap-2.5 text-xs text-slate-600 truncate"><Globe size={11} className="text-slate-400" /> {websiteUrl}</div>}
            {videoUrl && <div className="flex items-center gap-2.5 text-xs text-slate-600 truncate"><Video size={11} className="text-slate-400" /> {videoUrl}</div>}
            {slug && <div className="flex items-center gap-2 text-xs font-black text-indigo-600 truncate mt-6 pt-4 border-t border-slate-50"><LinkIcon size={11} /> meetingme.page/{slug}</div>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}