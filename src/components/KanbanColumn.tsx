import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task } from '@/contexts/TaskContext';
import { TaskCard } from './TaskCard';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const getColumnColor = (id: string) => {
  switch (id) {
    case 'todo':
      return 'border-t-kanban-todo';
    case 'progress':
      return 'border-t-kanban-progress';
    case 'done':
      return 'border-t-kanban-done';
    default:
      return 'border-t-primary';
  }
};

const getColumnIcon = (id: string) => {
  switch (id) {
    case 'todo':
      return '📋';
    case 'progress':
      return '⚡';
    case 'done':
      return '✅';
    default:
      return '📝';
  }
};

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  tasks,
  onTaskClick,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'bg-kanban-column-bg rounded-xl border-t-4 border-border transition-all duration-200',
        getColumnColor(id),
        isOver && 'ring-2 ring-primary/50 scale-105'
      )}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{getColumnIcon(id)}</span>
            <h3 className="font-semibold text-foreground">{title}</h3>
          </div>
          <div className="bg-muted px-2 py-1 rounded-full text-xs font-medium text-muted-foreground">
            {tasks.length}
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="p-4 space-y-3 min-h-[400px]">
        <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
            />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-3">
              <span className="text-2xl opacity-50">{getColumnIcon(id)}</span>
            </div>
            <p className="text-sm text-center">
              No tasks in {title.toLowerCase()}
            </p>
            <p className="text-xs text-center mt-1 opacity-75">
              Drag tasks here or create a new one
            </p>
          </div>
        )}
      </div>
    </div>
  );
};