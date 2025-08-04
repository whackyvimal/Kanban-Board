import { TaskProvider } from '@/contexts/TaskContext';
import { KanbanBoard } from '@/components/KanbanBoard';

const Index = () => {
  return (
    <TaskProvider>
      <KanbanBoard />
    </TaskProvider>
  );
};

export default Index;
