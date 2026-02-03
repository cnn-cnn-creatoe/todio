import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import type { Todo } from '../App';
import type { Language } from '../i18n';

interface CalendarViewProps {
  todos: Todo[];
  language: Language;
  onSelectDate: (date: Date, tasksForDate: Todo[]) => void;
}

export default function CalendarView({ todos, language, onSelectDate }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // 获取每个日期的任务列表
  const tasksByDate = useMemo(() => {
    const map = new Map<string, Todo[]>();
    todos.forEach(todo => {
      if (!todo.dueTime) return;
      const d = new Date(todo.dueTime);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(todo);
    });
    return map;
  }, [todos]);

  const year = currentMonth.getFullYear();
  const monthIndex = currentMonth.getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  // 调整为周一开始 (0=周日 -> 6, 1=周一 -> 0, ...)
  const firstWeekDay = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const today = new Date();
  const isToday = (d: Date) =>
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  const cells = useMemo(() => {
    const items = [];
    // 上月的空白日期
    for (let i = 0; i < firstWeekDay; i++) {
      items.push({ key: `prev-${i}`, day: null, inMonth: false, date: null });
    }
    // 当月的日期
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthIndex, day);
      const key = `${year}-${monthIndex}-${day}`;
      const tasks = tasksByDate.get(key) || [];
      items.push({
        key,
        day,
        date,
        inMonth: true,
        tasks,
        count: tasks.filter(t => !t.completed).length,
        isToday: isToday(date)
      });
    }
    return items;
  }, [currentMonth, tasksByDate, year, monthIndex, firstWeekDay, daysInMonth]);

  const weekLabels = language === 'zh'
    ? ['一', '二', '三', '四', '五', '六', '日']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const changeMonth = (delta: number) => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden text-[color:var(--app-text-main)]">
      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto overscroll-contain pr-1 pb-20">
        {/* Month Header - 唯美简洁 */}
        <div className="flex items-center justify-between mb-3 px-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => changeMonth(-1)}
            className="p-1.5 rounded-full bg-[color:var(--app-surface)] hover:bg-[color:var(--app-surface-hover)] transition-colors shadow-sm"
          >
            <ChevronLeft size={14} className="text-[color:var(--app-text-muted)]" />
          </motion.button>
          <motion.h2
            key={currentMonth.toISOString()}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-bold text-[color:var(--app-primary)]"
          >
            {currentMonth.toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US', { month: 'long', year: 'numeric' })}
          </motion.h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => changeMonth(1)}
            className="p-1.5 rounded-full bg-[color:var(--app-surface)] hover:bg-[color:var(--app-surface-hover)] transition-colors shadow-sm"
          >
            <ChevronRight size={14} className="text-[color:var(--app-text-muted)]" />
          </motion.button>
        </div>

        {/* 星期标签 */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {weekLabels.map((label, idx) => (
            <div
              key={label}
              className={`text-center text-[9px] font-semibold py-1 ${idx >= 5 ? 'text-[color:var(--app-primary)]' : 'text-[color:var(--app-text-muted)] opacity-50'
                }`}
            >
              {label}
            </div>
          ))}
        </div>

        {/* 日历网格 - 唯美设计 */}
        <div className="grid grid-cols-7 gap-1.5 auto-rows-fr">
          <AnimatePresence mode="popLayout">
            {cells.map(({ key, day, date, inMonth, tasks, count, isToday }) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                onClick={() => inMonth && date && onSelectDate(date, tasks || [])}
                whileHover={{ scale: inMonth ? 1.05 : 1, y: inMonth ? -2 : 0 }}
                whileTap={{ scale: inMonth ? 0.95 : 1 }}
                className={`
                relative rounded-xl p-1.5 flex flex-col items-center justify-center
                transition-all duration-200 min-h-[36px]
                ${inMonth
                    ? isToday
                      ? 'bg-[color:var(--app-primary-soft)] text-[color:var(--app-primary)] border border-[color:var(--app-primary)] shadow-sm cursor-pointer'
                      : 'bg-[color:var(--app-surface)] hover:bg-[color:var(--app-surface-hover)] border border-[color:var(--app-border)] backdrop-blur-sm cursor-pointer hover:shadow-md'
                    : 'bg-transparent'
                  }
              `}
              >
                {day && (
                  <>
                    <span className={`text-[11px] font-bold ${isToday ? 'text-[color:var(--app-primary)]' : inMonth ? 'text-[color:var(--app-text-main)]' : 'text-[color:var(--app-text-muted)] opacity-20'
                      }`}>
                      {day}
                    </span>

                    {/* 待办数量指示器 - 简约风格 */}
                    {inMonth && (count ?? 0) > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`
                        flex items-center gap-0.5 mt-0.5
                        ${isToday ? 'text-[color:var(--app-primary)]' : 'text-[color:var(--app-primary)]'}
                      `}
                      >
                        <Sparkles size={8} />
                        <span className="text-[8px] font-bold">{count}</span>
                      </motion.div>
                    )}
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* 底部提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-3 text-center"
        >
          <p className="text-[9px] text-[color:var(--app-text-muted)] opacity-50 font-medium">
            {language === 'zh' ? '点击日期查看详情' : 'Click a date to view details'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
