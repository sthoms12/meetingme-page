import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Download, Link as LinkIcon, QrCode, Check, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
interface QRCodeDialogProps {
  url: string;
  label?: string;
  trigger?: React.ReactNode;
}
export function QRCodeDialog({ url, label = "Introduction", trigger }: QRCodeDialogProps) {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    QRCode.toDataURL(url, {
      width: 600,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    }).then(setQrUrl).catch(console.error);
  }, [url]);
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `MeetingMe_${label.replace(/\s+/g, '_')}_QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR Code downloaded');
  };
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link copied');
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2 rounded-2xl h-14 font-bold border-2">
            <QrCode size={20} />
            Show QR Code
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-[2.5rem] p-8">
        <DialogHeader className="items-center text-center">
          <DialogTitle className="text-2xl font-bold">Share Link via QR</DialogTitle>
          <DialogDescription className="text-slate-500 font-medium">
            Scan to view the {label} profile instantly.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-8 py-4">
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/5 rounded-[3rem] -z-10 group-hover:bg-primary/10 transition-colors" />
            <img 
              src={qrUrl} 
              alt="QR Code" 
              className="size-56 object-contain rounded-2xl border-4 border-white shadow-soft" 
            />
          </div>
          <div className="w-full flex flex-col gap-3">
            <Button onClick={handleDownload} className="w-full h-14 rounded-2xl gap-3 font-bold text-lg shadow-lg shadow-primary/20">
              <Download size={20} />
              Download PNG
            </Button>
            <Button variant="secondary" onClick={handleCopyLink} className="w-full h-14 rounded-2xl gap-3 font-bold bg-slate-100 hover:bg-slate-200 text-slate-900 border-none">
              {copied ? <Check size={20} /> : <LinkIcon size={20} />}
              {copied ? 'Copied!' : 'Copy Link Instead'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}