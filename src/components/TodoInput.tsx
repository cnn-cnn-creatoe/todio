import { useState, useRef } from 'react'
import { Plus, Clock, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, CheckCircle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getTranslation } from '../i18n'
import type { Language } from '../i18n'

interface TodoInputProps {
  onAdd: (text: string, dueTime?: Date | null) => void;
  onAddWithDetails: (text: string) => void;
  language: Language;
}

export default function TodoInput({ onAdd, onAddWithDetails, language }: TodoInputProps) {
  const t = getTranslation(language)
  const [text, setText] = useState('')
  const [showDuePicker, setShowDuePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [hour, setHour] = useState('12')
  const [minute, setMinute] = useState('00')
  const [isAM, setIsAM] = useState(true)
  const [calendarMonth, setCalendarMonth] = useState(new Date())
  const minuteInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      // Instead of adding directly, trigger the details modal
      onAddWithDetails(text.trim())
      setText('')
    }
  }

  const toggleDuePicker = () => {
    if (showDuePicker) {
      setSelectedDate('')
      setHour('12')
      setMinute('00')
    } else {
      setCalendarMonth(new Date())
    }
    setShowDuePicker(!showDuePicker)
  }

  const toggleTimePicker = () => {
    setShowTimePicker(!showTimePicker)
    if (!showTimePicker) {
      // Initialize with current time or existing time
      if (selectedDate && hour && minute) {
        const h = parseInt(hour) || 12
        setIsAM(h < 12 || h === 12)
        setHour((h % 12 || 12).toString().padStart(2, '0'))
      } else {
        const now = new Date()
        const h = now.getHours()
        setHour((h % 12 || 12).toString().padStart(2, '0'))
        setMinute(now.getMinutes().toString().padStart(2, '0'))
        setIsAM(h < 12)
      }
    }
  }

  const adjustHour = (delta: number) => {
    let h = parseInt(hour) || 0
    h = (h + delta + 24) % 24
    setHour(h.toString().padStart(2, '0'))
    setIsAM(h < 12)
  }

  const adjustMinute = (delta: number) => {
    let m = parseInt(minute) || 0
    m = (m + delta + 60) % 60
    setMinute(m.toString().padStart(2, '0'))
  }

  const handleSetTime = () => {
    // Convert to 24-hour format if needed
    let h = parseInt(hour) || 0
    if (!isAM && h < 12) {
      h += 12
    } else if (isAM && h === 12) {
      h = 0
    }
    setHour(h.toString().padStart(2, '0'))
    setShowTimePicker(false)
    // If no date selected, set today's date
    if (!selectedDate) {
      setSelectedDate(formatDateLocal(new Date()))
    }
  }

  const normalizeHour = (val: string) => {
    const num = parseInt(val) || 0
    return Math.min(23, Math.max(0, num)).toString().padStart(2, '0')
  }

  const normalizeMinute = (val: string) => {
    const num = parseInt(val) || 0
    return Math.min(59, Math.max(0, num)).toString().padStart(2, '0')
  }

  const hasDue = selectedDate !== ''

  // Helper to format date as YYYY-MM-DD in local timezone
  const formatDateLocal = (d: Date) => {
    const year = d.getFullYear()
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const day = d.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Quick options
  const quickOptions = [
    { label: t.today, days: 0 },
    { label: t.tomorrow, days: 1 },
    { label: t.threeDays, days: 3 },
    { label: t.nextWeek, days: 7 },
  ]

  const selectQuickOption = (days: number) => {
    const d = new Date()
    d.setDate(d.getDate() + days)
    setSelectedDate(formatDateLocal(d))
  }

  const formatSelectedDate = () => {
    if (!selectedDate) return ''
    const [year, month, day] = selectedDate.split('-').map(Number)
    const d = new Date(year, month - 1, day)
    return d.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const prevMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))
  }

  const selectDay = (day: number) => {
    const d = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day)
    setSelectedDate(formatDateLocal(d))
  }

  const isToday = (day: number) => {
    const today = new Date()
    return calendarMonth.getFullYear() === today.getFullYear() &&
           calendarMonth.getMonth() === today.getMonth() &&
           day === today.getDate()
  }

  const isPast = (day: number) => {
    const d = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return d < today
  }

  const isSelected = (day: number) => {
    if (!selectedDate) return false
    const d = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day)
    return formatDateLocal(d) === selectedDate
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(calendarMonth)
    const firstDay = getFirstDayOfMonth(calendarMonth)
    const days = []
    const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

    // Weekday headers
    const headers = weekdays.map(w => (
      <div key={w} className="text-[10px] font-semibold text-neu-muted/40 text-center py-1">
        {w}
      </div>
    ))

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} />)
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
      const past = isPast(day)
      const today = isToday(day)
      const selected = isSelected(day)
      
      days.push(
        <button
          key={day}
          type="button"
          disabled={past}
          onClick={() => selectDay(day)}
          className={`
            w-7 h-7 rounded-lg text-xs font-semibold transition-all duration-100 cursor-pointer
            ${selected ? 'bg-violet-500 text-white shadow-md shadow-violet-500/30' :
              today ? 'bg-violet-100 text-violet-600' :
              past ? 'text-neu-muted/20 cursor-not-allowed' :
              'text-neu-text/80 hover:bg-violet-50'}
          `}
        >
          {day}
        </button>
      )
    }

    return { headers, days }
  }

  const { headers, days } = renderCalendar()

  return (
    <div className="space-y-1.5 flex-shrink-0">
      <form onSubmit={handleSubmit}>
        <div className="bg-white/40 rounded-lg p-1.5 border border-white/40 shadow-sm backdrop-blur-sm">
          <div className="flex flex-col gap-1">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.whatNeedsToBeDone}
              className="w-full bg-transparent border-0 border-b border-slate-300/60 px-1.5 py-0.5 focus:ring-0 focus:border-primary text-slate-800 placeholder-slate-400/70 transition-colors text-[10px] font-medium"
            />
            
            <div className="flex items-center justify-end pt-0.5">
              <button
                type="submit"
                disabled={!text.trim()}
                className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-3 py-1 rounded-lg text-[10px] font-bold shadow-lg shadow-purple-500/40 flex items-center gap-1 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-30 disabled:shadow-none disabled:cursor-not-allowed"
              >
                <Plus size={11} strokeWidth={3} />
                {language === 'en' ? 'Add' : '添加'}
              </button>
            </div>
          </div>
        </div>
      </form>
      
      {/* Due Picker */}
      <AnimatePresence>
        {showDuePicker && (
          <motion.div
            layout
            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="p-3 bg-white rounded-2xl border border-violet-100/50 shadow-lg space-y-3 overflow-hidden"
          >
            {/* Quick Options */}
            <div className="grid grid-cols-2 gap-2">
              {quickOptions.map((opt) => {
                const d = new Date()
                d.setDate(d.getDate() + opt.days)
                const val = formatDateLocal(d)
                const isSelected = selectedDate === val
                
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => selectQuickOption(opt.days)}
                    className={`py-2 rounded-xl text-[11px] font-semibold transition-colors duration-100 cursor-pointer ${
                      isSelected
                        ? 'bg-violet-500 text-white'
                        : 'bg-violet-50 text-violet-600 hover:bg-violet-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
            
            {/* Custom Calendar */}
            <div className="space-y-3">
              {/* Month Navigation */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-neu-muted/50 hover:bg-violet-50 hover:text-violet-500 transition-colors cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm font-semibold text-neu-text">
                  {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-neu-muted/50 hover:bg-violet-50 hover:text-violet-500 transition-colors cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
              
              {/* Calendar Grid - Fixed Columns, Center Items */}
              <div className="grid grid-cols-7 gap-y-1 justify-items-center">
                {headers}
                {days}
              </div>
            </div>
            
            {/* Time Input */}
            <div className="flex flex-col gap-3 pt-3 border-t border-violet-50">
              <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-neu-muted/40 uppercase tracking-wider">Time</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      value={hour}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 2)
                        setHour(val)
                        if (val.length === 2) {
                          setHour(normalizeHour(val))
                          minuteInputRef.current?.focus()
                          minuteInputRef.current?.select()
                        }
                      }}
                      onBlur={(e) => setHour(normalizeHour(e.target.value))}
                      className="w-8 h-8 rounded-lg bg-violet-50/50 border border-violet-100 text-center text-xs font-bold text-violet-600 outline-none focus:border-violet-300 focus:bg-white transition-colors"
                    />
                    <span className="text-violet-300 font-bold">:</span>
                    <input
                      ref={minuteInputRef}
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      value={minute}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setMinute(e.target.value.replace(/\D/g, '').slice(0, 2))}
                      onBlur={(e) => setMinute(normalizeMinute(e.target.value))}
                      className="w-8 h-8 rounded-lg bg-violet-50/50 border border-violet-100 text-center text-xs font-bold text-violet-600 outline-none focus:border-violet-300 focus:bg-white transition-colors"
                    />
                  </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {['09', '12', '18'].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => { setHour(h); setMinute('00') }}
                    className={`px-2 py-1.5 rounded-[10px] text-[10px] font-semibold transition-all cursor-pointer ${
                      hour === h && minute === '00'
                        ? 'bg-violet-500 text-white shadow-md shadow-violet-500/20'
                        : 'bg-violet-50/50 text-violet-500 hover:bg-violet-100'
                    }`}
                  >
                    {h}:00
                  </button>
                ))}
              </div>
            </div>
            
            {/* Preview */}
            {hasDue && (
              <div className="flex items-center justify-between py-2 px-3 bg-green-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-[11px] font-semibold text-green-700">
                    {formatSelectedDate()} {language === 'zh' ? ' ' : 'at'} {normalizeHour(hour)}:{normalizeMinute(minute)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedDate(''); setHour('12'); setMinute('00') }}
                  className="text-[10px] font-medium text-green-600 hover:text-red-500 cursor-pointer"
                >
                  {language === 'zh' ? '清除' : 'Clear'}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Time Picker Modal */}
      <AnimatePresence>
        {showTimePicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
            onClick={() => setShowTimePicker(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white/85 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/60 overflow-hidden flex flex-col items-center p-6 sm:p-8 relative"
            >
              {/* Header */}
              <div className="flex items-center justify-between w-full mb-8">
                <span className="text-sm font-semibold tracking-wide text-slate-500 uppercase">
                  {language === 'en' ? 'Set Time' : '设置时间'}
                </span>
                <button
                  onClick={() => setShowTimePicker(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors bg-white/50 rounded-full p-1"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Time Display */}
              <div className="flex items-center justify-center gap-4 mb-8">
                {/* Hour */}
                <div className="flex flex-col items-center gap-3">
                  <button
                    onClick={() => adjustHour(1)}
                    className="text-slate-400 hover:text-primary transition-colors p-1"
                  >
                    <ChevronUp size={28} />
                  </button>
                  <div className="w-24 h-28 bg-white/80 backdrop-blur-md rounded-3xl border border-white shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.06)] flex items-center justify-center">
                    <span className="text-6xl font-bold text-slate-700 tracking-tighter">
                      {hour.padStart(2, '0')}
                    </span>
                  </div>
                  <button
                    onClick={() => adjustHour(-1)}
                    className="text-slate-400 hover:text-primary transition-colors p-1"
                  >
                    <ChevronDown size={28} />
                  </button>
                </div>

                <div className="text-4xl font-bold text-slate-300 pb-2">:</div>

                {/* Minute */}
                <div className="flex flex-col items-center gap-3">
                  <button
                    onClick={() => adjustMinute(1)}
                    className="text-slate-400 hover:text-primary transition-colors p-1"
                  >
                    <ChevronUp size={28} />
                  </button>
                  <div className="w-24 h-28 bg-white/80 backdrop-blur-md rounded-3xl border border-white shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.06)] flex items-center justify-center">
                    <span className="text-6xl font-bold text-slate-700 tracking-tighter">
                      {minute.padStart(2, '0')}
                    </span>
                  </div>
                  <button
                    onClick={() => adjustMinute(-1)}
                    className="text-slate-400 hover:text-primary transition-colors p-1"
                  >
                    <ChevronDown size={28} />
                  </button>
                </div>
              </div>

              {/* AM/PM Toggle */}
              <div className="bg-slate-100/80 p-1.5 rounded-2xl flex items-center mb-10 border border-white/60 shadow-inner w-56">
                <button
                  onClick={() => setIsAM(true)}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors ${
                    isAM
                      ? 'bg-white text-primary shadow-sm border border-slate-100'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  AM
                </button>
                <button
                  onClick={() => setIsAM(false)}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors ${
                    !isAM
                      ? 'bg-white text-primary shadow-sm border border-slate-100'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  PM
                </button>
              </div>

              {/* Set Time Button */}
              <button
                onClick={handleSetTime}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-semibold text-lg shadow-lg shadow-violet-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group border border-white/20"
              >
                <CheckCircle size={20} className="text-white/90 group-hover:text-white transition-colors" />
                {language === 'en' ? 'Set Time' : '设置时间'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
