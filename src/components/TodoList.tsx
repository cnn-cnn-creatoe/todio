import { AnimatePresence, motion } from 'framer-motion'
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Todo } from '../App'
import TodoItem from './TodoItem'
import type { Language } from '../i18n'

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, text: string) => void;
  onUpdateDetails: (id: string, details: string) => void;
  onUpdateDue: (id: string, due: Date | null) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  language: Language;
  pendingTodoId?: string | null;
  onPendingComplete?: () => void;
  filterMode?: 'today' | 'past' | 'future';
}

function SortableRow({
  todo,
  onToggle,
  onDelete,
  onRename,
  onUpdateDetails,
  onUpdateDue,
  language,
  isPending,
  onPendingComplete,
  filterMode,
}: {
  todo: Todo;
  index: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, text: string) => void;
  onUpdateDetails: (id: string, details: string) => void;
  onUpdateDue: (id: string, due: Date | null) => void;
  language: Language;
  isPending: boolean;
  onPendingComplete?: () => void;
  filterMode: 'today' | 'past' | 'future';
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: todo.id,
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: isDragging ? 1.02 : 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2, type: 'spring', stiffness: 500, damping: 30 }}
      className={isDragging ? 'relative cursor-grabbing' : 'relative cursor-grab'}
    >
      <div {...attributes} {...listeners}>
        <TodoItem
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onRename={onRename}
          onUpdateDetails={onUpdateDetails}
          onUpdateDue={onUpdateDue}
          language={language}
          isPending={isPending}
          onPendingComplete={onPendingComplete}
          filterMode={filterMode}
        />
      </div>
    </motion.div>
  )
}

export default function TodoList({
  todos,
  onToggle,
  onDelete,
  onRename,
  onUpdateDetails,
  onUpdateDue,
  onReorder,
  language,
  pendingTodoId,
  onPendingComplete,
  filterMode = 'today',
}: TodoListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  )

  return (
    <div className="space-y-1.5 relative">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) => {
          const { active, over } = event
          if (!over) return
          if (active.id === over.id) return

          const oldIndex = todos.findIndex((t) => t.id === active.id)
          const newIndex = todos.findIndex((t) => t.id === over.id)
          if (oldIndex === -1 || newIndex === -1) return

          onReorder(oldIndex, newIndex)
        }}
      >
        <SortableContext items={todos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence mode="popLayout">
            {todos.map((todo, index) => (
              <SortableRow
                key={todo.id}
                todo={todo}
                index={index}
                onToggle={onToggle}
                onDelete={onDelete}
                onRename={onRename}
                onUpdateDetails={onUpdateDetails}
                onUpdateDue={onUpdateDue}
                language={language}
                isPending={pendingTodoId === todo.id}
                onPendingComplete={onPendingComplete}
                filterMode={filterMode}
              />
            ))}
          </AnimatePresence>
        </SortableContext>
      </DndContext>
    </div>
  )
}
