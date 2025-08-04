import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useTask, Task } from '@/contexts/TaskContext';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';
import { AddTaskForm } from './AddTaskForm';
import { TaskModal } from './TaskModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const COLUMNS = [
  { id: 'todo', title: 'To Do', status: 'todo' as const },
  { id: 'progress', title: 'In Progress', status: 'progress' as const },
  { id: 'done', title: 'Done', status: 'done' as const },
];

export const KanbanBoard: React.FC = () => {
  const { getTasksByStatus, moveTask } = useTask();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = findTaskById(event.active.id as string);
    setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // If dropped on a column
    if (overId === 'todo' || overId === 'progress' || overId === 'done') {
      moveTask(taskId, overId);
      return;
    }

    // If dropped on another task, find the column and reorder within it
    const overTask = findTaskById(overId);
    if (overTask && overTask.status) {
      moveTask(taskId, overTask.status);
    }
  };

  const findTaskById = (id: string): Task | null => {
    const allTasks = [
      ...getTasksByStatus('todo'),
      ...getTasksByStatus('progress'),
      ...getTasksByStatus('done'),
    ];
    return allTasks.find(task => task.id === id) || null;
  };

  return (
    <div className="min-h-screen bg-gradient-board p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Kanban Board
            </h1>
            <p className="text-muted-foreground">
              Organize your tasks and boost productivity
            </p>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-primary hover:opacity-90 transition-opacity"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Kanban Board */}
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COLUMNS.map(column => {
              const tasks = getTasksByStatus(column.status);
              return (
                <SortableContext
                  key={column.id}
                  items={tasks.map(task => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <KanbanColumn
                    id={column.id}
                    title={column.title}
                    tasks={tasks}
                    onTaskClick={setSelectedTask}
                  />
                </SortableContext>
              );
            })}
          </div>

          <DragOverlay>
            {activeTask ? (
              <TaskCard
                task={activeTask}
                onClick={() => {}}
                isDragging
              />
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Modals */}
        {showAddForm && (
          <AddTaskForm
            isOpen={showAddForm}
            onClose={() => setShowAddForm(false)}
          />
        )}

        {selectedTask && (
          <TaskModal
            task={selectedTask}
            isOpen={!!selectedTask}
            onClose={() => setSelectedTask(null)}
          />
        )}
      </div>
    </div>
  );
};