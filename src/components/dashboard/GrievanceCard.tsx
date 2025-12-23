import { Grievance } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GrievanceCardProps {
  grievance: Grievance;
  onClick?: () => void;
}

const statusStyles = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  'in-progress': 'bg-primary/10 text-primary border-primary/20',
  resolved: 'bg-success/10 text-success border-success/20',
  escalated: 'bg-destructive/10 text-destructive border-destructive/20',
};

const statusLabels = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  resolved: 'Resolved',
  escalated: 'Escalated',
};

export function GrievanceCard({ grievance, onClick }: GrievanceCardProps) {
  return (
    <div 
      className="bg-card rounded-xl p-5 border border-border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground mb-1">#{grievance.id}</p>
          <h3 className="font-semibold text-foreground line-clamp-1">{grievance.title}</h3>
        </div>
        <Badge variant="outline" className={cn("shrink-0", statusStyles[grievance.status])}>
          {statusLabels[grievance.status]}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {grievance.description}
      </p>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <FolderOpen size={14} />
          <span>{grievance.category}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CalendarDays size={14} />
          <span>{new Date(grievance.submittedDate).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric'
          })}</span>
        </div>
      </div>
    </div>
  );
}
