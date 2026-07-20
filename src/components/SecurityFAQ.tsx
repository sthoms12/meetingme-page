import React from 'react';
import { ShieldCheck, Lock, Database, EyeOff, Zap, Info } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
interface SecurityFAQProps {
  className?: string;
}
export function SecurityFAQ({ className }: SecurityFAQProps) {
  const securityItems = [
    {
      id: 'storage',
      icon: <Database className="size-4 text-primary" />,
      question: "Where is my data stored?",
      answer: "Your profile data is persisted using Cloudflare Durable Objects. This enterprise-grade storage resides at the 'edge'—meaning it's geographically close to your visitors for speed, and encrypted-at-rest using industry-standard AES-256."
    },
    {
      id: 'passwords',
      icon: <Lock className="size-4 text-primary" />,
      question: "How are passwords handled?",
      answer: "We never store your plain-text password. At the network edge, it is processed with PBKDF2-SHA256 using a unique random salt and 310,000 iterations. Only the resulting one-way hash and salt are stored, so the original password cannot be recovered from the database."
    },
    {
      id: 'access',
      icon: <ShieldCheck className="size-4 text-primary" />,
      question: "Who can edit my page?",
      answer: "Access is controlled via a unique 32-character 'Edit Token' generated when you create your page. This token is stored only in your browser's LocalStorage and is required for all updates. Public visitors only see a read-only view and have no path to your management dashboard."
    },
    {
      id: 'privacy',
      icon: <EyeOff className="size-4 text-primary" />,
      question: "What about visitor privacy?",
      answer: "B4WeMeet is built for professional transparency, not tracking. We log anonymous view counts to give you feedback, but we do not collect PII (Personally Identifiable Information), email addresses, or use cross-site tracking cookies. Your visitors remain anonymous."
    },
    {
      id: 'infrastructure',
      icon: <Zap className="size-4 text-primary" />,
      question: "How secure is the infrastructure?",
      answer: "The entire platform runs on Cloudflare's global network, benefiting from world-class DDoS protection and WAF (Web Application Firewall) security. By removing traditional server overhead, we eliminate common attack vectors found in standard web hosting."
    }
  ];
  return (
    <div className={cn("w-full max-w-3xl mx-auto space-y-8", className)}>
      <div className="space-y-3 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
          <ShieldCheck size={12} />
          Trust & Transparency
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Security & Privacy</h2>
        <p className="text-muted-foreground text-sm max-w-xl">
          We built B4WeMeet with a "privacy-first" architecture. Here is how we protect your professional identity.
        </p>
      </div>
      <Accordion type="single" collapsible className="w-full space-y-3">
        {securityItems.map((item) => (
          <AccordionItem 
            key={item.id} 
            value={item.id}
            className="border border-slate-200 dark:border-slate-800 rounded-2xl px-6 bg-white dark:bg-slate-950/50 overflow-hidden"
          >
            <AccordionTrigger className="hover:no-underline py-5 group">
              <div className="flex items-center gap-4 text-left">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  {item.icon}
                </div>
                <span className="text-base font-bold text-slate-900 dark:text-slate-100">{item.question}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6 pt-2 text-muted-foreground leading-relaxed text-sm pl-14">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="p-6 rounded-2xl bg-muted/30 border border-dashed border-slate-300 dark:border-slate-700 flex items-start gap-4">
        <Info className="size-5 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong>Note:</strong> Because we use LocalStorage for your edit token, clearing your browser cache or switching devices will require you to use your private edit URL to regain management access. We recommend bookmarking your private dashboard.
        </p>
      </div>
    </div>
  );
}
