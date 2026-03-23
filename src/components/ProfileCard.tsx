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
    fullName = '',
    jobTitle = '',
    company = '',
    bio = '',
    profilePhoto = '',
    linkedinUrl,
    websiteUrl,
    videoUrl,
  } = data;
  const displayFullName = fullName || 'Your Name';
  const displayJobTitle = jobTitle || 'Your Title';
  const displayCompany = company || 'Company';
  const displayBio = bio || 'Tell people a little bit about yourself and what you bring to the meeting...';
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
            {profilePhoto && (
              <AvatarImage 
                src={profilePhoto} 
                alt={displayFullName} 
                className="object-cover" 
              />
            )}
            <AvatarFallback className="bg-muted text-muted-foreground dark:bg-slate-800">
              <User size={40} />
            </AvatarFallback>
          </Avatar>
          <div className="text-center mt-6 space-y-1">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">{displayFullName}</h2>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {displayJobTitle} <span className="text-muted/40">@</span> {displayCompany}
            </p>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-10 space-y-8">
          <div className="text-muted-foreground text-center leading-relaxed text-pretty text-sm md:text-base dark:text-slate-300">
            {displayBio}
          </div>
          <div className="flex flex-col gap-3">
            {linkedinUrl && linkedinUrl.trim() !== '' && (
              <Button asChild variant="outline" className="w-full justify-start gap-3 border-border hover:bg-accent hover:text-accent-foreground h-11 transition-all active:scale-[0.98]">
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="size-4 text-[#0077b5]" />
                  <span className="font-medium">LinkedIn Profile</span>
                </a>
              </Button>
            )}
            {websiteUrl && websiteUrl.trim() !== '' && (
              <Button asChild variant="outline" className="w-full justify-start gap-3 border-border hover:bg-accent hover:text-accent-foreground h-11 transition-all active:scale-[0.98]">
                <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                  <Globe className="size-4 text-indigo-500" />
                  <span className="font-medium">Personal Website</span>
                </a>
              </Button>
            )}
            {videoUrl && videoUrl.trim() !== '' && (
              <Button asChild variant="outline" className="w-full justify-start gap-3 border-border hover:bg-accent hover:text-accent-foreground h-11 transition-all active:scale-[0.98]">
                <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                  <Video className="size-4 text-rose-500" />
                  <span className="font-medium">Intro Video</span>
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}