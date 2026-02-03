import { Check, Trash2, Clock, FileText, X, GripVertical, CheckCircle } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import type { Todo } from '../App'
import { getTranslation } from '../i18n'
import type { Language } from '../i18n'

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, text: string) => void;
  onUpdateDetails: (id: string, details: string, priority?: 'low' | 'medium' | 'high') => void;
  onUpdateDue: (id: string, due: Date | null) => void;
  language: Language;
  isPending?: boolean;
  onPendingComplete?: () => void;
  filterMode?: 'today' | 'past' | 'future';
}

interface TimeInfo {
  text: string;
  urgent: boolean;
  overdue: boolean;
  secondsLeft?: number;
}

function formatTimeRemaining(dueTime: Date, t: any): TimeInfo {
  const now = new Date()
  const diff = dueTime.getTime() - now.getTime()

  if (diff < 0) {
    const mins = Math.abs(Math.floor(diff / 60000))
    if (mins < 60) return { text: `${mins}m ${t.overdue}`, urgent: true, overdue: true }
    const hours = Math.floor(mins / 60)
    if (hours < 24) return { text: `${hours}h ${t.overdue}`, urgent: true, overdue: true }
    return { text: `${Math.floor(hours / 24)}d ${t.overdue}`, urgent: true, overdue: true }
  }

  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return { text: `${seconds}s`, urgent: true, overdue: false, secondsLeft: seconds }

  const mins = Math.floor(diff / 60000)
  if (mins < 60) return { text: `${mins}m ${t.left}`, urgent: mins < 30, overdue: false }
  const hours = Math.floor(mins / 60)
  if (hours < 24) return { text: `${hours}h ${mins % 60}m`, urgent: hours < 2, overdue: false }
  const days = Math.floor(hours / 24)
  return { text: `${days}d ${hours % 24}h`, urgent: false, overdue: false }
}

export default function TodoItem({ todo, onToggle, onDelete, onRename, onUpdateDetails, onUpdateDue, language, isPending, onPendingComplete, filterMode = 'today' }: TodoItemProps) {
  const t = getTranslation(language)
  const [, setTick] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 })
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [detailsText, setDetailsText] = useState(todo.details || '')

  // Due Picker State
  const [showDueModal, setShowDueModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [hour, setHour] = useState('12')
  const [minute, setMinute] = useState('00')
  const [reschedulePriority, setReschedulePriority] = useState<'low' | 'medium' | 'high'>(todo.priority || 'medium')
  // Calendar month state - kept for future use
  // const [calendarMonth, setCalendarMonth] = useState(new Date())


  const menuRef = useRef<HTMLDivElement>(null)

  // Initialize due picker state when opening
  const openDueModal = () => {
    if (todo.dueTime) {
      const d = new Date(todo.dueTime)
      setSelectedDate(formatDateLocal(d))
      setHour(d.getHours().toString().padStart(2, '0'))
      setMinute(d.getMinutes().toString().padStart(2, '0'))
      // setCalendarMonth(new Date(d.getFullYear(), d.getMonth(), 1))
    } else {
      setSelectedDate('')
      setHour('12')
      setMinute('00')
      // setCalendarMonth(new Date())
    }
    setReschedulePriority(todo.priority || 'medium')
    setShowDueModal(true)
    setShowContextMenu(false)
  }

  // Auto-open modal if this is a pending todo
  useEffect(() => {
    if (isPending) {
      setShowDueModal(true)
      const now = new Date()
      setSelectedDate(formatDateLocal(now))
      setHour(now.getHours().toString().padStart(2, '0'))
      setMinute(now.getMinutes().toString().padStart(2, '0'))
      setReschedulePriority(todo.priority || 'medium')
    }
  }, [isPending, todo.priority])

  const handleSaveDue = () => {
    const dateStr = selectedDate || formatDateLocal(new Date())
    const h = Math.min(23, Math.max(0, parseInt(hour) || 0))
    const m = Math.min(59, Math.max(0, parseInt(minute) || 0))
    const due = new Date(`${dateStr}T${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`)
    onUpdateDue(todo.id, due)
    // 同时更新优先级
    onUpdateDetails(todo.id, todo.details || '', reschedulePriority)
    setShowDueModal(false)
    if (isPending && onPendingComplete) {
      onPendingComplete()
    }
  }

  // Update every second if urgent
  useEffect(() => {
    if (!todo.dueTime) return
    const now = new Date()
    const diff = new Date(todo.dueTime).getTime() - now.getTime()
    if (diff > 0 && diff < 60000) {
      const interval = setInterval(() => setTick(t => t + 1), 1000)
      return () => clearInterval(interval)
    }
  }, [todo.dueTime])

  // Close context menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowContextMenu(false)
      }
    }
    if (showContextMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showContextMenu])

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenuPos({ x: e.clientX, y: e.clientY })
    setShowContextMenu(true)
  }

  const handleSaveDetails = () => {
    onUpdateDetails(todo.id, detailsText, todo.priority)
    setShowDetailsModal(false)
  }

  const timeInfo = todo.dueTime ? formatTimeRemaining(new Date(todo.dueTime), t) : null

  // Calendar Helpers (adapted from TodoInput)
  const formatDateLocal = (d: Date) => {
    const year = d.getFullYear()
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const day = d.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Calendar helper functions - kept for future use
  // const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  // const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  // 
  // const isPast = (day: number) => {
  //   const d = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day)
  //   const today = new Date(); today.setHours(0,0,0,0)
  //   return d < today
  // }

  // Calendar rendering function - kept for future use
  // const renderCalendar = () => {
  //   const daysInMonth = getDaysInMonth(calendarMonth)
  //   const firstDay = getFirstDayOfMonth(calendarMonth)
  //   const days = []
  //   const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  //
  //   const headers = weekdays.map(w => (
  //     <div key={w} className="text-[10px] font-semibold text-neu-muted/40 text-center py-1">{w}</div>
  //   ))
  //
  //   for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} />)
  //
  //   for (let day = 1; day <= daysInMonth; day++) {
  //     const past = isPast(day)
  //     const selected = selectedDate === formatDateLocal(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day))
  //     const today = formatDateLocal(new Date()) === formatDateLocal(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day))
  //     
  //     days.push(
  //       <button
  //         key={day}
  //         type="button"
  //         disabled={past}
  //         onClick={() => setSelectedDate(formatDateLocal(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day)))}
  //         className={clsx(
  //           "w-7 h-7 rounded-lg text-xs font-semibold transition-all duration-100 cursor-pointer",
  //           selected ? 'bg-violet-500 text-white shadow-md shadow-violet-500/30' :
  //           today ? 'bg-violet-100 text-violet-600' :
  //           past ? 'text-neu-muted/20 cursor-not-allowed' : 'text-neu-text/80 hover:bg-violet-50'
  //         )}
  //       >
  //         {day}
  //       </button>
  //     )
  //   }
  //   return { headers, days }
  // }

  return (
    <>
      <motion.div
        layout
        onContextMenu={handleContextMenu}
        onClick={(e) => {
          // Don't open details if clicking on checkbox or action buttons
          if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('.group\\/checkbox')) {
            return
          }
          // Open details modal on click for all filters
          setShowDetailsModal(true)
        }}
        className={clsx(
          'group flex items-center gap-1.5 p-2 bg-[color:var(--app-surface)] hover:bg-[color:var(--app-surface-hover)] backdrop-blur-sm border border-[color:var(--app-border)] rounded-xl shadow-sm hover:shadow-[0_0_12px_rgba(122,108,255,0.15)] transition-all duration-300 relative overflow-hidden',
          'cursor-pointer',
          todo.completed && 'opacity-60 bg-[color:var(--app-surface-hover)]'
        )}
      >
        {/* Drag Handle */}
        <div className="w-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing text-[color:var(--app-text-muted)] opacity-30 hover:text-[color:var(--app-primary)] -ml-1">
          <GripVertical size={14} />
        </div>

        {/* Checkbox */}
        <motion.button
          layout={false}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            // Don't allow toggling if in past filter
            if (filterMode === 'past') return
            onToggle(todo.id)
          }}
          className={`relative flex-shrink-0 group/checkbox ${filterMode === 'past' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            }`}
        >
          <motion.div
            layout
            className={clsx(
              "w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 border",
              todo.completed
                ? 'border-transparent bg-theme-primary text-white shadow-theme'
                : 'border-[color:var(--app-border)] bg-[color:var(--app-surface)] backdrop-blur-md shadow-inner'
            )}
          >
            <motion.div
              initial={false}
              animate={{ scale: todo.completed ? 1 : 0, opacity: todo.completed ? 1 : 0 }}
            >
              <Check size={10} strokeWidth={3} className="drop-shadow-sm" />
            </motion.div>
          </motion.div>
        </motion.button>

        {/* Task Text & Due Time */}
        <div className="flex-1 min-w-0 overflow-hidden relative">
          {isEditing ? (
            <form
              onSubmit={(e) => { e.preventDefault(); if (editText.trim()) { onRename(todo.id, editText.trim()); setIsEditing(false); } }}
              className="w-full"
            >
              <input
                type="text"
                autoFocus
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={() => { if (editText.trim()) onRename(todo.id, editText.trim()); else setEditText(todo.text); setIsEditing(false); }}
                className="w-full bg-transparent border-none outline-none text-xs font-medium text-[color:var(--app-text-main)] p-0 m-0"
              />
            </form>
          ) : (
            <div className="relative group/text flex items-center gap-1.5">
              {/* Priority indicator */}
              <div
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${(todo.priority || 'medium') === 'low' ? 'bg-gray-400' :
                  (todo.priority || 'medium') === 'medium' ? 'bg-yellow-400' :
                    'bg-red-400'
                  }`}
              />
              <motion.span
                animate={{ color: todo.completed ? 'var(--app-text-muted)' : 'var(--app-text-main)' }}
                className="block text-xs font-medium select-none truncate flex-1"
              >
                {todo.text}
              </motion.span>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: todo.completed ? 1 : 0 }}
                style={{ originX: 0 }}
                className="absolute top-1/2 left-0 right-0 h-[1px] bg-[color:var(--app-text-muted)] pointer-events-none"
              />
            </div>
          )}

          <AnimatePresence>
            {todo.dueTime && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-1 mt-0.5"
              >
                <Clock size={9} className="text-[color:var(--app-text-muted)] opacity-50" />
                <span className="text-[10px] font-medium text-[color:var(--app-text-muted)] opacity-60">
                  {(() => {
                    const due = new Date(todo.dueTime)
                    const now = new Date()
                    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                    const dueDate = new Date(due.getFullYear(), due.getMonth(), due.getDate())

                    // Future date - show full date and time
                    if (dueDate > today) {
                      const dateStr = due.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', {
                        month: 'short',
                        day: 'numeric'
                      })
                      const timeStr = due.toLocaleTimeString(language === 'zh' ? 'zh-CN' : 'en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: language === 'en'
                      })
                      return `${dateStr} ${timeStr}`
                    }
                    // Past date - show full date and time
                    if (dueDate < today) {
                      const dateStr = due.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', {
                        month: 'short',
                        day: 'numeric'
                      })
                      const timeStr = due.toLocaleTimeString(language === 'zh' ? 'zh-CN' : 'en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: language === 'en'
                      })
                      return `${dateStr} ${timeStr}`
                    }
                    // Today - show relative time (only if not completed and not overdue)
                    if (!todo.completed && timeInfo && !timeInfo.overdue) {
                      return timeInfo.text
                    }
                    // If overdue today, just show time without "overdue" text
                    if (!todo.completed && timeInfo && timeInfo.overdue) {
                      const timeStr = due.toLocaleTimeString(language === 'zh' ? 'zh-CN' : 'en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: language === 'en'
                      })
                      return timeStr
                    }
                    // Completed today - show time
                    const timeStr = due.toLocaleTimeString(language === 'zh' ? 'zh-CN' : 'en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: language === 'en'
                    })
                    return timeStr
                  })()}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons (Hover) - View Details and Reschedule */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); setShowDetailsModal(true); }}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-[color:var(--app-text-muted)] opacity-50 hover:text-[color:var(--app-primary)] hover:bg-[color:var(--app-primary-soft)] transition-all cursor-pointer"
            title={language === 'en' ? 'View Details' : '查看详情'}
          >
            <FileText size={12} />
          </motion.button>
          {!todo.completed && (
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); openDueModal(); }}
              className="w-6 h-6 rounded-lg flex items-center justify-center text-[color:var(--app-text-muted)] opacity-50 hover:text-[color:var(--app-primary)] hover:bg-[color:var(--app-primary-soft)] transition-all cursor-pointer"
              title={language === 'en' ? 'Reschedule' : '重新安排'}
            >
              <Clock size={12} />
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Context Menu */}
      <AnimatePresence>
        {showContextMenu && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.9, y: -5 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: -5 }}
            style={{ top: Math.min(contextMenuPos.y, window.innerHeight - 180), left: Math.min(contextMenuPos.x, window.innerWidth - 160) }}
            className="fixed z-[100] bg-[color:var(--app-surface)] backdrop-blur-xl rounded-2xl shadow-2xl border border-[color:var(--app-border)] py-2 min-w-[200px] origin-top-left ring-1 ring-black/5"
          >
            {/* Header to fill space */}
            <div className="px-3.5 py-2 mb-1">
              <p className="text-[10px] font-black text-[color:var(--app-primary)] opacity-50 uppercase tracking-widest">{t.task}</p>
              <p className="text-xs font-bold text-[color:var(--app-text-main)] truncate">{todo.text}</p>
            </div>
            <div className="h-px bg-[color:var(--app-divider)] mx-2 mb-1" />

            {/* Unified menu for all filters */}
            <MenuButton
              icon={<FileText size={16} />}
              text={language === 'en' ? 'View Details' : '查看详情'}
              onClick={() => { setShowContextMenu(false); setShowDetailsModal(true); }}
            />
            <MenuButton
              icon={<Clock size={16} />}
              text={language === 'en' ? 'Reschedule' : '重新安排'}
              onClick={() => { setShowContextMenu(false); openDueModal(); }}
            />

            <div className="h-px bg-[color:var(--app-divider)] mx-2 my-1" />
            <MenuButton
              icon={<Trash2 size={16} />}
              text={t.delete}
              color="text-red-600"
              onClick={() => { setShowContextMenu(false); onDelete(todo.id); }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Time Modification Modal */}
      <AnimatePresence>
        {showDueModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
            onClick={() => setShowDueModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xs bg-[color:var(--app-surface)] backdrop-blur-xl rounded-2xl shadow-xl border border-[color:var(--app-border)] overflow-hidden max-h-[90vh] flex flex-col text-[color:var(--app-text-main)]"
            >
              {/* Header */}
              <div className="px-4 py-3 flex justify-between items-center border-b border-[color:var(--app-divider)] flex-shrink-0">
                <h1 className="text-sm font-semibold text-[color:var(--app-text-main)]">
                  {language === 'en' ? 'Reschedule Task' : '重新安排任务'}
                </h1>
                <button
                  onClick={() => setShowDueModal(false)}
                  className="p-1 rounded-lg hover:bg-[color:var(--app-surface-hover)] transition-colors text-[color:var(--app-text-muted)]"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-4 space-y-3 overflow-y-auto flex-1 min-h-0">
                {/* Priority */}
                <div>
                  <label className="block text-[10px] font-semibold text-[color:var(--app-text-muted)] mb-1.5 uppercase">
                    {language === 'en' ? 'Priority' : '优先级'}
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setReschedulePriority('low')}
                      className={`flex-1 px-3 py-2 rounded-lg font-semibold text-[10px] transition-all flex items-center justify-center gap-1.5 ${reschedulePriority === 'low'
                        ? 'bg-gray-500 text-white'
                        : 'bg-[color:var(--app-surface-hover)] text-[color:var(--app-text-sub)] hover:bg-[color:var(--app-highlight)]'
                        }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      {language === 'en' ? 'Low' : '低'}
                    </button>
                    <button
                      onClick={() => setReschedulePriority('medium')}
                      className={`flex-1 px-3 py-2 rounded-lg font-semibold text-[10px] transition-all flex items-center justify-center gap-1.5 ${reschedulePriority === 'medium'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-[color:var(--app-surface-hover)] text-[color:var(--app-text-sub)] hover:bg-[color:var(--app-highlight)]'
                        }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      {language === 'en' ? 'Medium' : '中'}
                    </button>
                    <button
                      onClick={() => setReschedulePriority('high')}
                      className={`flex-1 px-3 py-2 rounded-lg font-semibold text-[10px] transition-all flex items-center justify-center gap-1.5 ${reschedulePriority === 'high'
                        ? 'bg-red-500 text-white'
                        : 'bg-[color:var(--app-surface-hover)] text-[color:var(--app-text-sub)] hover:bg-[color:var(--app-highlight)]'
                        }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-red-400"></div>
                      {language === 'en' ? 'High' : '高'}
                    </button>
                  </div>
                </div>

                {/* Date & Time - Compact inline */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-semibold text-[color:var(--app-text-muted)] mb-1.5 uppercase">
                    {language === 'en' ? 'Date & Time' : '日期和时间'}
                  </label>
                  <div className="flex items-center gap-2">
                    {/* Date Selector */}
                    <div className="flex-1 flex gap-1">
                      <button
                        onClick={() => {
                          const today = new Date()
                          setSelectedDate(formatDateLocal(today))
                        }}
                        className={`flex-1 px-2 py-1.5 rounded-lg font-semibold text-[10px] transition-all ${!selectedDate || selectedDate === formatDateLocal(new Date())
                          ? 'bg-[color:var(--app-primary-soft)] text-[color:var(--app-primary)]'
                          : 'bg-[color:var(--app-surface-hover)] text-[color:var(--app-text-sub)] hover:bg-[color:var(--app-surface-2)] border border-[color:var(--app-border)]'
                          }`}
                      >
                        {language === 'en' ? 'Today' : '今天'}
                      </button>
                      <button
                        onClick={() => {
                          const tomorrow = new Date()
                          tomorrow.setDate(tomorrow.getDate() + 1)
                          setSelectedDate(formatDateLocal(tomorrow))
                        }}
                        className={`flex-1 px-2 py-1.5 rounded-lg font-semibold text-[10px] transition-all ${selectedDate === formatDateLocal((() => {
                          const t = new Date()
                          t.setDate(t.getDate() + 1)
                          return t
                        })())
                          ? 'bg-[color:var(--app-primary-soft)] text-[color:var(--app-primary)]'
                          : 'bg-[color:var(--app-surface-hover)] text-[color:var(--app-text-sub)] hover:bg-[color:var(--app-surface-2)] border border-[color:var(--app-border)]'
                          }`}
                      >
                        {language === 'en' ? 'Tomorrow' : '明天'}
                      </button>
                      <input
                        type="date"
                        value={selectedDate || formatDateLocal(new Date())}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="flex-1 px-2 py-1.5 rounded-lg font-semibold text-[10px] bg-[color:var(--app-surface-hover)] text-[color:var(--app-text-main)] border border-[color:var(--app-border)] focus:outline-none focus:ring-2 focus:ring-[color:var(--app-primary-soft)] focus-ring"
                      />
                    </div>

                    {/* Time Selector */}
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max="23"
                        value={hour}
                        onChange={(e) => {
                          let val = parseInt(e.target.value) || 0
                          if (val < 0) val = 0
                          if (val > 23) val = 23
                          setHour(val.toString().padStart(2, '0'))
                        }}
                        className="w-10 text-center text-sm font-bold text-[color:var(--app-text-main)] bg-[color:var(--app-surface-hover)] border border-[color:var(--app-border)] rounded-lg py-1 focus:ring-2 focus:ring-[color:var(--app-highlight)] focus:outline-none"
                      />
                      <span className="text-xs text-[color:var(--app-text-muted)]">:</span>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={minute}
                        onChange={(e) => {
                          let val = parseInt(e.target.value) || 0
                          if (val < 0) val = 0
                          if (val > 59) val = 59
                          setMinute(val.toString().padStart(2, '0'))
                        }}
                        className="w-10 text-center text-sm font-bold text-[color:var(--app-text-main)] bg-[color:var(--app-surface-hover)] border border-[color:var(--app-border)] rounded-lg py-1 focus:ring-2 focus:ring-[color:var(--app-highlight)] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-4 py-3 border-t border-gray-200/50 bg-gray-50/30 flex-shrink-0">
                <button
                  onClick={handleSaveDue}
                  className="w-full bg-theme-primary text-white font-semibold py-2 rounded-lg text-xs shadow-theme transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 hover:brightness-110"
                >
                  <CheckCircle size={14} />
                  <span>{language === 'en' ? 'Confirm' : '确认'}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xs bg-[color:var(--app-surface)] backdrop-blur-xl rounded-2xl shadow-xl border border-[color:var(--app-border)] overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="px-4 py-3 flex justify-between items-center border-b border-[color:var(--app-divider)] flex-shrink-0">
                <h1 className="text-sm font-semibold text-[color:var(--app-text-main)]">
                  {language === 'en' ? 'Task Details' : '任务详情'}
                </h1>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-1 rounded-lg hover:bg-[color:var(--app-surface-hover)] transition-colors text-[color:var(--app-text-muted)]"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-4 space-y-3 overflow-y-auto flex-1 min-h-0">
                {/* Priority Level - Read-only display */}
                <div>
                  <label className="block text-[10px] font-semibold text-[color:var(--app-text-muted)] mb-1.5 uppercase">
                    {language === 'en' ? 'Priority' : '优先级'}
                  </label>
                  <div className="px-3 py-2 bg-[color:var(--app-surface-hover)] rounded-lg border border-[color:var(--app-border)] flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${(todo.priority || 'medium') === 'low' ? 'bg-gray-400' :
                        (todo.priority || 'medium') === 'medium' ? 'bg-yellow-400' :
                          'bg-red-400'
                        }`}
                    ></div>
                    <span className="text-xs font-medium text-[color:var(--app-text-main)]">
                      {language === 'en'
                        ? (todo.priority || 'medium') === 'low' ? 'Low' : (todo.priority || 'medium') === 'medium' ? 'Medium' : 'High'
                        : (todo.priority || 'medium') === 'low' ? '低' : (todo.priority || 'medium') === 'medium' ? '中' : '高'
                      }
                    </span>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-[10px] font-semibold text-[color:var(--app-text-muted)] mb-1.5 uppercase">
                    {language === 'en' ? 'Notes' : '备注内容'}
                  </label>
                  <textarea
                    value={detailsText}
                    onChange={(e) => setDetailsText(e.target.value)}
                    placeholder={language === 'en' ? 'Add task notes...' : '添加任务备注...'}
                    className="w-full px-3 py-2 rounded-lg bg-[color:var(--app-surface-hover)] backdrop-blur-sm border border-[color:var(--app-border)] text-xs text-[color:var(--app-text-main)] placeholder-[color:var(--app-text-muted)] focus:ring-2 focus:ring-[color:var(--app-highlight)] focus:outline-none resize-none"
                    rows={4}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-4 py-3 border-t border-[color:var(--app-divider)] bg-[color:var(--app-surface-hover)] flex-shrink-0">
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="flex-1 py-2 rounded-lg bg-[color:var(--app-surface)] border border-[color:var(--app-border)] text-[color:var(--app-text-main)] font-semibold text-xs hover:bg-[color:var(--app-surface-hover)] transition-all active:scale-[0.98]"
                  >
                    {language === 'en' ? 'Cancel' : '取消'}
                  </button>
                  <button
                    onClick={handleSaveDetails}
                    className="flex-1 py-2 rounded-lg bg-theme-primary text-white font-semibold text-xs shadow-theme transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 hover:brightness-110"
                  >
                    <CheckCircle size={14} />
                    <span>{language === 'en' ? 'Save' : '保存'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function MenuButton({ icon, text, onClick, color = "text-[color:var(--app-text-main)]" }: { icon: React.ReactNode, text: string, onClick: () => void, color?: string }) {
  const isRed = color.includes('red')
  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-full px-3 py-2.5 text-left text-sm font-medium transition-all flex items-center gap-3 cursor-pointer rounded-xl",
        isRed
          ? "hover:bg-red-500/10"
          : "hover:bg-[color:var(--app-surface-hover)]",
        color
      )}
    >
      <span className={isRed ? "text-red-500" : "text-[color:var(--app-text-sub)]"}>{icon}</span>
      <span>{text}</span>
    </button>
  )
}
