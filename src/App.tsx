import { useState, useEffect, useRef, useCallback, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Pin, CircleCheck, Bell, ArrowRight, Settings, Sparkles, Globe, Rocket, Calendar, Check, CheckCircle, MoreHorizontal, ArrowUpDown, ArrowUp, ArrowDown, Coffee } from 'lucide-react'

import TodoInput from './components/TodoInput'
import TodoList from './components/TodoList'
import CalendarView from './components/CalendarView'
import { getTranslation } from './i18n'
import type { Language } from './i18n'

interface SettingsPanelContentProps {
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  backgroundOpacity: number;
  setBackgroundOpacity: (opacity: number) => void;
  autoStart: boolean;
  toggleAutoStart: () => void;
  notificationsEnabled: boolean;
  toggleNotificationsEnabled: () => void;
  onClose: () => void;
  t: any;
  VERSION: string;
  setShowVersionToast: (show: boolean) => void;
  setUpdateInfo: (info: UpdateInfo | null) => void;
}

const SettingsPanelContent = forwardRef<HTMLDivElement, SettingsPanelContentProps>(({
  buttonRef,
  language,
  setLanguage,
  theme,
  setTheme,
  backgroundOpacity,
  setBackgroundOpacity,
  autoStart,
  toggleAutoStart,
  notificationsEnabled,
  toggleNotificationsEnabled,
  onClose,
  t,
  VERSION,
  setShowVersionToast,
  setUpdateInfo
}, ref) => {
  const [position, setPosition] = useState({ top: 0, right: 0 })

  useEffect(() => {
    const updatePosition = () => {
      if (buttonRef.current && ref && 'current' in ref && ref.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect()
        const panelRect = ref.current.getBoundingClientRect()
        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight

        // Calculate position relative to button
        let top = buttonRect.bottom + 8
        let right = windowWidth - buttonRect.right

        // Adjust if panel would go off screen
        if (top + panelRect.height > windowHeight) {
          top = buttonRect.top - panelRect.height - 8
        }
        if (right + panelRect.width > windowWidth) {
          right = windowWidth - panelRect.width - 8
        }
        if (right < 8) {
          right = 8
        }
        if (top < 8) {
          top = 8
        }

        setPosition({ top, right })
      }
    }

    // Initial position update with delay to ensure DOM is ready
    const timeoutId = setTimeout(updatePosition, 0)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition)
    }
  }, [buttonRef, ref])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 5, scale: 0.95 }}
      onClick={(e) => {
        e.stopPropagation()
      }}
      onMouseDown={(e) => {
        e.stopPropagation()
      }}
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        right: `${position.right}px`,
        zIndex: 50
      }}
      className="w-48 max-h-[min(80vh,420px)] overflow-y-auto p-2 bg-[color:var(--app-surface)] backdrop-blur-2xl rounded-lg shadow-xl border border-[color:var(--app-border)] flex flex-col gap-1.5 origin-top-right text-[color:var(--app-text-main)] z-[120]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-0.5">
        <h2 className="text-xs font-semibold text-[color:var(--app-text-main)]">
          {language === 'en' ? 'Settings' : '设置'}
        </h2>
        <button
          onClick={onClose}
          className="w-5 h-5 flex items-center justify-center rounded-full bg-[color:var(--app-highlight)] hover:bg-[color:var(--app-border)] transition-colors text-[color:var(--app-text-sub)]"
        >
          <X size={10} />
        </button>
      </div>

      {/* General Section */}
      <div className="space-y-1">
        <h3 className="text-[8px] font-bold uppercase tracking-wider text-[color:var(--app-text-muted)] mb-0.5">
          {language === 'en' ? 'General' : '常规'}
        </h3>

        {/* Launch on startup */}
        <div className="flex items-center justify-between py-1 px-1.5 rounded bg-[color:var(--app-surface-hover)] border border-[color:var(--app-border)] min-w-0">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <Rocket size={10} className="text-indigo-600 flex-shrink-0" />
            <span className="text-[9px] font-medium truncate">{language === 'en' ? 'Launch on startup' : '开机启动'}</span>
          </div>
          <div className="relative inline-block w-9 h-4 align-middle select-none transition duration-200 ease-in flex-shrink-0 ml-1">
            <input
              type="checkbox"
              checked={autoStart}
              onChange={toggleAutoStart}
              className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-2 border-[color:var(--app-border)] appearance-none cursor-pointer outline-none transition-all duration-300 ease-in-out left-0 top-0 checked:translate-x-full checked:bg-white checked:border-[color:var(--app-primary)]"
            />
            <label className={`block overflow-hidden h-4 rounded-full cursor-pointer transition-colors duration-300 ${autoStart ? 'bg-theme-primary' : 'bg-[color:var(--app-surface-2)]'}`} />
          </div>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between py-1 px-1.5 rounded bg-[color:var(--app-surface-hover)] border border-[color:var(--app-border)] min-w-0">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <Bell size={10} className="text-violet-600 flex-shrink-0" />
            <span className="text-[9px] font-medium truncate">{t.enableNotifications}</span>
          </div>
          <div className="relative inline-block w-9 h-4 align-middle select-none transition duration-200 ease-in flex-shrink-0 ml-1">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={toggleNotificationsEnabled}
              className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-2 border-[color:var(--app-border)] appearance-none cursor-pointer outline-none transition-all duration-300 ease-in-out left-0 top-0 checked:translate-x-full checked:bg-white checked:border-[color:var(--app-primary)]"
            />
            <label className={`block overflow-hidden h-4 rounded-full cursor-pointer transition-colors duration-300 ${notificationsEnabled ? 'bg-theme-primary' : 'bg-[color:var(--app-surface-2)]'}`} />
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="space-y-1">
        <h3 className="text-[8px] font-bold uppercase tracking-wider text-[color:var(--app-text-muted)] mb-0.5">
          {language === 'en' ? 'Appearance' : '外观'}
        </h3>

        {/* Theme Selection - Row Layout */}
        <div className="flex gap-1">
          <button
            onClick={() => {
              setTheme('system');
              localStorage.setItem('todio-theme', 'system');
            }}
            className={`flex-1 py-1 px-1 rounded border-2 transition-all focus:outline-none min-w-0 ${theme === 'system' ? 'border-[color:var(--app-primary)] bg-[color:var(--app-surface-2)] shadow-sm' : 'border-transparent bg-[color:var(--app-surface-hover)] hover:bg-[color:var(--app-highlight)]'
              }`}
          >
            <div className="w-full h-4 rounded bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center mb-0.5 relative">
              <ArrowUpDown size={7} className="text-white relative z-10" />
            </div>
            <span className={`text-[8px] font-bold transition-colors block text-center truncate ${theme === 'system' ? 'text-theme-primary' : 'text-[color:var(--app-text-sub)]'}`}>
              {language === 'en' ? 'System' : '跟随系统'}
            </span>
          </button>

          <button
            onClick={() => { setTheme('light'); localStorage.setItem('todio-theme', 'light'); }}
            className={`flex-1 py-1 px-1 rounded border-2 transition-all focus:outline-none min-w-0 ${theme === 'light' ? 'border-primary bg-[color:var(--app-surface)] shadow-sm' : 'border-transparent bg-[color:var(--app-surface-hover)] hover:bg-[color:var(--app-highlight)]'
              }`}
          >
            <div className="w-full h-4 rounded bg-gray-100 border border-gray-200 flex items-center justify-center mb-0.5 relative">
              <div className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-sm top-0.5 left-0.5"></div>
            </div>
            <span className={`text-[8px] font-medium transition-colors block text-center truncate ${theme === 'light' ? 'text-theme-primary' : 'text-[color:var(--app-text-sub)]'}`}>
              {language === 'en' ? 'Light' : '浅色'}
            </span>
          </button>

          <button
            onClick={() => { setTheme('dark'); localStorage.setItem('todio-theme', 'dark'); }}
            className={`flex-1 py-1 px-1 rounded border-2 transition-all focus:outline-none min-w-0 ${theme === 'dark' ? 'border-[color:var(--app-primary)] bg-[color:var(--app-surface-2)] shadow-sm' : 'border-transparent bg-[color:var(--app-surface-hover)] hover:bg-[color:var(--app-primary-soft)]'
              }`}
          >
            <div className="w-full h-4 rounded bg-slate-800 border border-slate-700 flex items-center justify-center mb-0.5 relative">
              <div className="absolute w-1.5 h-1.5 bg-slate-600 rounded-full shadow-sm top-0.5 left-0.5"></div>
            </div>
            <span className={`text-[8px] font-medium transition-colors block text-center truncate ${theme === 'dark' ? 'text-theme-primary' : 'text-[color:var(--app-text-sub)]'}`}>
              {language === 'en' ? 'Dark' : '深色'}
            </span>
          </button>
        </div>
      </div>

      {/* Opacity Control */}
      <div className="space-y-1 pt-1 border-t border-[color:var(--app-divider)]">
        <div className="w-full flex justify-between items-center text-[8px] text-[color:var(--app-text-muted)] font-medium px-0.5 pt-0.5">
          <span className="truncate">{language === 'en' ? 'Background opacity' : '背景透明度'}</span>
          <span className="flex-shrink-0 ml-1">{Math.round(backgroundOpacity * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={backgroundOpacity}
          onChange={(e) => {
            const val = parseFloat(e.target.value)
            setBackgroundOpacity(Math.min(1, Math.max(0, val)))
          }}
          className="w-full h-3 rounded-full appearance-none cursor-pointer outline-none bg-[color:var(--app-surface-hover)] border border-[color:var(--app-border)] relative z-50 pointer-events-auto
            [&::-webkit-slider-runnable-track]:h-3 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-[color:var(--app-surface-hover)]
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:-mt-[2px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[color:var(--app-primary)] [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white/60
            [&::-moz-range-track]:h-3 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-[color:var(--app-surface-hover)]
            [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[color:var(--app-primary)] [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-white/60"
          onMouseDown={(e) => e.stopPropagation()}
        />
      </div>

      {/* Language Toggle */}
      <div className="pt-1 border-t border-[color:var(--app-divider)]">
        <button
          onClick={() => {
            const newLang = language === 'en' ? 'zh' : 'en'
            setLanguage(newLang)
            localStorage.setItem('todio-language', newLang)
            window.todio?.send('set-language', newLang);
          }}
          className="w-full flex items-center justify-between px-1 py-0.5 rounded hover:bg-[color:var(--app-highlight)] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-1">
            <Globe size={9} className="text-[color:var(--app-text-muted)] opacity-50" />
            <span className="text-[8px] font-medium text-[color:var(--app-text-muted)]">{t.language}</span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] font-medium">
            <span className={language === 'en' ? 'text-violet-600' : 'text-[color:var(--app-text-muted)] opacity-40'}>EN</span>
            <span className="text-[color:var(--app-text-muted)] opacity-30">/</span>
            <span className={language === 'zh' ? 'text-violet-600' : 'text-[color:var(--app-text-muted)] opacity-40'}>中</span>
          </div>
        </button>
      </div>

      {/* Version Info */}
      <div className="pt-1 border-t border-[color:var(--app-divider)] text-center">
        <p className="text-[8px] text-[color:var(--app-text-muted)]">Todio {VERSION}</p>
      </div>

      {/* Help & Updates */}
      <div className="pt-1 border-t border-[color:var(--app-divider)] space-y-0.5">
        <button
          onClick={() => {
            window.todio?.invoke('open-external', 'https://github.com/cnn-cnn-creatoe/todio');
          }}
          className="w-full flex items-center justify-between px-1 py-0.5 rounded hover:bg-[color:var(--app-highlight)] transition-colors cursor-pointer"
        >
          <span className="text-[8px] font-medium text-[color:var(--app-text-muted)]">{t.help}</span>
        </button>

        <button
          onClick={() => {
            window.todio?.invoke('check-for-updates').then((result: any) => {
              if (!result?.hasUpdate) {
                setShowVersionToast(true);
                setTimeout(() => setShowVersionToast(false), 3000);
              } else {
                setUpdateInfo(result);
              }
            }).catch(() => {
              setShowVersionToast(true);
              setTimeout(() => setShowVersionToast(false), 3000);
            });
          }}
          className="w-full flex items-center justify-between px-1 py-0.5 rounded hover:bg-[color:var(--app-highlight)] transition-colors cursor-pointer"
        >
          <span className="text-[8px] font-medium text-[color:var(--app-text-muted)]">{t.checkUpdates}</span>
        </button>

        <button
          onClick={() => {
            window.todio?.send('quit-app');
          }}
          className="w-full flex items-center justify-between px-1 py-0.5 rounded hover:bg-red-500/10 transition-colors cursor-pointer"
        >
          <span className="text-[8px] font-medium text-red-500">{t.quit}</span>
        </button>
      </div>
    </motion.div>
  )
})

SettingsPanelContent.displayName = 'SettingsPanelContent'

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  dueTime?: Date | null;
  notify?: boolean;
  details?: string;
  priority?: 'low' | 'medium' | 'high'; // low=gray, medium=yellow, high=red
  completedDate?: Date | null; // Track when task was completed
}

interface UpdateInfo {
  hasUpdate: boolean;
  latestVersion: string;
  releaseUrl: string;
  releaseNotes: string;
}

const STORAGE_KEY = 'todio-todos'
const SKIP_VERSION_KEY = 'todio-skip-version'
const BACKGROUND_OPACITY_KEY = 'todio-bg-opacity'
const LAST_RUN_VERSION_KEY = 'todio-version'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - __APP_VERSION__ is defined in vite.config.ts
const VERSION = `v${__APP_VERSION__}`
const LANGUAGE_KEY = 'todio-language'
const NOTIFICATIONS_ENABLED_KEY = 'todio-notifications-enabled'
const VIEW_MODE_KEY = 'todio-view-mode'

function AppIcon() {
  const [iconSrc, setIconSrc] = useState<string | null>(null)

  useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      window.todio?.invoke('get-icon-data-url').then((url: string | null) => {
        if (url) setIconSrc(url)
      })
    } catch {
      // Not in Electron; keep fallback
    }
  }, [])

  if (iconSrc) {
    return (
      <img
        src={iconSrc}
        alt="Todio"
        className="w-8 h-8 rounded-xl shadow-sm"
      />
    )
  }

  return (
    <div className="w-8 h-8 rounded-xl bg-theme-primary text-white flex items-center justify-center text-[11px] font-black shadow-theme">
      T
    </div>
  )
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        return parsed.map((t: Todo) => ({
          ...t,
          dueTime: t.dueTime ? new Date(t.dueTime) : null,
          notify: typeof (t as any).notify === 'boolean' ? (t as any).notify : true,
        }))
      }
    } catch { /* Ignore parse errors */ }
    return []
  })



  const [backgroundOpacity, setBackgroundOpacity] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(BACKGROUND_OPACITY_KEY)
      const parsed = saved != null ? Number(saved) : 1
      if (!Number.isFinite(parsed)) return 1
      return Math.min(1, Math.max(0, parsed))
    } catch {
      return 1
    }
  })

  const [isPinned, setIsPinned] = useState(false)
  const [showOpacityControl, setShowOpacityControl] = useState(false)
  const [, setTick] = useState(0)
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showVersionToast, setShowVersionToast] = useState(false)
  const [filterMode, setFilterMode] = useState<'today' | 'past' | 'future'>('today')
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [pendingTodoText, setPendingTodoText] = useState<string | null>(null)
  const [pendingTodoId, setPendingTodoId] = useState<string | null>(null)
  const [newTaskDetails, setNewTaskDetails] = useState('')
  const [newTaskDate, setNewTaskDate] = useState('')
  const [newTaskHour, setNewTaskHour] = useState('')
  const [newTaskMinute, setNewTaskMinute] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [newTaskTitle, setNewTaskTitle] = useState('') // 用于日历添加任务时的标题
  const [showNewTaskModal, setShowNewTaskModal] = useState(false) // 控制从日历添加任务的弹窗
  const [notifiedTaskIds, setNotifiedTaskIds] = useState<Set<string>>(() => {
    // 从 localStorage 加载已提醒过的任务 ID
    const saved = localStorage.getItem('todio-notified-tasks')
    return saved ? new Set(JSON.parse(saved)) : new Set()
  })
  const [showClearSelect, setShowClearSelect] = useState(false)
  const [selectedClearIds, setSelectedClearIds] = useState<Set<string>>(new Set())
  const [showDeleteSelect, setShowDeleteSelect] = useState(false)
  const [selectedDeleteIds, setSelectedDeleteIds] = useState<Set<string>>(new Set())
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [pendingDeleteIds, setPendingDeleteIds] = useState<Set<string>>(new Set())
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [pendingClearIds, setPendingClearIds] = useState<Set<string>>(new Set())
  const [sortOptions, setSortOptions] = useState<{
    time?: 'asc' | 'desc',
    priority?: 'asc' | 'desc',
    completed?: boolean,
    uncompleted?: boolean
  }>({})
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [hasCustomOrder, setHasCustomOrder] = useState(false)
  const [tempHasCustomOrder, setTempHasCustomOrder] = useState(false) // 临时状态，用于对话框内显示
  const opacityRef = useRef<HTMLDivElement>(null)
  const settingsButtonRef = useRef<HTMLButtonElement>(null)
  const settingsPanelRef = useRef<HTMLDivElement>(null)
  const isSettingsClickRef = useRef(false)
  const [autoStart, setAutoStart] = useState(false)
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem(LANGUAGE_KEY)
    return (saved === 'zh' || saved === 'en') ? saved : 'en'
  })
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    const saved = localStorage.getItem('todio-theme')
    return (saved === 'light' || saved === 'dark' || saved === 'system') ? saved : 'light'
  })

  const [viewMode, setViewMode] = useState<'focus' | 'calendar'>(() => {
    const saved = localStorage.getItem(VIEW_MODE_KEY)
    return saved === 'calendar' ? 'calendar' : 'focus'
  })

  // 日历选中日期状态
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null)

  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(NOTIFICATIONS_ENABLED_KEY)
    if (saved === null) return true
    return saved === 'true'
  })

  useEffect(() => {
    localStorage.setItem(VIEW_MODE_KEY, viewMode)
  }, [viewMode])

  useEffect(() => {
    const root = window.document.documentElement;

    const systemPrefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;
    const resolvedTheme = theme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : theme;

    root.classList.remove('dark', 'glass');
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    }
  }, [theme])

  useEffect(() => {
    window.todio?.send('set-language', language)
  }, [language])

  // Listen for pin state changes from the main process (e.g., from tray menu)
  useEffect(() => {
    const unsubscribe = window.todio?.on('pin-state-changed', (pinned: boolean) => {
      if (typeof pinned === 'boolean') {
        setIsPinned(pinned);
      }
    });

    return () => {
      unsubscribe?.();
    };
  }, []);

  // 任务到期提醒检查
  useEffect(() => {
    const checkReminders = () => {
      if (!notificationsEnabled) return;

      const now = new Date();
      // 检查是否有任务到期（任务设定的时间在当前时间的前后1分钟内）
      const dueTask = todos.find(todo => {
        if (todo.completed) return false;
        if (!todo.dueTime) return false;
        if (notifiedTaskIds.has(todo.id)) return false; // 已提醒过

        const dueDate = new Date(todo.dueTime);
        const diffMs = dueDate.getTime() - now.getTime();

        // 只有当任务的创建时间早于到期时间才提醒（避免刚添加就提醒）
        // 任务ID是用 Date.now() 生成的，可以用来判断创建时间
        const createdTime = parseInt(todo.id);
        if (!isNaN(createdTime)) {
          const createdDate = new Date(createdTime);
          // 如果创建时间在到期时间的1分钟内，说明是刚创建的，不提醒
          if (Math.abs(createdDate.getTime() - dueDate.getTime()) < 120000) {
            return false;
          }
        }

        // 如果任务在当前时间的-1分钟到+1分钟内，触发提醒
        return diffMs >= -60000 && diffMs <= 60000;
      });

      if (dueTask) {
        // 使用系统通知而不是界面弹窗
        if (window.todio?.send) {
          window.todio.send('show-notification', {
            title: language === 'zh' ? 'Todio 提醒' : 'Todio Reminder',
            body: language === 'zh'
              ? `任务 "${dueTask.text}" 已到期！`
              : `Task "${dueTask.text}" is due now!`
          });
        }

        // 标记为已提醒
        const newNotifiedIds = new Set(notifiedTaskIds);
        newNotifiedIds.add(dueTask.id);
        setNotifiedTaskIds(newNotifiedIds);
        localStorage.setItem('todio-notified-tasks', JSON.stringify([...newNotifiedIds]));
      }
    };

    // 立即检查一次
    checkReminders();

    // 每30秒检查一次
    const interval = setInterval(checkReminders, 30000);

    return () => clearInterval(interval);
  }, [todos, notificationsEnabled, notifiedTaskIds, language]);

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showMoreMenu) {
        setShowMoreMenu(false)
      }
    }
    if (showMoreMenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showMoreMenu])

  const t = getTranslation(language)

  // Resize logic
  const isResizing = useRef(false)
  const resizeDir = useRef<string>('')
  const startPos = useRef({ x: 0, y: 0 })
  const startBounds = useRef({ x: 0, y: 0, w: 0, h: 0 })

  const handleResizeStart = (e: React.MouseEvent, dir: string) => {
    e.preventDefault()
    isResizing.current = true
    resizeDir.current = dir
    startPos.current = { x: e.screenX, y: e.screenY }
    startBounds.current = {
      x: window.screenX,
      y: window.screenY,
      w: window.outerWidth,
      h: window.outerHeight
    }

    // Set appropriate cursor based on direction
    const cursorMap: Record<string, string> = {
      'move': 'grabbing',
      'nw': 'nwse-resize',
      'ne': 'nesw-resize',
      'sw': 'nesw-resize',
      'se': 'nwse-resize',
      'n': 'ns-resize',
      's': 'ns-resize',
      'w': 'ew-resize',
      'e': 'ew-resize',
    }
    document.body.style.cursor = cursorMap[dir] || 'default'
    document.body.style.userSelect = 'none'
  }

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current) return

    requestAnimationFrame(() => {
      const deltaX = e.screenX - startPos.current.x
      const deltaY = e.screenY - startPos.current.y
      const dir = resizeDir.current

      let newW = startBounds.current.w
      let newH = startBounds.current.h
      let newX = startBounds.current.x
      let newY = startBounds.current.y
      const minWidth = 260
      const minHeight = 360

      // Calculate dimensions based on direction
      if (dir === 'move') {
        newX = startBounds.current.x + deltaX
        newY = startBounds.current.y + deltaY
      } else if (dir === 'se') {
        // Bottom-right corner
        newW = Math.max(minWidth, startBounds.current.w + deltaX)
        newH = Math.max(minHeight, startBounds.current.h + deltaY)
      } else if (dir === 'sw') {
        // Bottom-left corner
        const rawW = startBounds.current.w - deltaX
        if (rawW >= minWidth) {
          newW = rawW
          newX = startBounds.current.x + deltaX
        } else {
          newW = minWidth
          newX = startBounds.current.x + (startBounds.current.w - minWidth)
        }
        newH = Math.max(minHeight, startBounds.current.h + deltaY)
      } else if (dir === 'ne') {
        // Top-right corner
        newW = Math.max(minWidth, startBounds.current.w + deltaX)
        const rawH = startBounds.current.h - deltaY
        if (rawH >= minHeight) {
          newH = rawH
          newY = startBounds.current.y + deltaY
        } else {
          newH = minHeight
          newY = startBounds.current.y + (startBounds.current.h - minHeight)
        }
      } else if (dir === 'nw') {
        // Top-left corner
        const rawW = startBounds.current.w - deltaX
        if (rawW >= minWidth) {
          newW = rawW
          newX = startBounds.current.x + deltaX
        } else {
          newW = minWidth
          newX = startBounds.current.x + (startBounds.current.w - minWidth)
        }
        const rawH = startBounds.current.h - deltaY
        if (rawH >= minHeight) {
          newH = rawH
          newY = startBounds.current.y + deltaY
        } else {
          newH = minHeight
          newY = startBounds.current.y + (startBounds.current.h - minHeight)
        }
      } else if (dir === 'e') {
        // Right edge
        newW = Math.max(minWidth, startBounds.current.w + deltaX)
      } else if (dir === 'w') {
        // Left edge
        const rawW = startBounds.current.w - deltaX
        if (rawW >= minWidth) {
          newW = rawW
          newX = startBounds.current.x + deltaX
        } else {
          newW = minWidth
          newX = startBounds.current.x + (startBounds.current.w - minWidth)
        }
      } else if (dir === 's') {
        // Bottom edge
        newH = Math.max(minHeight, startBounds.current.h + deltaY)
      } else if (dir === 'n') {
        // Top edge
        const rawH = startBounds.current.h - deltaY
        if (rawH >= minHeight) {
          newH = rawH
          newY = startBounds.current.y + deltaY
        } else {
          newH = minHeight
          newY = startBounds.current.y + (startBounds.current.h - minHeight)
        }
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        window.todio?.send('resize-window', {
          width: newW,
          height: newH,
          x: newX,
          y: newY
        })
      } catch { /* Not in Electron */ }
    })
  }, [])

  const handleResizeEnd = useCallback(() => {
    isResizing.current = false
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [])

  useEffect(() => {
    document.addEventListener('mousemove', handleResizeMove)
    document.addEventListener('mouseup', handleResizeEnd)
    return () => {
      document.removeEventListener('mousemove', handleResizeMove)
      document.removeEventListener('mouseup', handleResizeEnd)
    }
  }, [handleResizeMove, handleResizeEnd])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    const safeBackgroundOpacity = Math.min(1, Math.max(0, Number.isFinite(backgroundOpacity) ? backgroundOpacity : 1))
    localStorage.setItem(BACKGROUND_OPACITY_KEY, safeBackgroundOpacity.toString())
  }, [backgroundOpacity])

  // Click outside to close opacity control
  useEffect(() => {
    if (!showOpacityControl) return

    let isClickingButton = false

    // Track when button is clicked
    const handleButtonClick = () => {
      isClickingButton = true
      setTimeout(() => {
        isClickingButton = false
      }, 300)
    }

    if (settingsButtonRef.current) {
      settingsButtonRef.current.addEventListener('click', handleButtonClick, true)
    }

    const handleClickOutside = (event: MouseEvent) => {
      // Ignore if we just clicked the button
      if (isClickingButton) {
        return
      }

      const target = event.target as Node

      // Check if click is on settings button
      if (settingsButtonRef.current && (settingsButtonRef.current === target || settingsButtonRef.current.contains(target))) {
        return
      }

      // Check if click is on settings panel
      if (settingsPanelRef.current && (settingsPanelRef.current === target || settingsPanelRef.current.contains(target))) {
        return
      }

      // Check if click is inside the opacityRef container (which contains the button)
      if (opacityRef.current && (opacityRef.current === target || opacityRef.current.contains(target))) {
        return
      }

      // Click is outside, close the panel
      setShowOpacityControl(false)
    }

    // Use a longer delay to avoid immediate trigger on button click
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside, true)
    }, 300)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('click', handleClickOutside, true)
      if (settingsButtonRef.current) {
        settingsButtonRef.current.removeEventListener('click', handleButtonClick, true)
      }
    }
  }, [showOpacityControl])

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000)
    return () => clearInterval(interval)
  }, [])

  // Check version for welcome message
  useEffect(() => {
    const lastRunVersion = localStorage.getItem(LAST_RUN_VERSION_KEY)
    if (lastRunVersion !== VERSION) {
      setTimeout(() => setShowWelcome(true), 1000)
      localStorage.setItem(LAST_RUN_VERSION_KEY, VERSION)
    }
  }, [])

  // Check auto-launch status on mount
  useEffect(() => {
    const checkAutoLaunch = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const enabled = await window.todio?.invoke('get-auto-launch');
        setAutoStart(enabled);
      } catch { /* Not in Electron */ }
    };
    checkAutoLaunch();
  }, [])

  // Auto-update check
  useEffect(() => {
    const checkUpdate = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const result = await window.todio?.invoke('check-for-updates');

        // Ensure strictly newer version
        const currentVerNum = VERSION.replace('v', '');
        const latestVerNum = result.latestVersion.replace('v', '');

        if (result.hasUpdate && latestVerNum !== currentVerNum) {
          const skippedVersion = localStorage.getItem(SKIP_VERSION_KEY);
          if (skippedVersion !== result.latestVersion) {
            setTimeout(() => {
              setUpdateInfo(result);
            }, 5000);
          }
        }
      } catch { /* Not in Electron or network error */ }
    }

    checkUpdate();
  }, [])


  const addTodoWithDetails = (text: string) => {
    // Don't add task yet, just set pending state to open details modal
    setPendingTodoText(text)
    setPendingTodoId(null) // Will be created when confirmed

    // Initialize form defaults
    const now = new Date()
    setNewTaskDate(formatDateLocal(now))
    setNewTaskHour(now.getHours().toString().padStart(2, '0'))
    setNewTaskMinute(now.getMinutes().toString().padStart(2, '0'))
    setNewTaskDetails('')
  }

  const formatDateLocal = (d: Date) => {
    const year = d.getFullYear()
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const day = d.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleConfirmNewTask = () => {
    if (!pendingTodoText) return

    const dateStr = newTaskDate || formatDateLocal(new Date())
    const h = Math.min(23, Math.max(0, parseInt(newTaskHour) || new Date().getHours()))
    const m = Math.min(59, Math.max(0, parseInt(newTaskMinute) || new Date().getMinutes()))
    const due = new Date(`${dateStr}T${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`)

    const newId = crypto.randomUUID()
    setTodos(prev => [...prev, {
      id: newId,
      text: pendingTodoText,
      completed: false,
      dueTime: due,
      details: newTaskDetails || undefined,
      priority: newTaskPriority || 'medium',
      notify: true,
    }])

    // Reset states
    setPendingTodoText(null)
    setPendingTodoId(null)
    setNewTaskDetails('')
    setNewTaskDate('')
    setNewTaskHour('')
    setNewTaskMinute('')
    setNewTaskPriority('medium')
  }

  const toggleTodo = (id: string) => {
    // Check if task is in past filter - if so, don't allow toggling
    const task = todos.find(t => t.id === id)
    if (task && filterMode === 'past') {
      // Don't toggle if in past filter - past tasks can only be viewed, deleted, or rescheduled
      return
    }
    setTodos(prev => prev.map(t => {
      if (t.id === id) {
        const newCompleted = !t.completed
        return {
          ...t,
          completed: newCompleted,
          completedDate: newCompleted ? new Date() : null
        }
      }
      return t
    }))
  }

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  const renameTodo = (id: string, newText: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, text: newText } : t))
  }

  const updateDetails = (id: string, details: string, priority?: 'low' | 'medium' | 'high') => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, details, priority: priority || t.priority || 'medium' } : t))
  }

  const reorderTodos = (fromIndex: number, toIndex: number) => {
    setHasCustomOrder(true) // 标记用户已进行自主排序
    setTodos(prev => {
      const newTodos = [...prev]
      const [removed] = newTodos.splice(fromIndex, 1)
      newTodos.splice(toIndex, 0, removed)
      return newTodos
    })
  }

  const updateDue = (id: string, dueTime: Date | null) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, dueTime } : t))
  }

  const clearAll = (idsToClear?: string[]) => {
    // 如果提供了要清除的 ID 列表，直接使用它
    if (idsToClear && idsToClear.length > 0) {
      idsToClear.forEach(id => deleteTodo(id))
      return
    }

    // 否则，清空当前筛选模式下的所有任务
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const todayEnd = new Date(now)
    todayEnd.setHours(23, 59, 59, 999)

    let idsToDelete = new Set<string>()

    if (filterMode === 'today') {
      todos.forEach(todo => {
        if (!todo.dueTime) return
        const due = new Date(todo.dueTime)
        const dueDate = new Date(due.getFullYear(), due.getMonth(), due.getDate())
        const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        if (todo.completed) {
          if (todo.completedDate) {
            const completedDate = new Date(todo.completedDate)
            const completedDateOnly = new Date(completedDate.getFullYear(), completedDate.getMonth(), completedDate.getDate())
            if (completedDateOnly.getTime() === todayDate.getTime()) {
              idsToDelete.add(todo.id)
            }
          } else if (dueDate.getTime() === todayDate.getTime()) {
            idsToDelete.add(todo.id)
          }
        } else if (dueDate.getTime() === todayDate.getTime()) {
          idsToDelete.add(todo.id)
        }
      })
    } else if (filterMode === 'past') {
      todos.forEach(todo => {
        if (!todo.dueTime) return
        const due = new Date(todo.dueTime)
        const dueDate = new Date(due.getFullYear(), due.getMonth(), due.getDate())
        const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        if (todo.completed) {
          if (todo.completedDate) {
            const completedDate = new Date(todo.completedDate)
            const completedDateOnly = new Date(completedDate.getFullYear(), completedDate.getMonth(), completedDate.getDate())
            if (completedDateOnly.getTime() !== todayDate.getTime()) {
              idsToDelete.add(todo.id)
            }
          }
        } else if (dueDate < todayDate) {
          idsToDelete.add(todo.id)
        }
      })
    } else { // future
      todos.forEach(todo => {
        if (todo.completed) return
        if (!todo.dueTime) return
        const due = new Date(todo.dueTime)
        if (due > todayEnd) {
          idsToDelete.add(todo.id)
        }
      })
    }

    idsToDelete.forEach(id => deleteTodo(id))
  }

  useEffect(() => {
    const payload = todos.map(t => ({
      ...t,
      notify: t.notify !== false,
      dueTime: t.dueTime ? new Date(t.dueTime).toISOString() : null,
    }))
    window.todio?.send('update-notification-schedule', {
      enabled: notificationsEnabled,
      todos: payload,
    })
  }, [todos, notificationsEnabled])

  const closeApp = () => {
    // Prevent closing if settings button was just clicked
    if (isSettingsClickRef.current) {
      return
    }
    window.todio?.send('close-to-tray')
  }
  const minimizeApp = () => {
    window.todio?.send('minimize-window')
  }

  const togglePin = () => {
    setIsPinned(!isPinned);
    window.todio?.send('toggle-always-on-top', !isPinned)
  }

  const handleUpdate = () => {
    window.todio?.send('open-release-page')
    setUpdateInfo(null);
  }

  const closeUpdate = () => setUpdateInfo(null)
  const closeWelcome = () => setShowWelcome(false)

  const toggleAutoStart = async () => {
    const newValue = await window.todio?.invoke('set-auto-launch', !autoStart)
    if (typeof newValue === 'boolean') {
      setAutoStart(newValue)
    }
  }

  return (
    <div className="h-screen w-screen min-w-[260px] min-h-[360px] bg-transparent flex flex-col app-no-drag relative">
      {/* Main Container */}
      <div
        className="relative flex-1 w-full rounded-[28px] overflow-hidden flex flex-col transition-colors duration-200 backdrop-blur-3xl text-[color:var(--app-text-main)]"
        style={{
          backgroundColor: `rgba(var(--app-bg-rgb), ${Math.min(1, Math.max(0, Number.isFinite(backgroundOpacity) ? backgroundOpacity : 1))})`
        }}
      >

        {/* Window Controls */}
        <div className="flex items-center justify-between px-4 py-3 relative z-50 app-drag-region">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 app-no-drag"
          >
            <AppIcon />
            <span className="text-xs font-bold text-[color:var(--app-text-main)] tracking-wide">Todio</span>
            <span className="text-[8px] font-black text-[color:var(--app-text-muted)] tracking-wider">{VERSION}</span>
          </motion.div>


          {/* Gesture Button (Drag Handle) - Horizontal Bar */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-[50] w-1/3 flex justify-center app-no-drag pt-2">
            <div
              className="w-full h-1.5 rounded-full bg-gray-200/50 hover:bg-gray-300/80 active:bg-gray-400/80 backdrop-blur-sm transition-colors duration-200 cursor-grab active:cursor-grabbing"
              onMouseDown={(e) => handleResizeStart(e, 'move')}
              aria-label={language === 'en' ? 'Drag window' : '拖拽移动'}
              title={language === 'en' ? 'Drag to move' : '按住拖动移动'}
            />
          </div>

          <div className="flex items-center gap-1.5 app-no-drag">
            {/* Opacity Control */}
            <div
              className="relative app-no-drag"
              ref={opacityRef}
              onClick={(e) => {
                e.stopPropagation()
              }}
              onMouseDown={(e) => {
                e.stopPropagation()
              }}
            >
              <motion.button
                ref={settingsButtonRef}
                type="button"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
                    e.nativeEvent.stopImmediatePropagation()
                  }
                  // Mark that this is a settings button click to prevent window close
                  isSettingsClickRef.current = true
                  setTimeout(() => {
                    isSettingsClickRef.current = false
                  }, 1000)
                  setShowOpacityControl(prev => !prev)
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
                    e.nativeEvent.stopImmediatePropagation()
                  }
                }}
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer app-no-drag ${showOpacityControl ? 'bg-[color:var(--app-primary-soft)] text-[color:var(--app-primary)]' : 'hover:bg-[color:var(--app-highlight)] text-[color:var(--app-text-muted)]'
                  }`}
              >
                <Settings size={11} strokeWidth={3} />
              </motion.button>

              <AnimatePresence>
                {showOpacityControl && (
                  <SettingsPanelContent
                    ref={settingsPanelRef}
                    buttonRef={settingsButtonRef}
                    language={language}
                    setLanguage={setLanguage}
                    theme={theme}
                    setTheme={setTheme}
                    backgroundOpacity={backgroundOpacity}
                    setBackgroundOpacity={setBackgroundOpacity}
                    autoStart={autoStart}
                    toggleAutoStart={toggleAutoStart}
                    notificationsEnabled={notificationsEnabled}
                    toggleNotificationsEnabled={() => {
                      const next = !notificationsEnabled
                      setNotificationsEnabled(next)
                      localStorage.setItem(NOTIFICATIONS_ENABLED_KEY, String(next))
                    }}
                    onClose={() => setShowOpacityControl(false)}
                    t={t}
                    VERSION={VERSION}
                    setShowVersionToast={setShowVersionToast}
                    setUpdateInfo={setUpdateInfo}
                  />
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              onClick={togglePin}
              title={language === 'en' ? 'Pin' : '置顶'}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${isPinned ? 'bg-[color:var(--app-primary-soft)] text-[color:var(--app-primary)]' : 'hover:bg-[color:var(--app-highlight)] text-[color:var(--app-text-muted)]'
                }`}
            >
              <Pin size={10} fill={isPinned ? 'currentColor' : 'none'} strokeWidth={3} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              onClick={minimizeApp}
              className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-[color:var(--app-highlight)] text-[color:var(--app-text-muted)] transition-all duration-300 cursor-pointer ml-1"
            >
              <Minus size={10} strokeWidth={3} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.15, backgroundColor: 'rgba(255,107,107,0.1)' }}
              whileTap={{ scale: 0.85 }}
              onClick={closeApp}
              className="w-6 h-6 rounded-full flex items-center justify-center hover:text-red-400 text-[color:var(--app-text-muted)] transition-all duration-300 cursor-pointer"
            >
              <X size={10} strokeWidth={3} />
            </motion.button>
          </div>
        </div>

        {/* Welcome Notification */}
        <AnimatePresence>
          {showWelcome && !updateInfo && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: 'auto', opacity: 1, marginBottom: 8 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              className="px-5 overflow-hidden flex-shrink-0 relative z-40"
            >
              <div className="bg-[color:var(--app-surface-2)] rounded-xl p-3 flex items-start gap-3 border border-[color:var(--app-primary-soft)] shadow-theme relative overflow-hidden">
                {/* Sparkle decoration */}
                <div className="absolute top-0 right-0 p-2 text-[color:var(--app-primary)] opacity-10 transform translate-x-1/3 -translate-y-1/3">
                  <Sparkles size={80} strokeWidth={1} />
                </div>

                <div className="p-1.5 bg-theme-primary rounded-lg text-white mt-0.5 shadow-sm z-10">
                  <Sparkles size={14} />
                </div>
                <div className="flex-1 min-w-0 z-10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[color:var(--app-text-main)] tracking-tight">{t.welcome} {VERSION}!</span>
                    <button onClick={closeWelcome} className="text-[color:var(--app-text-muted)] hover:text-[color:var(--app-text-main)] transition-colors p-0.5 hover:bg-[color:var(--app-highlight)] rounded-full">
                      <X size={12} />
                    </button>
                  </div>
                  <p className="text-[10px] text-[color:var(--app-text-sub)] leading-relaxed font-medium">
                    {t.welcomeFeatures}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Update Notification */}
        <AnimatePresence>
          {updateInfo && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: 'auto', opacity: 1, marginBottom: 8 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              className="px-5 overflow-hidden flex-shrink-0 relative z-40"
            >
              <div className="bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 rounded-2xl p-4 shadow-xl border border-white/20 mb-2 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-2xl"></div>
                </div>

                <div className="relative z-10 flex items-start gap-4">
                  {/* Update Icon */}
                  <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg flex-shrink-0">
                    <Bell size={20} className="text-white drop-shadow-sm" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-white drop-shadow-sm">
                        {language === 'en' ? 'New version' : '新版本'} {updateInfo.latestVersion} {language === 'en' ? 'available' : '可用'}
                      </span>
                      <button
                        onClick={closeUpdate}
                        className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/20 rounded-full"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <p className="text-xs text-white/90 mb-3 leading-relaxed drop-shadow-sm">
                      {language === 'en' ? 'Bug fixes & new dark mode' : '错误修复和新深色模式'}
                    </p>
                    <button
                      onClick={handleUpdate}
                      className="w-full bg-white hover:bg-white/90 text-blue-600 text-sm font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                      <span>{language === 'en' ? 'Update Now' : '立即更新'}</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-hidden px-3 pb-2.5 relative z-30 flex flex-col min-h-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col flex-1 min-h-0"
          >
            {/* Common Header with View Mode Toggle */}
            <header className="flex items-center justify-between mb-1.5 flex-shrink-0 sticky top-0 z-40 py-2 -mx-3 px-3 transition-colors duration-200"
              style={{ backgroundColor: 'var(--app-header-bg, transparent)' }}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h1 className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                    {viewMode === 'focus' ? t.todayTasks : (language === 'zh' ? '日历' : 'Calendar')}
                  </h1>
                  {viewMode === 'focus' && (
                    <motion.div
                      key={(() => {
                        const now = new Date()
                        now.setHours(0, 0, 0, 0)
                        const todayEnd = new Date(now)
                        todayEnd.setHours(23, 59, 59, 999)
                        return todos.filter(todo => {
                          if (todo.completed) return false
                          if (!todo.dueTime) return false
                          const due = new Date(todo.dueTime)
                          return due >= now && due <= todayEnd
                        }).length
                      })()}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-primary/10 border border-primary/20 text-primary px-1 py-0.5 rounded-full text-[8px] font-bold flex-shrink-0"
                    >
                      {(() => {
                        const now = new Date()
                        now.setHours(0, 0, 0, 0)
                        const todayEnd = new Date(now)
                        todayEnd.setHours(23, 59, 59, 999)
                        const count = todos.filter(todo => {
                          if (todo.completed) return false
                          if (!todo.dueTime) return false
                          const due = new Date(todo.dueTime)
                          return due >= now && due <= todayEnd
                        }).length
                        return `${count}${language === 'en' ? ' Left' : '项待办'}`
                      })()}
                    </motion.div>
                  )}
                </div>
                {viewMode === 'focus' && (
                  <motion.p
                    key={(() => {
                      const now = new Date()
                      now.setHours(0, 0, 0, 0)
                      const todayEnd = new Date(now)
                      todayEnd.setHours(23, 59, 59, 999)
                      return todos.filter(todo => {
                        if (todo.completed) return false
                        if (!todo.dueTime) return false
                        const due = new Date(todo.dueTime)
                        return due >= now && due <= todayEnd
                      }).length
                    })()}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-neu-muted/60 text-[8px] font-medium tracking-wide"
                  >
                    {language === 'en' ? 'Keep up the momentum!' : '保持动力！'}
                  </motion.p>
                )}
              </div>
              {/* View Mode Toggle - Moved to Header Right */}
              <div className="flex items-center bg-[color:var(--app-surface-hover)] border border-[color:var(--app-border)] rounded-full p-0.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('focus')}
                  className={`px-2.5 py-1 rounded-full text-[9px] font-bold transition-all ${viewMode === 'focus'
                    ? 'bg-[color:var(--app-primary-soft)] text-[color:var(--app-primary)] shadow-sm'
                    : 'text-[color:var(--app-text-muted)] hover:text-[color:var(--app-text-main)] hover:bg-[color:var(--app-surface-hover)]'
                    }`}
                >
                  {t.focusMode}
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('calendar')}
                  className={`px-2.5 py-1 rounded-full text-[9px] font-bold transition-all ${viewMode === 'calendar'
                    ? 'bg-[color:var(--app-primary-soft)] text-[color:var(--app-primary)] shadow-sm'
                    : 'text-[color:var(--app-text-muted)] hover:text-[color:var(--app-text-main)] hover:bg-[color:var(--app-surface-hover)]'
                    }`}
                >
                  {t.calendarMode}
                </button>
              </div>
            </header>

            {viewMode === 'focus' ? (
              <>

                {/* Input & List - Flex Layout */}
                <div className="flex flex-col flex-1 min-h-0 space-y-1.5">
                  <TodoInput onAddWithDetails={addTodoWithDetails} language={language} />

                  {/* Filter Buttons */}
                  <div className="flex gap-1.5 px-1 justify-between items-center">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setFilterMode('today')}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-semibold transition-all whitespace-nowrap ${filterMode === 'today'
                          ? 'bg-[color:var(--app-primary-soft)] text-[color:var(--app-primary)] shadow-sm'
                          : 'bg-[color:var(--app-surface)] text-[color:var(--app-text-sub)] hover:bg-[color:var(--app-surface-hover)] border border-[color:var(--app-border)]'
                          }`}
                      >
                        {language === 'en' ? 'Today' : '今日'}
                      </button>
                      <button
                        onClick={() => setFilterMode('past')}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-semibold transition-all whitespace-nowrap ${filterMode === 'past'
                          ? 'bg-[color:var(--app-primary-soft)] text-[color:var(--app-primary)] shadow-sm'
                          : 'bg-[color:var(--app-surface)] text-[color:var(--app-text-sub)] hover:bg-[color:var(--app-surface-hover)] border border-[color:var(--app-border)]'
                          }`}
                      >
                        {language === 'en' ? 'Past' : '过去'}
                      </button>
                      <button
                        onClick={() => setFilterMode('future')}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-semibold transition-all whitespace-nowrap ${filterMode === 'future'
                          ? 'bg-[color:var(--app-primary-soft)] text-[color:var(--app-primary)] shadow-sm'
                          : 'bg-[color:var(--app-surface)] text-[color:var(--app-text-sub)] hover:bg-[color:var(--app-surface-hover)] border border-[color:var(--app-border)]'
                          }`}
                      >
                        {language === 'en' ? 'Future' : '未来'}
                      </button>
                    </div>
                    {/* More Options */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowMoreMenu(!showMoreMenu)
                        }}
                        className="px-3 py-1.5 rounded-lg text-[9px] font-semibold transition-all whitespace-nowrap bg-white/20 dark:bg-black/10 text-[color:var(--app-text-sub)] hover:bg-white/25 dark:hover:bg-black/15 backdrop-blur-md flex items-center gap-1"
                      >
                        <MoreHorizontal size={12} />
                        {language === 'en' ? 'More' : '更多'}
                      </button>
                      <AnimatePresence>
                        {showMoreMenu && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -5 }}
                            className="absolute right-0 top-full mt-1 bg-white/20 dark:bg-black/10 backdrop-blur-xl rounded-lg shadow-lg border border-[color:var(--app-border)] py-1 min-w-[120px] z-50"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setShowMoreMenu(false)
                                // 获取当前筛选模式下的所有任务ID
                                const now = new Date()
                                now.setHours(0, 0, 0, 0)
                                const todayEnd = new Date(now)
                                todayEnd.setHours(23, 59, 59, 999)

                                let filtered: Todo[] = []
                                if (filterMode === 'today') {
                                  filtered = todos.filter(todo => {
                                    if (!todo.dueTime) return false
                                    const due = new Date(todo.dueTime)
                                    const dueDate = new Date(due.getFullYear(), due.getMonth(), due.getDate())
                                    const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                                    if (todo.completed) {
                                      if (todo.completedDate) {
                                        const completedDate = new Date(todo.completedDate)
                                        const completedDateOnly = new Date(completedDate.getFullYear(), completedDate.getMonth(), completedDate.getDate())
                                        return completedDateOnly.getTime() === todayDate.getTime()
                                      }
                                      return dueDate.getTime() === todayDate.getTime()
                                    }
                                    return dueDate.getTime() === todayDate.getTime()
                                  })
                                } else if (filterMode === 'past') {
                                  filtered = todos.filter(todo => {
                                    if (!todo.dueTime) return false
                                    const due = new Date(todo.dueTime)
                                    const dueDate = new Date(due.getFullYear(), due.getMonth(), due.getDate())
                                    const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                                    if (todo.completed) {
                                      if (todo.completedDate) {
                                        const completedDate = new Date(todo.completedDate)
                                        const completedDateOnly = new Date(completedDate.getFullYear(), completedDate.getMonth(), completedDate.getDate())
                                        return completedDateOnly.getTime() !== todayDate.getTime()
                                      }
                                      return false
                                    }
                                    return dueDate < todayDate
                                  })
                                } else {
                                  filtered = todos.filter(todo => {
                                    if (todo.completed) return false
                                    if (!todo.dueTime) return false
                                    const due = new Date(todo.dueTime)
                                    return due > todayEnd
                                  })
                                }
                                setPendingClearIds(new Set(filtered.map(t => t.id)))
                                setShowClearConfirm(true)
                              }}
                              className="w-full px-3 py-2 text-left text-[10px] font-medium text-[color:var(--app-text-sub)] hover:bg-[color:var(--app-surface-hover)] transition-colors border-b border-[color:var(--app-divider)]"
                            >
                              {language === 'en' ? 'Clear All' : '清空全部'}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setShowMoreMenu(false)
                                setShowDeleteSelect(true)
                                setSelectedDeleteIds(new Set())
                              }}
                              className="w-full px-3 py-2 text-left text-[10px] font-medium text-red-500 hover:bg-red-500/10 transition-colors border-b border-[color:var(--app-divider)]"
                            >
                              {language === 'en' ? 'Delete Task' : '删除任务'}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setShowMoreMenu(false)
                                setTempHasCustomOrder(hasCustomOrder) // 保存当前状态到临时变量
                                setShowSortMenu(true)
                              }}
                              className="w-full px-3 py-2 text-left text-[10px] font-medium text-[color:var(--app-text-sub)] hover:bg-[color:var(--app-surface-hover)] transition-colors flex items-center gap-2"
                            >
                              <ArrowUpDown size={12} />
                              {language === 'en' ? 'Sort' : '排序'}
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <AnimatePresence mode="popLayout" initial={false}>
                    {(() => {
                      const hasNoTasks = todos.length === 0

                      if (hasNoTasks) {
                        return (
                          <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-center py-3 overflow-hidden flex flex-col items-center justify-center flex-1 min-h-0"
                          >
                            <motion.h2
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.1 }}
                              className="text-base font-bold text-[color:var(--app-text-main)] mb-0.5 tracking-tight"
                            >
                              {language === 'en' ? 'All caught up!' : '已完成！'}
                            </motion.h2>
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.15 }}
                              className="text-[color:var(--app-text-muted)] font-medium text-[10px] mb-2 leading-relaxed"
                            >
                              {language === 'en' ? 'You have no pending tasks. Enjoy your day!' : '您没有待办任务。享受您的一天！'}
                            </motion.p>
                            <motion.button
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setFilterMode('future')}
                              className="px-3 py-1 rounded-full bg-[color:var(--app-surface)] hover:bg-[color:var(--app-surface-hover)] text-primary font-semibold text-[9px] shadow-[0_4px_12px_-2px_rgba(139,92,246,0.15)] hover:shadow-[0_6px_16px_-2px_rgba(139,92,246,0.2)] active:scale-95 transition-all border border-[color:var(--app-border)] flex items-center gap-1 backdrop-blur-sm"
                            >
                              <Calendar size={10} />
                              {language === 'en' ? 'See Tomorrow' : '查看明天'}
                            </motion.button>
                          </motion.div>
                        )
                      }
                      return null
                    })()}
                    {(() => {
                      const hasNoTasks = todos.length === 0

                      if (!hasNoTasks) {
                        return (
                          <motion.div
                            key="list"
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="flex-1 min-h-0 overflow-hidden"
                          >
                            <div className="h-full overflow-y-auto [scrollbar-gutter:stable] pr-1">
                              <TodoList
                                todos={(() => {
                                  const now = new Date()
                                  now.setHours(0, 0, 0, 0)
                                  const todayEnd = new Date(now)
                                  todayEnd.setHours(23, 59, 59, 999)

                                  let filtered: Todo[] = []

                                  if (filterMode === 'today') {
                                    filtered = todos.filter(todo => {
                                      if (!todo.dueTime) return false
                                      const due = new Date(todo.dueTime)
                                      const dueDate = new Date(due.getFullYear(), due.getMonth(), due.getDate())
                                      const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())

                                      if (todo.completed) {
                                        if (todo.completedDate) {
                                          const completedDate = new Date(todo.completedDate)
                                          const completedDateOnly = new Date(completedDate.getFullYear(), completedDate.getMonth(), completedDate.getDate())
                                          return completedDateOnly.getTime() === todayDate.getTime()
                                        }
                                        return dueDate.getTime() === todayDate.getTime()
                                      }
                                      return dueDate.getTime() === todayDate.getTime()
                                    })
                                  } else if (filterMode === 'past') {
                                    filtered = todos.filter(todo => {
                                      if (!todo.dueTime) return false
                                      const due = new Date(todo.dueTime)
                                      const dueDate = new Date(due.getFullYear(), due.getMonth(), due.getDate())
                                      const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())

                                      if (todo.completed) {
                                        if (todo.completedDate) {
                                          const completedDate = new Date(todo.completedDate)
                                          const completedDateOnly = new Date(completedDate.getFullYear(), completedDate.getMonth(), completedDate.getDate())
                                          return completedDateOnly.getTime() !== todayDate.getTime()
                                        }
                                        return false
                                      }
                                      return dueDate < todayDate
                                    })

                                    // 按完成时间排序：最新完成的在最上面
                                    filtered = filtered.sort((a, b) => {
                                      const aDate = a.completedDate ? new Date(a.completedDate).getTime() : (a.dueTime ? new Date(a.dueTime).getTime() : 0)
                                      const bDate = b.completedDate ? new Date(b.completedDate).getTime() : (b.dueTime ? new Date(b.dueTime).getTime() : 0)
                                      return bDate - aDate
                                    })
                                  } else {
                                    filtered = todos.filter(todo => {
                                      if (todo.completed) return false
                                      if (!todo.dueTime) return false
                                      const due = new Date(todo.dueTime)
                                      return due > todayEnd
                                    })

                                    // 排序：明天的在上面，未来的在下面
                                    const tomorrow = new Date(now)
                                    tomorrow.setDate(tomorrow.getDate() + 1)
                                    const tomorrowEnd = new Date(tomorrow)
                                    tomorrowEnd.setHours(23, 59, 59, 999)

                                    filtered = filtered.sort((a, b) => {
                                      const aDue = new Date(a.dueTime!)
                                      const bDue = new Date(b.dueTime!)
                                      const aIsTomorrow = aDue >= tomorrow && aDue <= tomorrowEnd
                                      const bIsTomorrow = bDue >= tomorrow && bDue <= tomorrowEnd

                                      if (aIsTomorrow && !bIsTomorrow) return -1
                                      if (!aIsTomorrow && bIsTomorrow) return 1
                                      return aDue.getTime() - bDue.getTime()
                                    })
                                  }

                                  // 如果用户已自主排序，不应用排序选项
                                  if (!hasCustomOrder) {
                                    // 应用排序选项
                                    if (sortOptions.time) {
                                      filtered = filtered.sort((a, b) => {
                                        const aTime = a.dueTime ? new Date(a.dueTime).getTime() : 0
                                        const bTime = b.dueTime ? new Date(b.dueTime).getTime() : 0
                                        return sortOptions.time === 'asc' ? aTime - bTime : bTime - aTime
                                      })
                                    }

                                    if (sortOptions.priority) {
                                      const priorityOrder = { low: 1, medium: 2, high: 3 }
                                      filtered = filtered.sort((a, b) => {
                                        const aPriority = priorityOrder[a.priority || 'medium']
                                        const bPriority = priorityOrder[b.priority || 'medium']
                                        return sortOptions.priority === 'asc' ? aPriority - bPriority : bPriority - aPriority
                                      })
                                    }
                                  }

                                  // 状态筛选：如果两个都选或都不选，显示全部；如果只选一个，只显示对应的
                                  const hasCompleted = sortOptions.completed === true
                                  const hasUncompleted = sortOptions.uncompleted === true

                                  if (hasCompleted && !hasUncompleted) {
                                    // 只选已完成
                                    filtered = filtered.filter(t => t.completed)
                                  } else if (!hasCompleted && hasUncompleted) {
                                    // 只选未完成
                                    filtered = filtered.filter(t => !t.completed)
                                  }
                                  // 如果两个都选或都不选，不筛选（显示全部）

                                  return filtered
                                })()}
                                onToggle={toggleTodo}
                                onDelete={deleteTodo}
                                onRename={renameTodo}
                                onUpdateDetails={updateDetails}
                                onUpdateDue={updateDue}
                                onReorder={reorderTodos}
                                language={language}
                                pendingTodoId={pendingTodoId}
                                onPendingComplete={() => {
                                  setPendingTodoId(null)
                                  setPendingTodoText(null)
                                }}
                                filterMode={filterMode}
                              />
                            </div>
                          </motion.div>
                        )
                      }
                      return null
                    })()}
                    {(() => {
                      // 如果今日模式下所有任务都完成了，在列表下方显示"查看明天"按钮
                      if (filterMode === 'today') {
                        const now = new Date()
                        now.setHours(0, 0, 0, 0)
                        const todayTasks = todos.filter(todo => {
                          if (!todo.dueTime) return false
                          const due = new Date(todo.dueTime)
                          const dueDate = new Date(due.getFullYear(), due.getMonth(), due.getDate())
                          const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                          if (todo.completed) {
                            if (todo.completedDate) {
                              const completedDate = new Date(todo.completedDate)
                              const completedDateOnly = new Date(completedDate.getFullYear(), completedDate.getMonth(), completedDate.getDate())
                              return completedDateOnly.getTime() === todayDate.getTime()
                            }
                            return dueDate.getTime() === todayDate.getTime()
                          }
                          return dueDate.getTime() === todayDate.getTime()
                        })
                        const allTodayCompleted = todayTasks.length > 0 && todayTasks.every(t => t.completed)

                        if (allTodayCompleted) {
                          return (
                            <motion.div
                              key="see-tomorrow"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ duration: 0.2 }}
                              className="pt-3 pb-2 flex justify-center"
                            >
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setFilterMode('future')}
                                className="px-3 py-1.5 rounded-full bg-[color:var(--app-surface)] hover:bg-[color:var(--app-surface-hover)] text-primary font-semibold text-[9px] shadow-[0_4px_12px_-2px_rgba(139,92,246,0.15)] hover:shadow-[0_6px_16px_-2px_rgba(139,92,246,0.2)] active:scale-95 transition-all border border-[color:var(--app-border)] flex items-center gap-1 backdrop-blur-sm"
                              >
                                <Calendar size={10} />
                                {language === 'en' ? 'See Tomorrow' : '查看明天'}
                              </motion.button>
                            </motion.div>
                          )
                        }
                      }
                      return null
                    })()}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <CalendarView
                todos={todos}
                language={language}
                onSelectDate={(date) => {
                  setSelectedCalendarDate(date);
                }}
              />
            )}
          </motion.div>
        </div>

        {/* Resize Handles Moved to Root Level */}
        {/* New Task Details Modal */}
        <AnimatePresence>
          {pendingTodoText && !pendingTodoId && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
              onClick={() => {
                setPendingTodoText(null)
                setNewTaskDetails('')
                setNewTaskDate('')
                setNewTaskHour('')
                setNewTaskMinute('')
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-xs bg-[color:var(--app-surface)]/95 backdrop-blur-3xl rounded-2xl shadow-2xl border border-[color:var(--app-border)] overflow-hidden flex flex-col text-[color:var(--app-text-main)] max-h-[90vh]"
              >
                {/* Header */}
                <div className="px-4 py-3 flex justify-between items-center border-b border-[color:var(--app-border)]">
                  <h1 className="text-sm font-semibold text-[color:var(--app-text-main)]">
                    {language === 'en' ? 'Add Task Details' : '添加任务详情'}
                  </h1>
                  <button
                    onClick={() => {
                      setPendingTodoText(null)
                      setNewTaskDetails('')
                      setNewTaskDate('')
                      setNewTaskHour('')
                      setNewTaskMinute('')
                    }}
                    className="p-1 rounded-lg hover:bg-[color:var(--app-highlight)] transition-colors text-[color:var(--app-text-muted)]"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="p-4 space-y-3 overflow-y-auto flex-1 min-h-0">
                  {/* Task Title (Read-only) */}
                  <div>
                    <label className="block text-[10px] font-semibold text-[color:var(--app-text-muted)] mb-1.5 uppercase">
                      {language === 'en' ? 'Task Title' : '任务标题'}
                    </label>
                    <div className="px-3 py-2 bg-[color:var(--app-surface-hover)] rounded-lg border border-[color:var(--app-border)] text-xs font-medium text-[color:var(--app-text-main)]">
                      {pendingTodoText}
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-[10px] font-semibold text-[color:var(--app-text-muted)] mb-1.5 uppercase">
                      {language === 'en' ? 'Priority' : '优先级'}
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setNewTaskPriority('low')}
                        className={`flex-1 px-3 py-2 rounded-lg font-semibold text-[10px] transition-all flex items-center justify-center gap-1.5 ${(newTaskPriority || 'medium') === 'low'
                          ? 'bg-gray-500 text-white shadow-md'
                          : 'bg-[color:var(--app-surface-hover)] text-[color:var(--app-text-sub)] hover:bg-[color:var(--app-highlight)]'
                          }`}
                      >
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                        {language === 'en' ? 'Low' : '低'}
                      </button>
                      <button
                        onClick={() => setNewTaskPriority('medium')}
                        className={`flex-1 px-3 py-2 rounded-lg font-semibold text-[10px] transition-all flex items-center justify-center gap-1.5 ${(newTaskPriority || 'medium') === 'medium'
                          ? 'bg-yellow-500 text-white shadow-md'
                          : 'bg-[color:var(--app-surface-hover)] text-[color:var(--app-text-sub)] hover:bg-[color:var(--app-highlight)]'
                          }`}
                      >
                        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                        {language === 'en' ? 'Medium' : '中'}
                      </button>
                      <button
                        onClick={() => setNewTaskPriority('high')}
                        className={`flex-1 px-3 py-2 rounded-lg font-semibold text-[10px] transition-all flex items-center justify-center gap-1.5 ${(newTaskPriority || 'medium') === 'high'
                          ? 'bg-red-500 text-white shadow-md'
                          : 'bg-[color:var(--app-surface-hover)] text-[color:var(--app-text-sub)] hover:bg-[color:var(--app-highlight)]'
                          }`}
                      >
                        <div className="w-2 h-2 rounded-full bg-red-400"></div>
                        {language === 'en' ? 'High' : '高'}
                      </button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-[10px] font-semibold text-[color:var(--app-text-muted)] mb-1.5 uppercase">
                      {language === 'en' ? 'Notes' : '备注内容'}
                    </label>
                    <textarea
                      value={newTaskDetails}
                      onChange={(e) => setNewTaskDetails(e.target.value)}
                      placeholder={language === 'en' ? 'Add task notes...' : '添加任务备注...'}
                      className="w-full px-3 py-2 rounded-lg bg-[color:var(--app-surface-hover)] border border-[color:var(--app-border)] text-xs text-[color:var(--app-text-main)] placeholder-[color:var(--app-text-muted)] focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 focus:outline-none resize-none transition-all"
                      rows={2}
                    />
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
                            setNewTaskDate(formatDateLocal(today))
                          }}
                          className={`flex-1 px-2 py-1.5 rounded-lg font-semibold text-[10px] transition-all ${!newTaskDate || newTaskDate === formatDateLocal(new Date())
                            ? 'bg-violet-600 text-white shadow-md shadow-violet-500/30'
                            : 'bg-[color:var(--app-surface-hover)] text-[color:var(--app-text-sub)] hover:bg-[color:var(--app-highlight)]'
                            }`}
                        >
                          {language === 'en' ? 'Today' : '今天'}
                        </button>
                        <button
                          onClick={() => {
                            const tomorrow = new Date()
                            tomorrow.setDate(tomorrow.getDate() + 1)
                            setNewTaskDate(formatDateLocal(tomorrow))
                          }}
                          className={`flex-1 px-2 py-1.5 rounded-lg font-semibold text-[10px] transition-all ${newTaskDate === formatDateLocal((() => {
                            const t = new Date()
                            t.setDate(t.getDate() + 1)
                            return t
                          })())
                            ? 'bg-violet-600 text-white shadow-md shadow-violet-500/30'
                            : 'bg-[color:var(--app-surface-hover)] text-[color:var(--app-text-sub)] hover:bg-[color:var(--app-highlight)]'
                            }`}
                        >
                          {language === 'en' ? 'Tomorrow' : '明天'}
                        </button>
                        <input
                          type="date"
                          value={newTaskDate || formatDateLocal(new Date())}
                          onChange={(e) => setNewTaskDate(e.target.value)}
                          className="flex-1 px-2 py-1.5 rounded-lg font-semibold text-[10px] bg-[color:var(--app-surface-hover)] text-[color:var(--app-text-main)] border border-[color:var(--app-border)] focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
                        />
                      </div>

                      {/* Time Selector */}
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="23"
                          value={newTaskHour}
                          onChange={(e) => {
                            let val = parseInt(e.target.value) || 0
                            if (val < 0) val = 0
                            if (val > 23) val = 23
                            setNewTaskHour(val.toString().padStart(2, '0'))
                          }}
                          className="w-10 text-center text-sm font-bold text-[color:var(--app-text-main)] bg-[color:var(--app-surface-hover)] border border-[color:var(--app-border)] rounded-lg py-1 focus:ring-2 focus:ring-violet-500/50 focus:outline-none transition-all"
                        />
                        <span className="text-xs text-[color:var(--app-text-muted)]">:</span>
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={newTaskMinute}
                          onChange={(e) => {
                            let val = parseInt(e.target.value) || 0
                            if (val < 0) val = 0
                            if (val > 59) val = 59
                            setNewTaskMinute(val.toString().padStart(2, '0'))
                          }}
                          className="w-10 text-center text-sm font-bold text-[color:var(--app-text-main)] bg-[color:var(--app-surface-hover)] border border-[color:var(--app-border)] rounded-lg py-1 focus:ring-2 focus:ring-violet-500/50 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-4 py-3 border-t border-[color:var(--app-divider)] bg-[color:var(--app-surface-2)]">
                  <button
                    onClick={handleConfirmNewTask}
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 rounded-lg text-xs shadow-lg shadow-violet-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle size={14} />
                    <span>{language === 'en' ? 'Confirm' : '确认'}</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* New Task Create Modal (from Calendar) */}
        <AnimatePresence>
          {showNewTaskModal && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
              onClick={() => {
                setShowNewTaskModal(false)
                setNewTaskTitle('')
                setNewTaskDetails('')
                setNewTaskDate('')
                setNewTaskHour('')
                setNewTaskMinute('')
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-xs bg-[color:var(--app-surface)] backdrop-blur-xl rounded-2xl shadow-xl border border-[color:var(--app-border)] overflow-hidden max-h-[90vh] flex flex-col text-[color:var(--app-text-main)]"
              >
                {/* Header */}
                <div className="px-4 py-3 flex justify-between items-center border-b border-[color:var(--app-divider)] flex-shrink-0">
                  <h1 className="text-sm font-semibold text-[color:var(--app-text-main)]">
                    {language === 'en' ? 'New Task Details' : '新任务详情'}
                  </h1>
                  <button
                    onClick={() => {
                      setShowNewTaskModal(false)
                      setNewTaskTitle('')
                      setNewTaskDetails('')
                      setNewTaskDate('')
                      setNewTaskHour('')
                      setNewTaskMinute('')
                    }}
                    className="p-1 rounded-lg hover:bg-[color:var(--app-surface-hover)] transition-colors text-[color:var(--app-text-muted)]"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="p-4 space-y-3 overflow-y-auto flex-1 min-h-0">
                  {/* Task Title (Editable) */}
                  <div>
                    <label className="block text-[10px] font-semibold text-[color:var(--app-text-muted)] mb-1.5 uppercase">
                      {language === 'en' ? 'Task Title' : '任务标题'}
                    </label>
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder={language === 'en' ? 'Enter task title...' : '输入任务标题...'}
                      className="w-full px-3 py-2 bg-[color:var(--app-surface-hover)] rounded-lg border border-[color:var(--app-border)] text-xs font-medium text-[color:var(--app-text-main)] placeholder-[color:var(--app-text-muted)] focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 focus:outline-none transition-all"
                      autoFocus
                    />
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-[10px] font-semibold text-[color:var(--app-text-muted)] mb-1.5 uppercase">
                      {language === 'en' ? 'Priority' : '优先级'}
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setNewTaskPriority('low')}
                        className={`flex-1 px-3 py-2 rounded-lg font-semibold text-[10px] transition-all flex items-center justify-center gap-1.5 ${newTaskPriority === 'low'
                          ? 'bg-gray-500 text-white shadow-md'
                          : 'bg-[color:var(--app-surface-hover)] text-[color:var(--app-text-sub)] hover:bg-[color:var(--app-highlight)]'
                          }`}
                      >
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                        {language === 'en' ? 'Low' : '低'}
                      </button>
                      <button
                        onClick={() => setNewTaskPriority('medium')}
                        className={`flex-1 px-3 py-2 rounded-lg font-semibold text-[10px] transition-all flex items-center justify-center gap-1.5 ${newTaskPriority === 'medium'
                          ? 'bg-yellow-500 text-white shadow-md'
                          : 'bg-[color:var(--app-surface-hover)] text-[color:var(--app-text-sub)] hover:bg-[color:var(--app-highlight)]'
                          }`}
                      >
                        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                        {language === 'en' ? 'Medium' : '中'}
                      </button>
                      <button
                        onClick={() => setNewTaskPriority('high')}
                        className={`flex-1 px-3 py-2 rounded-lg font-semibold text-[10px] transition-all flex items-center justify-center gap-1.5 ${newTaskPriority === 'high'
                          ? 'bg-red-500 text-white shadow-md'
                          : 'bg-[color:var(--app-surface-hover)] text-[color:var(--app-text-sub)] hover:bg-[color:var(--app-highlight)]'
                          }`}
                      >
                        <div className="w-2 h-2 rounded-full bg-red-400"></div>
                        {language === 'en' ? 'High' : '高'}
                      </button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-[10px] font-semibold text-[color:var(--app-text-muted)] mb-1.5 uppercase">
                      {language === 'en' ? 'Notes' : '备注内容'}
                    </label>
                    <textarea
                      value={newTaskDetails}
                      onChange={(e) => setNewTaskDetails(e.target.value)}
                      placeholder={language === 'en' ? 'Add task notes...' : '添加任务备注...'}
                      className="w-full px-3 py-2 rounded-lg bg-[color:var(--app-surface-hover)] border border-[color:var(--app-border)] text-xs text-[color:var(--app-text-main)] placeholder-[color:var(--app-text-muted)] focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 focus:outline-none resize-none transition-all"
                      rows={2}
                    />
                  </div>

                  {/* Date & Time */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-semibold text-[color:var(--app-text-muted)] mb-1.5 uppercase">
                      {language === 'en' ? 'Date & Time' : '日期和时间'}
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex gap-1">
                        <button
                          onClick={() => {
                            const today = new Date()
                            setNewTaskDate(formatDateLocal(today))
                          }}
                          className={`flex-1 px-2 py-1.5 rounded-lg font-semibold text-[10px] transition-all ${!newTaskDate || newTaskDate === formatDateLocal(new Date())
                            ? 'bg-violet-600 text-white shadow-md shadow-violet-500/30'
                            : 'bg-[color:var(--app-surface-hover)] text-[color:var(--app-text-sub)] hover:bg-[color:var(--app-highlight)]'
                            }`}
                        >
                          {language === 'en' ? 'Today' : '今天'}
                        </button>
                        <button
                          onClick={() => {
                            const tomorrow = new Date()
                            tomorrow.setDate(tomorrow.getDate() + 1)
                            setNewTaskDate(formatDateLocal(tomorrow))
                          }}
                          className={`flex-1 px-2 py-1.5 rounded-lg font-semibold text-[10px] transition-all ${newTaskDate === formatDateLocal((() => {
                            const t = new Date()
                            t.setDate(t.getDate() + 1)
                            return t
                          })())
                            ? 'bg-violet-600 text-white shadow-md shadow-violet-500/30'
                            : 'bg-[color:var(--app-surface-hover)] text-[color:var(--app-text-sub)] hover:bg-[color:var(--app-highlight)]'
                            }`}
                        >
                          {language === 'en' ? 'Tomorrow' : '明天'}
                        </button>
                        <input
                          type="date"
                          value={newTaskDate || formatDateLocal(new Date())}
                          onChange={(e) => setNewTaskDate(e.target.value)}
                          className="flex-1 px-2 py-1.5 rounded-lg font-semibold text-[10px] bg-[color:var(--app-surface-hover)] text-[color:var(--app-text-main)] border border-[color:var(--app-border)] focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="23"
                          value={newTaskHour}
                          onChange={(e) => {
                            let val = parseInt(e.target.value) || 0
                            if (val < 0) val = 0
                            if (val > 23) val = 23
                            setNewTaskHour(val.toString().padStart(2, '0'))
                          }}
                          className="w-10 text-center text-sm font-bold text-[color:var(--app-text-main)] bg-[color:var(--app-surface-hover)] border border-[color:var(--app-border)] rounded-lg py-1 focus:ring-2 focus:ring-violet-500/50 focus:outline-none transition-all"
                        />
                        <span className="text-xs text-[color:var(--app-text-muted)]">:</span>
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={newTaskMinute}
                          onChange={(e) => {
                            let val = parseInt(e.target.value) || 0
                            if (val < 0) val = 0
                            if (val > 59) val = 59
                            setNewTaskMinute(val.toString().padStart(2, '0'))
                          }}
                          className="w-10 text-center text-sm font-bold text-[color:var(--app-text-main)] bg-[color:var(--app-surface-hover)] border border-[color:var(--app-border)] rounded-lg py-1 focus:ring-2 focus:ring-violet-500/50 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-4 py-3 border-t border-[color:var(--app-divider)] bg-[color:var(--app-surface-2)]">
                  <button
                    onClick={() => {
                      if (!newTaskTitle.trim()) return;
                      // 创建新任务
                      const dateStr = newTaskDate || formatDateLocal(new Date())
                      const hour = newTaskHour || '09'
                      const minute = newTaskMinute || '00'
                      const dueTime = new Date(`${dateStr}T${hour}:${minute}:00`)

                      const newTodo: Todo = {
                        id: Date.now().toString(),
                        text: newTaskTitle.trim(),
                        completed: false,
                        details: newTaskDetails || undefined,
                        dueTime,
                        priority: newTaskPriority,
                      }
                      setTodos(prev => [...prev, newTodo])

                      // 关闭弹窗并重置状态
                      setShowNewTaskModal(false)
                      setNewTaskTitle('')
                      setNewTaskDetails('')
                      setNewTaskDate('')
                      setNewTaskHour('')
                      setNewTaskMinute('')
                      setNewTaskPriority('medium')
                    }}
                    disabled={!newTaskTitle.trim()}
                    className={`w-full font-semibold py-2 rounded-lg text-xs shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 ${newTaskTitle.trim()
                      ? 'bg-violet-500 hover:bg-violet-600 text-white shadow-violet-500/30'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    <CheckCircle size={14} />
                    <span>{language === 'en' ? 'Confirm' : '确认'}</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Calendar Date Details Modal */}
        <AnimatePresence>
          {selectedCalendarDate && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
              onClick={() => setSelectedCalendarDate(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-xs bg-[color:var(--app-surface)] backdrop-blur-xl rounded-2xl shadow-xl border border-[color:var(--app-border)] overflow-hidden flex flex-col text-[color:var(--app-text-main)] max-h-[85vh]"
              >
                {/* Header */}
                <div className="px-4 py-3 flex justify-between items-center border-b border-[color:var(--app-divider)] bg-[color:var(--app-surface-hover)]">
                  <div>
                    <h1 className="text-sm font-bold text-[color:var(--app-text-main)]">
                      {selectedCalendarDate.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', {
                        month: 'long',
                        day: 'numeric',
                        weekday: 'short'
                      })}
                    </h1>
                    <p className="text-[10px] text-gray-500">
                      {(() => {
                        const dateKey = `${selectedCalendarDate.getFullYear()}-${selectedCalendarDate.getMonth()}-${selectedCalendarDate.getDate()}`;
                        const tasksForDate = todos.filter(todo => {
                          if (!todo.dueTime) return false;
                          const d = new Date(todo.dueTime);
                          return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}` === dateKey;
                        });
                        const uncompletedCount = tasksForDate.filter(t => !t.completed).length;
                        return language === 'zh'
                          ? `${uncompletedCount} 项待办`
                          : `${uncompletedCount} task${uncompletedCount !== 1 ? 's' : ''} remaining`;
                      })()}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedCalendarDate(null)}
                    className="p-1.5 rounded-lg hover:bg-[color:var(--app-surface-hover)] transition-colors text-[color:var(--app-text-muted)]"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Tasks List */}
                <div className="p-3 space-y-2 overflow-y-auto flex-1 min-h-0">
                  {(() => {
                    const dateKey = `${selectedCalendarDate.getFullYear()}-${selectedCalendarDate.getMonth()}-${selectedCalendarDate.getDate()}`;
                    const tasksForDate = todos.filter(todo => {
                      if (!todo.dueTime) return false;
                      const d = new Date(todo.dueTime);
                      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}` === dateKey;
                    }).slice(0, 8); // 最多显示8项

                    if (tasksForDate.length === 0) {
                      return (
                        <div className="flex flex-col items-center justify-center py-10">
                          <div className="w-16 h-16 rounded-full bg-[color:var(--app-surface-hover)] flex items-center justify-center mb-3 shadow-sm border border-[color:var(--app-border)]">
                            <Coffee size={28} strokeWidth={1.5} className="text-[color:var(--app-primary)] opacity-80" />
                          </div>
                          <p className="text-xs font-bold text-[color:var(--app-text-main)] mb-1">
                            {language === 'zh' ? '暂无待办事项' : 'No Tasks Scheduled'}
                          </p>
                          <p className="text-[10px] text-[color:var(--app-text-muted)] opacity-80">
                            {language === 'zh' ? '这一天很清闲，享受生活吧~' : 'Nothing planned for this day. Enjoy!'}
                          </p>
                        </div>
                      );
                    }

                    return tasksForDate.map(todo => (
                      <motion.div
                        key={todo.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex items-start gap-2 p-2.5 rounded-xl transition-all ${todo.completed
                          ? 'bg-[color:var(--app-surface-hover)] opacity-60'
                          : 'bg-[color:var(--app-surface)] hover:bg-[color:var(--app-surface-hover)] shadow-sm'
                          }`}
                      >
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleTodo(todo.id)}
                          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all mt-0.5 ${todo.completed
                            ? 'bg-violet-500 border-violet-500'
                            : 'border-[color:var(--app-border)] hover:border-violet-400'
                            }`}
                        >
                          {todo.completed && <Check size={12} className="text-white" />}
                        </button>

                        {/* Task Content */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium leading-tight ${todo.completed ? 'line-through text-[color:var(--app-text-muted)]' : 'text-[color:var(--app-text-main)]'
                            }`}>
                            {todo.text}
                          </p>
                          {todo.dueTime && (
                            <p className="text-[9px] text-gray-400 mt-0.5">
                              {new Date(todo.dueTime).toLocaleTimeString(language === 'zh' ? 'zh-CN' : 'en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          )}
                        </div>

                        {/* Priority Indicator */}
                        {todo.priority && todo.priority !== 'medium' && (
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${todo.priority === 'high' ? 'bg-red-400' : 'bg-gray-300'
                            }`} />
                        )}
                      </motion.div>
                    ));
                  })()}
                </div>

                {/* Add Task Button */}
                <div className="px-3 py-3 border-t border-[color:var(--app-divider)] bg-[color:var(--app-surface-hover)]">
                  <button
                    onClick={() => {
                      // 预设日期并打开任务详情编辑弹窗
                      const year = selectedCalendarDate.getFullYear();
                      const month = String(selectedCalendarDate.getMonth() + 1).padStart(2, '0');
                      const day = String(selectedCalendarDate.getDate()).padStart(2, '0');
                      setNewTaskDate(`${year}-${month}-${day}`);
                      // 预设当前时间
                      const now = new Date();
                      setNewTaskHour(now.getHours().toString().padStart(2, '0'));
                      setNewTaskMinute(now.getMinutes().toString().padStart(2, '0'));
                      setNewTaskTitle(''); // 清空标题
                      setNewTaskDetails(''); // 清空备注
                      setNewTaskPriority('medium'); // 重置优先级
                      setShowNewTaskModal(true); // 打开新任务弹窗
                      setSelectedCalendarDate(null);
                    }}
                    className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-semibold py-2.5 rounded-xl text-xs shadow-md shadow-violet-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                  >
                    <Calendar size={12} />
                    <span>{language === 'zh' ? '为此日添加任务' : 'Add task for this day'}</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Version Check Toast */}
        <AnimatePresence>
          {showVersionToast && (
            <motion.div
              initial={{ opacity: 0, x: 20, y: 0 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 20, transition: { duration: 0.3 } }}
              className="absolute bottom-5 right-5 z-[60] flex items-center gap-3 px-4 py-3 bg-[color:var(--app-surface)] backdrop-blur-xl border border-[color:var(--app-border)] rounded-2xl shadow-xl shadow-violet-500/10 overflow-hidden"
            >
              {/* Progress Bar (Purple Line Reducing) */}
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 3, ease: 'linear' }}
                className="absolute bottom-0 left-0 h-[2px] bg-violet-500"
              />

              <div className="p-1.5 bg-green-50 rounded-full text-green-500">
                <CircleCheck size={16} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[color:var(--app-text-main)]">{t.upToDate}</h3>
                <p className="text-[10px] text-[color:var(--app-text-muted)]">{t.latestVersion} {VERSION}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Clear All Selection Dialog */}
        <AnimatePresence>
          {showClearSelect && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
              onClick={() => {
                setShowClearSelect(false)
                setSelectedClearIds(new Set())
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm bg-[color:var(--app-surface)] backdrop-blur-xl rounded-2xl shadow-xl border border-[color:var(--app-border)] overflow-hidden max-h-[80vh] flex flex-col"
              >
                {/* Header */}
                <div className="px-4 py-3 flex justify-between items-center border-b border-[color:var(--app-divider)] flex-shrink-0">
                  <h1 className="text-sm font-semibold text-[color:var(--app-text-main)]">
                    {language === 'en' ? `Clear ${filterMode === 'today' ? 'Today' : filterMode === 'past' ? 'Past' : 'Future'} Tasks` : `清空${filterMode === 'today' ? '今日' : filterMode === 'past' ? '过去' : '未来'}任务`}
                  </h1>
                  <button
                    onClick={() => {
                      setShowClearSelect(false)
                      setSelectedClearIds(new Set())
                    }}
                    className="p-1 rounded-lg hover:bg-[color:var(--app-surface-hover)] transition-colors text-[color:var(--app-text-muted)]"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Task List */}
                <div className="p-4 space-y-2 overflow-y-auto flex-1 min-h-0">
                  {(() => {
                    const now = new Date()
                    now.setHours(0, 0, 0, 0)
                    const todayEnd = new Date(now)
                    todayEnd.setHours(23, 59, 59, 999)

                    let filtered: Todo[] = []
                    if (filterMode === 'today') {
                      filtered = todos.filter(todo => {
                        if (!todo.dueTime) return false
                        const due = new Date(todo.dueTime)
                        const dueDate = new Date(due.getFullYear(), due.getMonth(), due.getDate())
                        const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                        if (todo.completed) {
                          if (todo.completedDate) {
                            const completedDate = new Date(todo.completedDate)
                            const completedDateOnly = new Date(completedDate.getFullYear(), completedDate.getMonth(), completedDate.getDate())
                            return completedDateOnly.getTime() === todayDate.getTime()
                          }
                          return dueDate.getTime() === todayDate.getTime()
                        }
                        return dueDate.getTime() === todayDate.getTime()
                      })
                    } else if (filterMode === 'past') {
                      filtered = todos.filter(todo => {
                        if (!todo.dueTime) return false
                        const due = new Date(todo.dueTime)
                        const dueDate = new Date(due.getFullYear(), due.getMonth(), due.getDate())
                        const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                        if (todo.completed) {
                          if (todo.completedDate) {
                            const completedDate = new Date(todo.completedDate)
                            const completedDateOnly = new Date(completedDate.getFullYear(), completedDate.getMonth(), completedDate.getDate())
                            return completedDateOnly.getTime() !== todayDate.getTime()
                          }
                          return false
                        }
                        return dueDate < todayDate
                      })
                    } else {
                      filtered = todos.filter(todo => {
                        if (todo.completed) return false
                        if (!todo.dueTime) return false
                        const due = new Date(todo.dueTime)
                        return due > todayEnd
                      })
                    }

                    if (filtered.length === 0) {
                      return (
                        <div className="text-center py-8 text-[color:var(--app-text-muted)] text-xs">
                          {language === 'en' ? 'No tasks to clear' : '没有可清空的任务'}
                        </div>
                      )
                    }

                    return filtered.map(todo => (
                      <div
                        key={todo.id}
                        onClick={() => {
                          const newSet = new Set(selectedClearIds)
                          if (newSet.has(todo.id)) {
                            newSet.delete(todo.id)
                          } else {
                            newSet.add(todo.id)
                          }
                          setSelectedClearIds(newSet)
                        }}
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${selectedClearIds.has(todo.id)
                          ? 'bg-[color:var(--app-surface-hover)] border border-violet-200/50'
                          : 'bg-[color:var(--app-surface)] hover:bg-[color:var(--app-surface-hover)] border border-[color:var(--app-border)]'
                          }`}
                      >
                        {/* Checkbox */}
                        <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                          style={{
                            borderColor: selectedClearIds.has(todo.id) ? 'rgb(139, 92, 246)' : 'var(--app-border)',
                            backgroundColor: selectedClearIds.has(todo.id) ? 'rgb(139, 92, 246)' : 'transparent'
                          }}
                        >
                          {selectedClearIds.has(todo.id) && (
                            <Check size={12} className="text-white" strokeWidth={3} />
                          )}
                        </div>
                        {/* Task Text */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium truncate ${todo.completed ? 'line-through text-[color:var(--app-text-muted)]' : 'text-[color:var(--app-text-main)]'}`}>
                            {todo.text}
                          </p>
                        </div>
                      </div>
                    ))
                  })()}
                </div>

                {/* Action Buttons */}
                <div className="px-4 py-3 border-t border-[color:var(--app-divider)] bg-[color:var(--app-surface-hover)] flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      setShowClearSelect(false)
                      setSelectedClearIds(new Set())
                    }}
                    className="flex-1 py-2 rounded-lg bg-[color:var(--app-surface)] border border-[color:var(--app-border)] text-[color:var(--app-text-sub)] font-semibold text-xs hover:bg-[color:var(--app-surface-hover)] transition-all active:scale-[0.98]"
                  >
                    {language === 'en' ? 'Cancel' : '取消'}
                  </button>
                  <button
                    onClick={() => {
                      if (selectedClearIds.size === 0) {
                        // 如果没有选择，默认全选
                        const now = new Date()
                        now.setHours(0, 0, 0, 0)
                        const todayEnd = new Date(now)
                        todayEnd.setHours(23, 59, 59, 999)

                        let filtered: Todo[] = []
                        if (filterMode === 'today') {
                          filtered = todos.filter(todo => {
                            if (!todo.dueTime) return false
                            const due = new Date(todo.dueTime)
                            const dueDate = new Date(due.getFullYear(), due.getMonth(), due.getDate())
                            const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                            if (todo.completed) {
                              if (todo.completedDate) {
                                const completedDate = new Date(todo.completedDate)
                                const completedDateOnly = new Date(completedDate.getFullYear(), completedDate.getMonth(), completedDate.getDate())
                                return completedDateOnly.getTime() === todayDate.getTime()
                              }
                              return dueDate.getTime() === todayDate.getTime()
                            }
                            return dueDate.getTime() === todayDate.getTime()
                          })
                        } else if (filterMode === 'past') {
                          filtered = todos.filter(todo => {
                            if (!todo.dueTime) return false
                            const due = new Date(todo.dueTime)
                            const dueDate = new Date(due.getFullYear(), due.getMonth(), due.getDate())
                            const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                            if (todo.completed) {
                              if (todo.completedDate) {
                                const completedDate = new Date(todo.completedDate)
                                const completedDateOnly = new Date(completedDate.getFullYear(), completedDate.getMonth(), completedDate.getDate())
                                return completedDateOnly.getTime() !== todayDate.getTime()
                              }
                              return false
                            }
                            return dueDate < todayDate
                          })
                        } else {
                          filtered = todos.filter(todo => {
                            if (todo.completed) return false
                            if (!todo.dueTime) return false
                            const due = new Date(todo.dueTime)
                            return due > todayEnd
                          })
                        }
                        setSelectedClearIds(new Set(filtered.map(t => t.id)))
                        return
                      }
                      setPendingDeleteIds(new Set(selectedClearIds))
                      setShowClearSelect(false)
                      setShowDeleteConfirm(true)
                    }}
                    className="flex-1 py-2 rounded-lg bg-theme-primary text-white font-semibold text-xs shadow-theme transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110"
                  >
                    {language === 'en' ? 'Clear' : '清空'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Task Selection Dialog */}
        <AnimatePresence>
          {showDeleteSelect && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
              onClick={() => {
                setShowDeleteSelect(false)
                setSelectedDeleteIds(new Set())
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm bg-[color:var(--app-surface)] backdrop-blur-xl rounded-2xl shadow-xl border border-[color:var(--app-border)] overflow-hidden max-h-[80vh] flex flex-col"
              >
                {/* Header */}
                <div className="px-4 py-3 flex justify-between items-center border-b border-[color:var(--app-divider)] flex-shrink-0">
                  <h1 className="text-sm font-semibold text-[color:var(--app-text-main)]">
                    {language === 'en' ? 'Select Tasks to Delete' : '选择要删除的任务'}
                  </h1>
                  <button
                    onClick={() => {
                      setShowDeleteSelect(false)
                      setSelectedDeleteIds(new Set())
                    }}
                    className="p-1 rounded-lg hover:bg-[color:var(--app-surface-hover)] transition-colors text-[color:var(--app-text-muted)]"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Task List */}
                <div className="p-4 space-y-2 overflow-y-auto flex-1 min-h-0">
                  {(() => {
                    const now = new Date()
                    now.setHours(0, 0, 0, 0)
                    const todayEnd = new Date(now)
                    todayEnd.setHours(23, 59, 59, 999)

                    let filtered: Todo[] = []
                    if (filterMode === 'today') {
                      filtered = todos.filter(todo => {
                        if (!todo.dueTime) return false
                        const due = new Date(todo.dueTime)
                        const dueDate = new Date(due.getFullYear(), due.getMonth(), due.getDate())
                        const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                        if (todo.completed) {
                          if (todo.completedDate) {
                            const completedDate = new Date(todo.completedDate)
                            const completedDateOnly = new Date(completedDate.getFullYear(), completedDate.getMonth(), completedDate.getDate())
                            return completedDateOnly.getTime() === todayDate.getTime()
                          }
                          return dueDate.getTime() === todayDate.getTime()
                        }
                        return dueDate.getTime() === todayDate.getTime()
                      })
                    } else if (filterMode === 'past') {
                      filtered = todos.filter(todo => {
                        if (todo.completed && todo.completedDate) {
                          const completedDate = new Date(todo.completedDate)
                          const completedDateOnly = new Date(completedDate.getFullYear(), completedDate.getMonth(), completedDate.getDate())
                          const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                          return completedDateOnly.getTime() < todayDate.getTime()
                        }
                        if (!todo.completed && todo.dueTime) {
                          const due = new Date(todo.dueTime)
                          const dueDate = new Date(due.getFullYear(), due.getMonth(), due.getDate())
                          const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                          return dueDate.getTime() < todayDate.getTime()
                        }
                        return false
                      })
                    } else {
                      filtered = todos.filter(todo => {
                        if (todo.completed) return false
                        if (!todo.dueTime) return false
                        const due = new Date(todo.dueTime)
                        return due > todayEnd
                      })
                    }

                    if (filtered.length === 0) {
                      return (
                        <div className="text-center py-8 text-[color:var(--app-text-muted)] text-xs">
                          {language === 'en' ? 'No tasks to delete' : '没有可删除的任务'}
                        </div>
                      )
                    }

                    return filtered.map(todo => (
                      <div
                        key={todo.id}
                        onClick={() => {
                          const newSet = new Set(selectedDeleteIds)
                          if (newSet.has(todo.id)) {
                            newSet.delete(todo.id)
                          } else {
                            newSet.add(todo.id)
                          }
                          setSelectedDeleteIds(newSet)
                        }}
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${selectedDeleteIds.has(todo.id)
                          ? 'bg-[color:var(--app-surface-hover)] border border-violet-200/50'
                          : 'bg-[color:var(--app-surface)] hover:bg-[color:var(--app-surface-hover)] border border-[color:var(--app-border)]'
                          }`}
                      >
                        {/* Checkbox */}
                        <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                          style={{
                            borderColor: selectedDeleteIds.has(todo.id) ? 'rgb(139, 92, 246)' : 'var(--app-border)',
                            backgroundColor: selectedDeleteIds.has(todo.id) ? 'rgb(139, 92, 246)' : 'transparent'
                          }}
                        >
                          {selectedDeleteIds.has(todo.id) && (
                            <Check size={12} className="text-white" strokeWidth={3} />
                          )}
                        </div>
                        {/* Task Text */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium truncate ${todo.completed ? 'line-through text-[color:var(--app-text-muted)]' : 'text-[color:var(--app-text-main)]'}`}>
                            {todo.text}
                          </p>
                        </div>
                      </div>
                    ))
                  })()}
                </div>

                {/* Action Buttons */}
                <div className="px-4 py-3 border-t border-[color:var(--app-divider)] bg-[color:var(--app-surface-hover)] flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      setShowDeleteSelect(false)
                      setSelectedDeleteIds(new Set())
                    }}
                    className="flex-1 py-2 rounded-lg bg-[color:var(--app-surface)] border border-[color:var(--app-border)] text-[color:var(--app-text-sub)] font-semibold text-xs hover:bg-[color:var(--app-surface-hover)] transition-all active:scale-[0.98]"
                  >
                    {language === 'en' ? 'Cancel' : '取消'}
                  </button>
                  <button
                    onClick={() => {
                      if (selectedDeleteIds.size === 0) {
                        return
                      }
                      setPendingDeleteIds(new Set(selectedDeleteIds))
                      setShowDeleteSelect(false)
                      setShowDeleteConfirm(true)
                    }}
                    disabled={selectedDeleteIds.size === 0}
                    className="flex-1 py-2 rounded-lg bg-theme-primary text-white font-semibold text-xs shadow-theme transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110"
                  >
                    {language === 'en' ? 'Delete' : '删除'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Dialog */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
              onClick={() => {
                setShowDeleteConfirm(false)
                setPendingDeleteIds(new Set())
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-xs bg-[color:var(--app-surface)] backdrop-blur-xl rounded-2xl shadow-xl border border-[color:var(--app-border)] overflow-hidden"
              >
                {/* Header */}
                <div className="px-4 py-3 flex justify-between items-center border-b border-[color:var(--app-divider)]">
                  <h1 className="text-sm font-semibold text-[color:var(--app-text-main)]">
                    {language === 'en' ? 'Delete Tasks' : '删除任务'}
                  </h1>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false)
                      setPendingDeleteIds(new Set())
                    }}
                    className="p-1 rounded-lg hover:bg-[color:var(--app-surface-hover)] transition-colors text-[color:var(--app-text-muted)]"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-xs text-[color:var(--app-text-sub)] mb-2">
                    {language === 'en'
                      ? `Are you sure you want to delete ${pendingDeleteIds.size} task(s)?`
                      : `确定要删除 ${pendingDeleteIds.size} 个任务吗？`
                    }
                  </p>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {Array.from(pendingDeleteIds).map(id => {
                      const todo = todos.find(t => t.id === id)
                      return todo ? (
                        <div key={id} className="text-[10px] text-[color:var(--app-text-muted)] truncate">
                          • {todo.text}
                        </div>
                      ) : null
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-4 py-3 border-t border-[color:var(--app-divider)] bg-[color:var(--app-surface-hover)] flex gap-2">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false)
                      setPendingDeleteIds(new Set())
                    }}
                    className="flex-1 py-2 rounded-lg bg-[color:var(--app-surface)] border border-[color:var(--app-border)] text-[color:var(--app-text-sub)] font-semibold text-xs hover:bg-[color:var(--app-surface-hover)] transition-all active:scale-[0.98]"
                  >
                    {language === 'en' ? 'Cancel' : '取消'}
                  </button>
                  <button
                    onClick={() => {
                      pendingDeleteIds.forEach(id => deleteTodo(id))
                      setPendingDeleteIds(new Set())
                      setShowDeleteConfirm(false)
                    }}
                    className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold text-xs shadow-md shadow-red-500/30 transition-all active:scale-[0.98]"
                  >
                    {language === 'en' ? 'Confirm' : '确定'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Clear Confirmation Dialog */}
        <AnimatePresence>
          {showClearConfirm && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
              onClick={() => {
                setShowClearConfirm(false)
                setPendingClearIds(new Set())
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-xs bg-[color:var(--app-surface)] backdrop-blur-xl rounded-2xl shadow-xl border border-[color:var(--app-border)] overflow-hidden"
              >
                {/* Header */}
                <div className="px-4 py-3 flex justify-between items-center border-b border-[color:var(--app-divider)]">
                  <h1 className="text-sm font-semibold text-[color:var(--app-text-main)]">
                    {language === 'en' ? 'Clear Tasks' : '清空任务'}
                  </h1>
                  <button
                    onClick={() => {
                      setShowClearConfirm(false)
                      setPendingClearIds(new Set())
                    }}
                    className="p-1 rounded-lg hover:bg-[color:var(--app-surface-hover)] transition-colors text-[color:var(--app-text-muted)]"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-xs text-[color:var(--app-text-sub)] mb-2">
                    {language === 'en'
                      ? `Are you sure you want to clear ${pendingClearIds.size} task(s)?`
                      : `确定要清空 ${pendingClearIds.size} 个任务吗？`
                    }
                  </p>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {Array.from(pendingClearIds).map(id => {
                      const todo = todos.find(t => t.id === id)
                      return todo ? (
                        <div key={id} className="text-[10px] text-[color:var(--app-text-muted)] truncate">
                          • {todo.text}
                        </div>
                      ) : null
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-4 py-3 border-t border-[color:var(--app-divider)] bg-[color:var(--app-surface-hover)] flex gap-2">
                  <button
                    onClick={() => {
                      setShowClearConfirm(false)
                      setPendingClearIds(new Set())
                    }}
                    className="flex-1 py-2 rounded-lg bg-[color:var(--app-surface)] border border-[color:var(--app-border)] text-[color:var(--app-text-sub)] font-semibold text-xs hover:bg-[color:var(--app-surface-hover)] transition-all active:scale-[0.98]"
                  >
                    {language === 'en' ? 'Cancel' : '取消'}
                  </button>
                  <button
                    onClick={() => {
                      clearAll(Array.from(pendingClearIds))
                      setPendingClearIds(new Set())
                      setShowClearConfirm(false)
                    }}
                    className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold text-xs shadow-md shadow-red-500/30 transition-all active:scale-[0.98]"
                  >
                    {language === 'en' ? 'Confirm' : '确定'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sort Menu Dialog */}
        <AnimatePresence>
          {showSortMenu && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
              onClick={() => {
                setShowSortMenu(false)
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-xs bg-[color:var(--app-surface)] backdrop-blur-xl rounded-2xl shadow-xl border border-[color:var(--app-border)] overflow-hidden"
              >
                {/* Header */}
                <div className="px-4 py-3 flex justify-between items-center border-b border-[color:var(--app-divider)]">
                  <div className="flex items-center gap-2">
                    <h1 className="text-sm font-semibold text-[color:var(--app-text-main)]">
                      {language === 'en' ? 'Sort Options' : '排序选项'}
                    </h1>
                    {(() => {
                      // 如果点击了排序选项，临时状态为false；否则显示原始状态
                      const hasSelectedSort = sortOptions.time || sortOptions.priority || sortOptions.completed || sortOptions.uncompleted
                      const shouldShow = hasSelectedSort ? false : tempHasCustomOrder
                      return shouldShow ? (
                        <span className="text-[9px] text-violet-600 font-medium">
                          {language === 'en' ? '(Custom Order)' : '（当前已自主排序）'}
                        </span>
                      ) : null
                    })()}
                  </div>
                  <button
                    onClick={() => {
                      setShowSortMenu(false)
                    }}
                    className="p-1 rounded-lg hover:bg-[color:var(--app-surface-hover)] transition-colors text-[color:var(--app-text-muted)]"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                  {/* Time Sort */}
                  <div>
                    <label className="block text-[10px] font-semibold text-[color:var(--app-text-muted)] mb-2 uppercase">
                      {language === 'en' ? 'Time' : '时间'}
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSortOptions({ ...sortOptions, time: sortOptions.time === 'asc' ? undefined : 'asc' })
                        }}
                        className={`flex-1 px-3 py-2 rounded-lg font-semibold text-[10px] transition-all flex items-center justify-center gap-1 ${sortOptions.time === 'asc'
                          ? 'bg-theme-primary text-white'
                          : 'bg-[color:var(--app-surface-hover)] text-[color:var(--app-text-sub)] hover:bg-[color:var(--app-surface-hover)]'
                          }`}
                      >
                        <ArrowUp size={12} />
                        {language === 'en' ? 'Ascending' : '升序'}
                      </button>
                      <button
                        onClick={() => {
                          setSortOptions({ ...sortOptions, time: sortOptions.time === 'desc' ? undefined : 'desc' })
                        }}
                        className={`flex-1 px-3 py-2 rounded-lg font-semibold text-[10px] transition-all flex items-center justify-center gap-1 ${sortOptions.time === 'desc'
                          ? 'bg-theme-primary text-white'
                          : 'bg-[color:var(--app-surface-hover)] text-[color:var(--app-text-sub)] hover:bg-[color:var(--app-surface-hover)]'
                          }`}
                      >
                        <ArrowDown size={12} />
                        {language === 'en' ? 'Descending' : '降序'}
                      </button>
                    </div>
                  </div>

                  {/* Priority Sort */}
                  <div>
                    <label className="block text-[10px] font-semibold text-[color:var(--app-text-muted)] mb-2 uppercase">
                      {language === 'en' ? 'Priority' : '优先级'}
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSortOptions({ ...sortOptions, priority: sortOptions.priority === 'asc' ? undefined : 'asc' })
                        }}
                        className={`flex-1 px-3 py-2 rounded-lg font-semibold text-[10px] transition-all flex items-center justify-center gap-1 ${sortOptions.priority === 'asc'
                          ? 'bg-theme-primary text-white'
                          : 'bg-[color:var(--app-surface-hover)] text-[color:var(--app-text-sub)] hover:bg-[color:var(--app-surface-hover)]'
                          }`}
                      >
                        <ArrowUp size={12} />
                        {language === 'en' ? 'Low to High' : '低到高'}
                      </button>
                      <button
                        onClick={() => {
                          setSortOptions({ ...sortOptions, priority: sortOptions.priority === 'desc' ? undefined : 'desc' })
                        }}
                        className={`flex-1 px-3 py-2 rounded-lg font-semibold text-[10px] transition-all flex items-center justify-center gap-1 ${sortOptions.priority === 'desc'
                          ? 'bg-theme-primary text-white'
                          : 'bg-[color:var(--app-surface-hover)] text-[color:var(--app-text-sub)] hover:bg-[color:var(--app-surface-hover)]'
                          }`}
                      >
                        <ArrowDown size={12} />
                        {language === 'en' ? 'High to Low' : '高到低'}
                      </button>
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-[10px] font-semibold text-[color:var(--app-text-muted)] mb-2 uppercase">
                      {language === 'en' ? 'Status' : '状态'}
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSortOptions({ ...sortOptions, completed: sortOptions.completed === true ? undefined : true })
                        }}
                        className={`flex-1 px-3 py-2 rounded-lg font-semibold text-[10px] transition-all ${sortOptions.completed === true
                          ? 'bg-theme-primary text-white'
                          : 'bg-[color:var(--app-surface-hover)] text-[color:var(--app-text-sub)] hover:bg-[color:var(--app-surface-hover)]'
                          }`}
                      >
                        {language === 'en' ? 'Completed' : '已完成'}
                      </button>
                      <button
                        onClick={() => {
                          setSortOptions({ ...sortOptions, uncompleted: sortOptions.uncompleted === true ? undefined : true })
                        }}
                        className={`flex-1 px-3 py-2 rounded-lg font-semibold text-[10px] transition-all ${sortOptions.uncompleted === true
                          ? 'bg-theme-primary text-white'
                          : 'bg-[color:var(--app-surface-hover)] text-[color:var(--app-text-sub)] hover:bg-[color:var(--app-surface-hover)]'
                          }`}
                      >
                        {language === 'en' ? 'Uncompleted' : '未完成'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-4 py-3 border-t border-[color:var(--app-divider)] bg-[color:var(--app-surface-hover)] flex gap-2">
                  <button
                    onClick={() => {
                      setSortOptions({})
                      setShowSortMenu(false)
                    }}
                    className="flex-1 py-2 rounded-lg bg-[color:var(--app-surface)] border border-[color:var(--app-border)] text-[color:var(--app-text-sub)] font-semibold text-xs hover:bg-[color:var(--app-surface-hover)] transition-all active:scale-[0.98]"
                  >
                    {language === 'en' ? 'Reset' : '重置'}
                  </button>
                  <button
                    onClick={() => {
                      // 只有点击确认时才改变状态
                      if (sortOptions.time || sortOptions.priority || sortOptions.completed || sortOptions.uncompleted) {
                        setHasCustomOrder(false)
                      }
                      setShowSortMenu(false)
                    }}
                    className="flex-1 py-2 rounded-lg bg-theme-primary text-white font-semibold text-xs shadow-theme transition-all active:scale-[0.98] hover:brightness-110"
                  >
                    {language === 'en' ? 'Confirm' : '确定'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Resize Handles */}
      {/* Top Edge */}
      <div
        className="absolute top-0 left-0 right-0 h-1 z-[90] group app-no-drag cursor-ns-resize"
        onMouseDown={(e) => handleResizeStart(e, 'n')}
      />

      {/* Top Left Corner */}
      <div
        className="absolute top-0 left-0 w-16 h-16 z-[100] group app-no-drag cursor-nwse-resize flex items-start justify-start"
        onMouseDown={(e) => handleResizeStart(e, 'nw')}
      >
        {/* Bubble Container */}
        <div className="relative w-full h-full transition-transform duration-300 ease-out transform origin-top-left group-hover:scale-110 group-active:scale-95">
          {/* Mask for Rounded Corner */}
          <div className="absolute inset-0 rounded-tl-[28px] overflow-hidden pointer-events-none">
            {/* Main Bubble Body */}
            <div
              className="absolute top-0 left-0 w-12 h-12 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at 30% 30%, rgba(196, 181, 253, ${Math.max(0.8, backgroundOpacity)}) 0%, rgba(139, 92, 246, ${Math.max(0.4, backgroundOpacity * 0.6)}) 50%, transparent 70%)`,
                filter: 'blur(5px)',
              }}
            />
            {/* Highlight/Shine */}
            <div
              className="absolute top-2 left-2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-40 transition-opacity duration-300 blur-[2px]"
            />
          </div>
        </div>
      </div>

      {/* Left Edge */}
      <div
        className="absolute top-0 bottom-0 left-0 w-1 z-[90] group app-no-drag cursor-ew-resize"
        onMouseDown={(e) => handleResizeStart(e, 'w')}
      />

      {/* Right Edge */}
      <div
        className="absolute top-0 bottom-0 right-0 w-1 z-[90] group app-no-drag cursor-ew-resize"
        onMouseDown={(e) => handleResizeStart(e, 'e')}
      />

      {/* Bottom Edge */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 z-[90] group app-no-drag cursor-ns-resize"
        onMouseDown={(e) => handleResizeStart(e, 's')}
      />

      {/* Bottom Right Corner */}
      <div
        className="absolute bottom-0 right-0 w-16 h-16 flex items-end justify-end z-[100] group app-no-drag cursor-nwse-resize"
        onMouseDown={(e) => handleResizeStart(e, 'se')}
      >
        <div className="relative w-full h-full transition-transform duration-300 ease-out transform origin-bottom-right group-hover:scale-110 group-active:scale-95">
          {/* Mask for Rounded Corner */}
          <div className="absolute inset-0 rounded-br-[28px] overflow-hidden pointer-events-none">
            <div
              className="absolute bottom-0 right-0 w-12 h-12 rounded-full transition-opacity duration-300 opacity-0 group-hover:opacity-100"
              style={{
                background: `radial-gradient(circle at 70% 70%, rgba(196, 181, 253, ${Math.max(0.8, backgroundOpacity)}) 0%, rgba(139, 92, 246, ${Math.max(0.4, backgroundOpacity * 0.6)}) 50%, transparent 70%)`,
                filter: 'blur(5px)'
              }}
            />
            <div
              className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-40 transition-opacity duration-300 blur-[2px]"
            />
          </div>
        </div>
      </div>

      {/* Bottom Left Corner */}
      <div
        className="absolute bottom-0 left-0 w-16 h-16 flex items-end justify-start z-[100] group app-no-drag cursor-nesw-resize"
        onMouseDown={(e) => handleResizeStart(e, 'sw')}
      >
        <div className="relative w-full h-full transition-transform duration-300 ease-out transform origin-bottom-left group-hover:scale-110 group-active:scale-95">
          {/* Mask for Rounded Corner */}
          <div className="absolute inset-0 rounded-bl-[28px] overflow-hidden pointer-events-none">
            <div
              className="absolute bottom-0 left-0 w-12 h-12 rounded-full transition-opacity duration-300 opacity-0 group-hover:opacity-100"
              style={{
                background: `radial-gradient(circle at 30% 70%, rgba(196, 181, 253, ${Math.max(0.8, backgroundOpacity)}) 0%, rgba(139, 92, 246, ${Math.max(0.4, backgroundOpacity * 0.6)}) 50%, transparent 70%)`,
                filter: 'blur(5px)'
              }}
            />
            <div
              className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-40 transition-opacity duration-300 blur-[2px]"
            />
          </div>
        </div>
      </div>

    </div>
  )
}

export default App
