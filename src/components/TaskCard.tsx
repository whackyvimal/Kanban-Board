import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/contexts/TaskContext';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Clock, AlertCircle, CheckCircle, Circle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  isDragging?: boolean;
}

const getPriorityColor = (priority: Task['priority']) => {
  switch (priority) {
    case 'high':
      return 'bg-priority-high text-white';
    case 'medium':
      return 'bg-priority-medium text-white';
    case 'low':
      return 'bg-priority-low text-white';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getPriorityIcon = (priority: Task['priority']) => {
  switch (priority) {
    case 'high':
      return <AlertCircle className="w-3 h-3" />;
    case 'medium':
      return <Clock className="w-3 h-3" />;
    case 'low':
      return <Circle className="w-3 h-3" />;
    default:
      return <Circle className="w-3 h-3" />;
  }
};

const getStatusIcon = (status: Task['status']) => {
  switch (status) {
    case 'todo':
      return <Circle className="w-4 h-4 text-kanban-todo" />;
    case 'progress':
      return <Clock className="w-4 h-4 text-kanban-progress" />;
    case 'done':
      return <CheckCircle className="w-4 h-4 text-kanban-done" />;
    default:
      return <Circle className="w-4 h-4" />;
  }
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, isDragging }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isActuallyDragging = isDragging || isSortableDragging;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        'bg-kanban-card-bg border border-border rounded-lg p-4 cursor-pointer transition-all duration-200',
        'hover:bg-kanban-card-hover hover:shadow-lg hover:scale-[1.02]',
        'group relative',
        isActuallyDragging && 'opacity-50 shadow-2xl z-50 rotate-3 scale-105'
      )}
    >
      {/* Task Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {getStatusIcon(task.status)}
          <h4 className="font-medium text-foreground text-sm leading-tight flex-1">
            {task.title}
          </h4>
        </div>
        <Badge 
          className={cn(
            'flex items-center gap-1 text-xs px-2 py-1',
            getPriorityColor(task.priority)
          )}
        >
          {getPriorityIcon(task.priority)}
          {task.priority}
        </Badge>
      </div>

      {/* Task Description */}
      {task.description && (
        <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs px-2 py-0.5 bg-muted/50"
            >
              {tag}
            </Badge>
          ))}
          {task.tags.length > 3 && (
            <Badge
              variant="secondary"
              className="text-xs px-2 py-0.5 bg-muted/50"
            >
              +{task.tags.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Task Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {new Date(task.updatedAt).toLocaleDateString()}
        </span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-primary">Click to view</span>
        </div>
      </div>

      {/* Drag Handle Visual Indicator */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-30 transition-opacity">
        <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-muted-foreground rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
};