import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const LoadingSpinner = ({ size = 'md', text }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-gold`} />
      {text && <p className="text-muted-foreground">{text}</p>}
    </div>
  );
};

export const LoadingCard = () => {
  return (
    <div className="glass-card rounded-xl p-6 animate-pulse">
      <div className="h-4 bg-secondary rounded w-3/4 mb-4" />
      <div className="h-4 bg-secondary rounded w-1/2" />
    </div>
  );
};

