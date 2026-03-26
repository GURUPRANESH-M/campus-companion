import { Notice } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NoticeCardProps {
  notice: Notice;
}

const priorityStyles = {
  high: 'bg-destructive/10 text-destructive border-destructive/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  low: 'bg-success/10 text-success border-success/20',
};

export function NoticeCard({ notice }: NoticeCardProps) {
  return (
    <div className="bg-card rounded-xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow duration-200 animate-slide-up">
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="font-semibold text-foreground line-clamp-1">{notice.title}</h3>
        <Badge variant="outline" className={cn("shrink-0 capitalize", priorityStyles[notice.priority])}>
          {notice.priority}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {notice.content}
      </p>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <User size={14} />
          <span>{notice.author}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CalendarDays size={14} />
          <span>{new Date(notice.date || notice.createdAt || new Date()).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })}</span>
        </div>
      </div>
    </div>
  );
}
