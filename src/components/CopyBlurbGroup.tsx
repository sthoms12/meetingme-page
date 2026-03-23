import React from 'react';
import { Mail, MessageSquare, Calendar, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
interface CopyBlurbGroupProps {
  fullName: string;
  jobTitle: string;
  company: string;
  url: string;
  className?: string;
}
export function CopyBlurbGroup({ fullName, jobTitle, company, url, className }: CopyBlurbGroupProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };
  const blurbs = [
    {
      id: 'invite',
      label: 'Invite Blurb',
      icon: <Calendar className="size-3.5" />,
      text: `Ahead of our meeting, here’s a quick intro so you know who I am and what I work on: ${url}`,
      description: 'Perfect for calendar invites'
    },
    {
      id: 'email',
      label: 'Email Intro',
      icon: <Mail className="size-3.5" />,
      text: `Hi! Quick intro before we meet: ${url}`,
      description: 'Short & professional for email'
    },
    {
      id: 'chat',
      label: 'Chat (Slack/Teams)',
      icon: <MessageSquare className="size-3.5" />,
      text: `${fullName} | ${jobTitle} @ ${company} → Quick intro: ${url}`,
      description: 'Optimized for chat apps'
    }
  ];
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Quick-Share Blurbs</span>
      </div>
      <div className="grid gap-2">
        {blurbs.map((blurb) => (
          <button
            key={blurb.id}
            onClick={() => copyToClipboard(blurb.text, blurb.id)}
            className="group flex items-start gap-3 p-3 rounded-xl border bg-muted/30 hover:bg-accent hover:border-accent-foreground/10 transition-all text-left w-full active:scale-[0.98]"
          >
            <div className="mt-0.5 p-1.5 rounded-md bg-background border shadow-sm text-muted-foreground group-hover:text-primary transition-colors">
              {blurb.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-foreground">{blurb.label}</span>
                {copiedId === blurb.id ? (
                  <Check className="size-3 text-green-600 animate-in fade-in zoom-in" />
                ) : (
                  <Copy className="size-3 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                )}
              </div>
              <p className="text-[10px] text-muted-foreground truncate">{blurb.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}