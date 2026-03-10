import React from 'react';

const palette: Record<string, string> = {
  New: 'bg-deep-gold/15 text-deep-gold',
  'Best Seller': 'bg-ebony text-soft-cream',
  '24-Hour Deal': 'bg-rose-500/15 text-rose-600',
  Limited: 'bg-warm-clay/20 text-warm-clay',
};

export function Badge({ label }: { label: string }) {
  const classes = palette[label] || 'bg-cloud-gray/60 text-ebony/80';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ring-black/5 ${classes}`}>
      {label}
    </span>
  );
}

export function BadgeRow({ badges }: { badges?: string[] }) {
  if (!badges || badges.length === 0) return null;
  return (
    <span className="flex flex-wrap gap-2">
      {badges.map((label) => (
        <Badge key={label} label={label} />
      ))}
    </span>
  );
}
