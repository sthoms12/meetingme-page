import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Globe, Video, User } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
interface ProfileCardProps {
  data: {
    fullName?: string;
    jobTitle?: string;
    company?: string;
    bio?: string;
    profilePhoto?: string;
    linkedinUrl?: string;
    websiteUrl?: string;
    videoUrl?: string;
  };
  className?: string;
}
export function ProfileCard({ data, className }: ProfileCardProps) {
  const {
    fullName = 'Your Name',
    jobTitle = 'Your Title',
    company = 'Company',
    bio = 'Tell people a little bit about yourself and what you bring to the meeting...',
    profilePhoto,
    linkedinUrl,
    websiteUrl,
    videoUrl,
  } = data;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("w-full max-w-md mx-auto", className)}
    >
      <Card className="overflow-hidden border-border shadow-soft rounded-2xl bg-card text-card-foreground dark:bg-slate-900/40">
        <CardHeader className="flex flex-col items-center pt-10 pb-6">
          <Avatar className="w-28 h-28 border-4 border-muted shadow-sm dark:border-slate-800">
            <AvatarImage src={profilePhoto} alt={fullName} className="object-cover" />
            <AvatarFallback className="bg-muted text-muted-foreground dark:bg-slate-800">
              <User size={40} />
            </AvatarFallback>
          </Avatar>
          <div className="text-center mt-6 space-y-1">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">{fullName || 'Your Name'}</h2>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {jobTitle || 'Your Title'} <span className="text-muted/60">@</span> {company || 'Company'}
            </p>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-10 space-y-8">
          <div className="text-muted-foreground text-center leading-relaxed text-pretty text-sm md:text-base dark:text-slate-300">
            {bio || 'Tell people a little bit about yourself and what you bring to the meeting...'}
          </div>
          <div className="flex flex-col gap-3">
            {linkedinUrl && (
              <Button asChild variant="outline" className="w-full justify-start gap-3 border-border hover:bg-accent h-11 transition-all">
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="size-4 text-[#0077b5]" />
                  <span>LinkedIn Profile</span>
                </a>
              </Button>
            )}
            {websiteUrl && (
              <Button asChild variant="outline" className="w-full justify-start gap-3 border-border hover:bg-accent h-11 transition-all">
                <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                  <Globe className="size-4 text-muted-foreground" />
                  <span>Personal Website</span>
                </a>
              </Button>
            )}
            {videoUrl && (
              <Button asChild variant="outline" className="w-full justify-start gap-3 border-border hover:bg-accent h-11 transition-all">
                <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                  <Video className="size-4 text-indigo-500" />
                  <span>Intro Video</span>
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}