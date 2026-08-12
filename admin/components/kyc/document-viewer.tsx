'use client';

import { useState } from 'react';
import { ExternalLink, ImageOff, Maximize2, RotateCw, X, ZoomIn, ZoomOut } from 'lucide-react';

interface DocumentViewerProps {
  label: string;
  url?: string | null;
  alt: string;
  className?: string;
}

export function DocumentViewer({ label, url, alt, className = '' }: DocumentViewerProps) {
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const close = () => {
    setOpen(false);
    setZoom(1);
    setRotation(0);
  };

  return (
    <>
      <div className={`overflow-hidden rounded-xl border border-slate-200 bg-slate-50 ${className}`}>
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-3 py-2">
          <p className="text-xs font-semibold text-slate-600">{label}</p>
          {url && (
            <button onClick={() => setOpen(true)} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label={`Open ${label}`}>
              <Maximize2 className="h-4 w-4" />
            </button>
          )}
        </div>
        {url ? (
          <button onClick={() => setOpen(true)} className="flex min-h-[180px] w-full items-center justify-center p-3">
            <img src={url} alt={alt} className="max-h-64 max-w-full object-contain" />
          </button>
        ) : (
          <div className="flex min-h-[180px] flex-col items-center justify-center gap-2 text-slate-400">
            <ImageOff className="h-8 w-8" />
            <span className="text-xs">Not available</span>
          </div>
        )}
      </div>

      {open && url && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-slate-950/95" role="dialog" aria-modal="true" aria-label={`${label} preview`}>
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-white">
            <p className="text-sm font-semibold">{label}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setZoom((value) => Math.max(0.75, value - 0.25))} className="rounded-md p-2 hover:bg-white/10" aria-label="Zoom out"><ZoomOut className="h-4 w-4" /></button>
              <button onClick={() => setZoom((value) => Math.min(3, value + 0.25))} className="rounded-md p-2 hover:bg-white/10" aria-label="Zoom in"><ZoomIn className="h-4 w-4" /></button>
              <button onClick={() => setRotation((value) => value + 90)} className="rounded-md p-2 hover:bg-white/10" aria-label="Rotate image"><RotateCw className="h-4 w-4" /></button>
              <a href={url} target="_blank" rel="noreferrer" className="rounded-md p-2 hover:bg-white/10" aria-label="Open image in new tab"><ExternalLink className="h-4 w-4" /></a>
              <button onClick={close} className="rounded-md p-2 hover:bg-white/10" aria-label="Close preview"><X className="h-5 w-5" /></button>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center overflow-auto p-6">
            <img src={url} alt={alt} className="max-h-full max-w-full object-contain transition-transform" style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }} />
          </div>
        </div>
      )}
    </>
  );
}
