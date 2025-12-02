import React from 'react';
import * as Icons from 'lucide-react';

interface IconProps {
  name: keyof typeof Icons;
  size?: number;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, className }) => {
  const LucideIcon = Icons[name] as React.ElementType;
  if (!LucideIcon) return null;
  return <LucideIcon size={size} className={className} />;
};