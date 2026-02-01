import { useState, useEffect, useRef, useCallback, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Pin, CircleCheck, Bell, ArrowRight, Settings, Sparkles, Globe, Rocket, Layers, Calendar, Check, CheckCircle, MoreHorizontal, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import TodoInput from './components/TodoInput'
import TodoList from './components/TodoList'
import { getTranslation } from './i18n'
import type { Language } from './i18n'

interface SettingsPanelContentProps {
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: 'light' | 'dark' | 'glass';
  setTheme: (theme: 'light' | 'dark' | 'glass') => void;
  opacity: number;
  setOpacity: (opacity: number) => void;
  autoStart: boolean;
  toggleAutoStart: () => void;
  isPinned: boolean;
  togglePin: () => void;
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
  opacity,
  setOpacity,
  autoStart,
  toggleAutoStart,
  isPinned,
  togglePin,
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
      className="w-44 p-2 bg-white/98 backdrop-blur-2xl rounded-lg shadow-xl border border-gray-200/60 flex flex-col gap-1.5 origin-top-right"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-0.5">
        <h2 className="text-xs font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
          {language === 'en' ? 'Settings' : '设置'}
        </h2>
        <button
          onClick={onClose}
          className="w-5 h-5 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition-colors text-slate-600"
        >
          <X size={10} />
        </button>
      </div>

      {/* General Section */}
      <div className="space-y-1">
        <h3 className="text-[8px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
          {language === 'en' ? 'General' : '常规'}
        </h3>
        
        {/* Launch on startup */}
        <div className="flex items-center justify-between py-1 px-1.5 rounded bg-white/30 border border-white/20 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <Rocket size={10} className="text-indigo-600 flex-shrink-0" />
            <span className="text-[9px] font-medium truncate">{language === 'en' ? 'Launch on startup' : '开机启动'}</span>
          </div>
          <div className="relative inline-block w-9 h-4 align-middle select-none transition duration-200 ease-in flex-shrink-0 ml-1">
            <input
              type="checkbox"
              checked={autoStart}
              onChange={toggleAutoStart}
              className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-2 border-slate-200 appearance-none cursor-pointer outline-none transition-all duration-300 ease-in-out left-0 top-0 checked:translate-x-full checked:bg-white checked:border-primary"
            />
            <label className={`block overflow-hidden h-4 rounded-full cursor-pointer transition-colors duration-300 ${autoStart ? 'bg-primary' : 'bg-slate-200'}`} />
          </div>
        </div>

        {/* Always on top */}
        <div className="flex items-center justify-between py-1 px-1.5 rounded bg-white/30 border border-white/20 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <Layers size={10} className="text-purple-600 flex-shrink-0" />
            <span className="text-[9px] font-medium truncate">{language === 'en' ? 'Always on top' : '始终置顶'}</span>
          </div>
          <div className="relative inline-block w-9 h-4 align-middle select-none transition duration-200 ease-in flex-shrink-0 ml-1">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={togglePin}
              className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-2 border-slate-200 appearance-none cursor-pointer outline-none transition-all duration-300 ease-in-out left-0 top-0 checked:translate-x-full checked:bg-white checked:border-primary"
            />
            <label className={`block overflow-hidden h-4 rounded-full cursor-pointer transition-colors duration-300 ${isPinned ? 'bg-primary' : 'bg-slate-200'}`} />
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="space-y-1">
        <h3 className="text-[8px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
          {language === 'en' ? 'Appearance' : '外观'}
        </h3>
        
        {/* Theme Selection - Row Layout */}
        <div className="flex gap-1">
          <button
            onClick={() => { setTheme('light'); localStorage.setItem('todio-theme', 'light'); }}
            className={`flex-1 py-1 px-1 rounded border-2 transition-all focus:outline-none min-w-0 ${
              theme === 'light' ? 'border-primary bg-white/50 shadow-sm' : 'border-transparent bg-white/40 hover:bg-white/60'
            }`}
          >
            <div className="w-full h-4 rounded bg-gray-100 border border-gray-200 flex items-center justify-center mb-0.5 relative">
              <div className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-sm top-0.5 left-0.5"></div>
            </div>
            <span className={`text-[8px] font-medium transition-colors block text-center truncate ${theme === 'light' ? 'text-primary' : 'text-slate-600'}`}>
              {language === 'en' ? 'Light' : '浅色'}
            </span>
          </button>
          
          <button
            onClick={() => { setTheme('dark'); localStorage.setItem('todio-theme', 'dark'); }}
            className={`flex-1 py-1 px-1 rounded border-2 transition-all focus:outline-none min-w-0 ${
              theme === 'dark' ? 'border-primary bg-white/50 shadow-sm' : 'border-transparent bg-white/40 hover:bg-white/60'
            }`}
          >
            <div className="w-full h-4 rounded bg-slate-800 border border-slate-700 flex items-center justify-center mb-0.5 relative">
              <div className="absolute w-1.5 h-1.5 bg-slate-600 rounded-full shadow-sm top-0.5 left-0.5"></div>
            </div>
            <span className={`text-[8px] font-medium transition-colors block text-center truncate ${theme === 'dark' ? 'text-primary' : 'text-slate-600'}`}>
              {language === 'en' ? 'Dark' : '深色'}
            </span>
          </button>
          
          <button
            onClick={() => { setTheme('glass'); localStorage.setItem('todio-theme', 'glass'); }}
            className={`flex-1 py-1 px-1 rounded border-2 transition-all focus:outline-none min-w-0 ${
              theme === 'glass' ? 'border-primary bg-white/50 shadow-sm' : 'border-transparent bg-white/40 hover:bg-white/60'
            }`}
          >
            <div className="w-full h-4 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-0.5 relative">
              <div className="absolute w-full h-full bg-white/20 backdrop-blur-[2px]"></div>
              <Settings size={7} className="text-white relative z-10" />
            </div>
            <span className={`text-[8px] font-bold transition-colors block text-center truncate ${theme === 'glass' ? 'text-primary' : 'text-slate-600'}`}>
              {language === 'en' ? 'Glass' : '玻璃'}
            </span>
          </button>
        </div>
      </div>

      {/* Opacity Control */}
      <div className="space-y-0.5 pt-1 border-t border-slate-200/20">
        <div className="w-full flex justify-between items-center text-[8px] text-neu-muted font-medium px-0.5">
          <span className="truncate">{t.opacity}</span>
          <span className="flex-shrink-0 ml-1">{Math.round(opacity * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.2"
          max="1"
          step="0.01"
          value={opacity}
          onChange={(e) => setOpacity(parseFloat(e.target.value))}
          className="w-full h-0.5 bg-violet-100 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-500 [&::-webkit-slider-thumb]:shadow-sm outline-none"
        />
      </div>

      {/* Language Toggle */}
      <div className="pt-1 border-t border-slate-200/20">
        <button
          onClick={() => {
            const newLang = language === 'en' ? 'zh' : 'en'
            setLanguage(newLang)
            localStorage.setItem('todio-language', newLang)
            try {
              // eslint-disable-next-line @typescript-eslint/no-require-imports
              const { ipcRenderer } = require('electron');
              ipcRenderer.send('set-language', newLang);
            } catch { /* Not in Electron */ }
          }}
          className="w-full flex items-center justify-between px-1 py-0.5 rounded hover:bg-violet-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-1">
            <Globe size={9} className="text-neu-muted/50" />
            <span className="text-[8px] font-medium text-neu-muted">{t.language}</span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] font-medium">
            <span className={language === 'en' ? 'text-violet-600' : 'text-neu-muted/40'}>EN</span>
            <span className="text-neu-muted/30">/</span>
            <span className={language === 'zh' ? 'text-violet-600' : 'text-neu-muted/40'}>中</span>
          </div>
        </button>
      </div>

      {/* Version Info */}
      <div className="pt-1 border-t border-slate-200/20 text-center">
        <p className="text-[8px] text-slate-500">Todio {VERSION}</p>
      </div>

      {/* Help & Updates */}
      <div className="pt-1 border-t border-slate-200/20 space-y-0.5">
        <button
          onClick={() => {
            try {
              // eslint-disable-next-line @typescript-eslint/no-require-imports
              const { shell } = require('electron');
              shell.openExternal('https://github.com/nan/todio');
            } catch { /* Not in Electron */ }
          }}
          className="w-full flex items-center justify-between px-1 py-0.5 rounded hover:bg-violet-50 transition-colors cursor-pointer"
        >
          <span className="text-[8px] font-medium text-neu-muted">{t.help}</span>
        </button>

        <button
          onClick={() => {
            try {
              // eslint-disable-next-line @typescript-eslint/no-require-imports
              const { ipcRenderer } = require('electron');
              ipcRenderer.invoke('check-for-updates').then((result: any) => {
                if (!result.hasUpdate) {
                  setShowVersionToast(true);
                  setTimeout(() => setShowVersionToast(false), 3000);
                } else {
                  setUpdateInfo(result);
                }
              });
            } catch {
              setShowVersionToast(true);
              setTimeout(() => setShowVersionToast(false), 3000);
            }
          }}
          className="w-full flex items-center justify-between px-1 py-0.5 rounded hover:bg-violet-50 transition-colors cursor-pointer"
        >
          <span className="text-[8px] font-medium text-neu-muted">{t.checkUpdates}</span>
        </button>

        <button
          onClick={() => {
            try {
              // eslint-disable-next-line @typescript-eslint/no-require-imports
              const { ipcRenderer } = require('electron');
              ipcRenderer.send('quit-app');
            } catch { /* Not in Electron */ }
          }}
          className="w-full flex items-center justify-between px-1 py-0.5 rounded hover:bg-red-50 transition-colors cursor-pointer"
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
const OPACITY_KEY = 'todio-opacity'
const LAST_RUN_VERSION_KEY = 'todio-version'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - __APP_VERSION__ is defined in vite.config.ts
const VERSION = `v${__APP_VERSION__}`
const LANGUAGE_KEY = 'todio-language'

function AppIcon() {
  const [iconSrc, setIconSrc] = useState<string | null>(null)

  useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { ipcRenderer } = require('electron')
      ipcRenderer.invoke('get-icon-data-url').then((url: string | null) => {
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
    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center text-[11px] font-black shadow-sm">
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
          dueTime: t.dueTime ? new Date(t.dueTime) : null
        }))
      }
    } catch { /* Ignore parse errors */ }
    return []
  })
  
  const [opacity, setOpacity] = useState(() => {
    const saved = localStorage.getItem(OPACITY_KEY)
    const parsed = saved ? parseFloat(saved) : 1
    if (!Number.isFinite(parsed)) return 1
    return Math.min(1, Math.max(0.2, parsed))
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
  const [theme, setTheme] = useState<'light' | 'dark' | 'glass'>(() => {
    const saved = localStorage.getItem('todio-theme')
    return (saved === 'light' || saved === 'dark' || saved === 'glass') ? saved : 'glass'
  })

  useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { ipcRenderer } = require('electron');
      ipcRenderer.send('set-language', language);
    } catch { /* Not in Electron */ }
  }, [language])

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
      if (dir === 'se') {
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
        const { ipcRenderer } = require('electron')
        ipcRenderer.send('resize-window', { 
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
    localStorage.setItem(OPACITY_KEY, opacity.toString())
  }, [opacity])

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
        const { ipcRenderer } = require('electron');
        const enabled = await ipcRenderer.invoke('get-auto-launch');
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
        const { ipcRenderer } = require('electron');
        const result = await ipcRenderer.invoke('check-for-updates');
        
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

  const addTodo = (text: string, dueTime?: Date | null) => {
    setTodos(prev => [...prev, { id: crypto.randomUUID(), text, completed: false, dueTime }])
  }

  const addTodoWithDetails = (text: string) => {
    // Don't add task yet, just set pending state to open details modal
    setPendingTodoText(text)
    setPendingTodoId(null) // Will be created when confirmed
  }

  const formatDateLocal = (d: Date) => {
    const year = d.getFullYear()
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const day = d.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Initialize new task modal when pendingTodoText is set
  useEffect(() => {
    if (pendingTodoText && !pendingTodoId) {
      const now = new Date()
      setNewTaskDate(formatDateLocal(now))
      setNewTaskHour(now.getHours().toString().padStart(2, '0'))
      setNewTaskMinute(now.getMinutes().toString().padStart(2, '0'))
      setNewTaskDetails('')
    }
  }, [pendingTodoText, pendingTodoId])

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
      priority: newTaskPriority || 'medium'
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

  // Sync with main process for notifications
  // Using simplified logic now - notifying for all tasks with due time if needed, or disabled.
  // User asked to "delete bell function". I will stop sending updates to main process for now.
  // Or send all? For now, I'll comment it out to disable notifications cleanly.
  /*
  useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { ipcRenderer } = require('electron')
      ipcRenderer.send('update-notification-schedule', todos)
    } catch {  }
  }, [todos])
  */

  const closeApp = () => {
    // Prevent closing if settings button was just clicked
    if (isSettingsClickRef.current) {
      return
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { ipcRenderer } = require('electron');
      ipcRenderer.send('close-to-tray');
    } catch {
      window.close();
    }
  }
  const minimizeApp = () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { ipcRenderer } = require('electron');
      ipcRenderer.send('minimize-window'); // Uses minimize-to-tray if configured
    } catch { /* Not in Electron */ }
  }

  const togglePin = () => {
    setIsPinned(!isPinned);
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { ipcRenderer } = require('electron');
      ipcRenderer.send('toggle-always-on-top', !isPinned);
    } catch { /* Not in Electron */ }
  }

  const handleUpdate = () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { ipcRenderer } = require('electron');
      ipcRenderer.send('open-release-page');
    } catch { /* Not in Electron */ }
    setUpdateInfo(null);
  }

  const closeUpdate = () => setUpdateInfo(null)
  const closeWelcome = () => setShowWelcome(false)

  const toggleAutoStart = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { ipcRenderer } = require('electron');
      const newValue = await ipcRenderer.invoke('set-auto-launch', !autoStart);
      setAutoStart(newValue);
    } catch { /* Not in Electron */ }
  }

  return (
    <div className="h-screen w-screen min-w-[260px] min-h-[360px] bg-transparent flex flex-col app-no-drag">
      {/* Main Container */}
      <div 
        className="relative flex-1 w-full rounded-[28px] overflow-hidden flex flex-col transition-colors duration-200 backdrop-blur-3xl"
        style={{ backgroundColor: `rgba(240, 238, 248, ${Math.min(1, Math.max(0.2, Number.isFinite(opacity) ? opacity : 1))})` }}
      >
        
        {/* Window Controls */}
        <div className="flex items-center justify-between px-4 py-3 app-drag-region relative z-50">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <AppIcon />
            <span className="text-xs font-bold text-neu-text tracking-wide">Todio</span>
            <span className="text-[8px] font-black text-neu-text/30 tracking-wider">{VERSION}</span>
          </motion.div>
          
          <div className="flex items-center gap-1.5 app-no-drag">
            {/* Opacity Control */}
            <div 
              className="relative app-no-drag" 
              ref={opacityRef} 
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
                  e.nativeEvent.stopImmediatePropagation()
                }
              }}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
                  e.nativeEvent.stopImmediatePropagation()
                }
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
                // Use setTimeout to ensure state update happens after event propagation
                setTimeout(() => {
                  setShowOpacityControl(prev => !prev)
                }, 0)
              }}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
                  e.nativeEvent.stopImmediatePropagation()
                }
              }}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer app-no-drag ${
                showOpacityControl ? 'bg-violet-500/20 text-violet-600' : 'hover:bg-black/5 text-neu-text/30'
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
                    opacity={opacity}
                    setOpacity={setOpacity}
                    autoStart={autoStart}
                    toggleAutoStart={toggleAutoStart}
                    isPinned={isPinned}
                    togglePin={togglePin}
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
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                isPinned ? 'bg-violet-500/20 text-violet-600' : 'hover:bg-black/5 text-neu-text/30'
              }`}
            >
              <Pin size={10} fill={isPinned ? 'currentColor' : 'none'} strokeWidth={3} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              onClick={minimizeApp}
              className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/5 text-neu-text/30 transition-all duration-300 cursor-pointer ml-1"
            >
              <Minus size={10} strokeWidth={3} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.15, backgroundColor: 'rgba(255,107,107,0.1)' }}
              whileTap={{ scale: 0.85 }}
              onClick={closeApp}
              className="w-6 h-6 rounded-full flex items-center justify-center hover:text-red-400 text-neu-text/30 transition-all duration-300 cursor-pointer"
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
              <div className="bg-gradient-to-r from-violet-50 to-purple-50/80 rounded-xl p-3 flex items-start gap-3 border border-violet-100 shadow-sm relative overflow-hidden">
                 {/* Sparkle decoration */}
                <div className="absolute top-0 right-0 p-2 text-violet-200 opacity-20 transform translate-x-1/3 -translate-y-1/3">
                  <Sparkles size={80} strokeWidth={1} />
                </div>

                <div className="p-1.5 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg text-white mt-0.5 shadow-sm z-10">
                  <Sparkles size={14} />
                </div>
                <div className="flex-1 min-w-0 z-10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-violet-900 tracking-tight">{t.welcome} {VERSION}!</span>
                    <button onClick={closeWelcome} className="text-violet-400 hover:text-violet-600 transition-colors p-0.5 hover:bg-violet-100/50 rounded-full">
                      <X size={12} />
                    </button>
                  </div>
                  <p className="text-[10px] text-violet-600/90 leading-relaxed font-medium">
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

        {/* Content */}
        <div className="flex-1 overflow-hidden px-3 pb-2.5 relative z-30 flex flex-col min-h-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col flex-1 min-h-0"
          >
            {/* Header with Clear All - More Compact */}
            <header className="flex items-center justify-between mb-1.5 flex-shrink-0">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h1 className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">{t.todayTasks}</h1>
                  {/* Task Count Badge - Inline with Title */}
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
                </div>
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
              </div>
            </header>
            
            {/* Input & List - Flex Layout */}
            <div className="flex flex-col flex-1 min-h-0 space-y-1.5">
              <TodoInput onAdd={addTodo} onAddWithDetails={addTodoWithDetails} language={language} />
              
              {/* Filter Buttons */}
              <div className="flex gap-1.5 px-1 justify-between items-center">
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setFilterMode('today')}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-semibold transition-all whitespace-nowrap ${
                      filterMode === 'today'
                        ? 'bg-violet-500 text-white shadow-md'
                        : 'bg-white/50 text-gray-600 hover:bg-white/70'
                    }`}
                  >
                    {language === 'en' ? 'Today' : '今日'}
                  </button>
                  <button
                    onClick={() => setFilterMode('past')}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-semibold transition-all whitespace-nowrap ${
                      filterMode === 'past'
                        ? 'bg-violet-500 text-white shadow-md'
                        : 'bg-white/50 text-gray-600 hover:bg-white/70'
                    }`}
                  >
                    {language === 'en' ? 'Past' : '过去'}
                  </button>
                  <button
                    onClick={() => setFilterMode('future')}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-semibold transition-all whitespace-nowrap ${
                      filterMode === 'future'
                        ? 'bg-violet-500 text-white shadow-md'
                        : 'bg-white/50 text-gray-600 hover:bg-white/70'
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
                    className="px-3 py-1.5 rounded-lg text-[9px] font-semibold transition-all whitespace-nowrap bg-white/50 text-gray-600 hover:bg-white/70 flex items-center gap-1"
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
                        className="absolute right-0 top-full mt-1 bg-white/90 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200/50 py-1 min-w-[120px] z-50"
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
                          className="w-full px-3 py-2 text-left text-[10px] font-medium text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-200/50"
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
                          className="w-full px-3 py-2 text-left text-[10px] font-medium text-red-600 hover:bg-red-50 transition-colors border-b border-gray-200/50"
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
                          className="w-full px-3 py-2 text-left text-[10px] font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
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
                          className="text-base font-bold text-slate-800 mb-0.5 tracking-tight"
                        >
                          {language === 'en' ? 'All caught up!' : '已完成！'}
                        </motion.h2>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.15 }}
                          className="text-slate-500/80 font-medium text-[10px] mb-2 leading-relaxed"
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
                          className="px-3 py-1 rounded-full bg-white/80 hover:bg-white text-primary font-semibold text-[9px] shadow-[0_4px_12px_-2px_rgba(139,92,246,0.15)] hover:shadow-[0_6px_16px_-2px_rgba(139,92,246,0.2)] active:scale-95 transition-all border border-violet-100 flex items-center gap-1 backdrop-blur-sm"
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
                            className="px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-primary font-semibold text-[9px] shadow-[0_4px_12px_-2px_rgba(139,92,246,0.15)] hover:shadow-[0_6px_16px_-2px_rgba(139,92,246,0.2)] active:scale-95 transition-all border border-violet-100 flex items-center gap-1 backdrop-blur-sm"
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
          </motion.div>
        </div>

        {/* Resize Handles */}
        {/* Top Edge - for resizing (only in corners, title bar handles dragging) */}
        <div 
          className="absolute top-0 left-6 right-6 h-3 z-[60] app-no-drag cursor-ns-resize"
          onMouseDown={(e) => handleResizeStart(e, 'n')}
        />

        {/* Top Left Corner */}
        <div 
          className="absolute top-0 left-0 w-6 h-6 z-[60] app-no-drag cursor-nwse-resize"
          onMouseDown={(e) => handleResizeStart(e, 'nw')}
        />

        {/* Top Right Corner */}
        <div 
          className="absolute top-0 right-0 w-6 h-6 z-[60] app-no-drag cursor-nesw-resize"
          onMouseDown={(e) => handleResizeStart(e, 'ne')}
        />

        {/* Left Edge */}
        <div 
          className="absolute top-6 bottom-6 left-0 w-4 z-[60] app-no-drag cursor-ew-resize"
          onMouseDown={(e) => handleResizeStart(e, 'w')}
        />

        {/* Right Edge */}
        <div 
          className="absolute top-6 bottom-6 right-0 w-4 z-[60] app-no-drag cursor-ew-resize"
          onMouseDown={(e) => handleResizeStart(e, 'e')}
        />

        {/* Bottom Edge */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-4 z-[60] app-no-drag cursor-ns-resize"
          onMouseDown={(e) => handleResizeStart(e, 's')}
        />

        {/* Bottom Right Corner */}
        <div 
          className="absolute bottom-0 right-0 w-6 h-6 flex items-end justify-end z-[60] group app-no-drag cursor-nwse-resize"
          onMouseDown={(e) => handleResizeStart(e, 'se')}
        >
          <div 
            className="absolute bottom-0 right-0 w-full h-full rounded-tl-3xl transition-all duration-300 ease-out opacity-0 group-hover:opacity-100"
            style={{ 
              background: `radial-gradient(circle at bottom right, rgba(139, 92, 246, ${Math.max(0.4, opacity * 0.8)}) 0%, transparent 70%)` 
            }}
          />
        </div>

        {/* Bottom Left Corner */}
        <div 
          className="absolute bottom-0 left-0 w-6 h-6 flex items-end justify-start z-[60] group app-no-drag cursor-nesw-resize"
          onMouseDown={(e) => handleResizeStart(e, 'sw')}
        >
          <div 
            className="absolute bottom-0 left-0 w-full h-full rounded-tr-3xl transition-all duration-300 ease-out opacity-0 group-hover:opacity-100"
            style={{ 
              background: `radial-gradient(circle at bottom left, rgba(139, 92, 246, ${Math.max(0.4, opacity * 0.8)}) 0%, transparent 70%)` 
            }}
          />
        </div>
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
                className="w-full max-w-xs bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 overflow-hidden flex flex-col text-gray-800 max-h-[90vh]"
              >
                {/* Header */}
                <div className="px-4 py-3 flex justify-between items-center border-b border-gray-200/50">
                  <h1 className="text-sm font-semibold text-gray-800">
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
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="p-4 space-y-3 overflow-y-auto flex-1 min-h-0">
                  {/* Task Title (Read-only) */}
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 mb-1.5 uppercase">
                      {language === 'en' ? 'Task Title' : '任务标题'}
                    </label>
                    <div className="px-3 py-2 bg-white/60 rounded-lg border border-gray-200/50 text-xs font-medium text-gray-800">
                      {pendingTodoText}
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 mb-1.5 uppercase">
                      {language === 'en' ? 'Priority' : '优先级'}
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setNewTaskPriority('low')}
                        className={`flex-1 px-3 py-2 rounded-lg font-semibold text-[10px] transition-all flex items-center justify-center gap-1.5 ${
                          (newTaskPriority || 'medium') === 'low'
                            ? 'bg-gray-500 text-white'
                            : 'bg-white/50 text-gray-600 hover:bg-white/70'
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                        {language === 'en' ? 'Low' : '低'}
                      </button>
                      <button
                        onClick={() => setNewTaskPriority('medium')}
                        className={`flex-1 px-3 py-2 rounded-lg font-semibold text-[10px] transition-all flex items-center justify-center gap-1.5 ${
                          (newTaskPriority || 'medium') === 'medium'
                            ? 'bg-yellow-500 text-white'
                            : 'bg-white/50 text-gray-600 hover:bg-white/70'
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                        {language === 'en' ? 'Medium' : '中'}
                      </button>
                      <button
                        onClick={() => setNewTaskPriority('high')}
                        className={`flex-1 px-3 py-2 rounded-lg font-semibold text-[10px] transition-all flex items-center justify-center gap-1.5 ${
                          (newTaskPriority || 'medium') === 'high'
                            ? 'bg-red-500 text-white'
                            : 'bg-white/50 text-gray-600 hover:bg-white/70'
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full bg-red-400"></div>
                        {language === 'en' ? 'High' : '高'}
                      </button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 mb-1.5 uppercase">
                      {language === 'en' ? 'Notes' : '备注内容'}
                    </label>
                    <textarea
                      value={newTaskDetails}
                      onChange={(e) => setNewTaskDetails(e.target.value)}
                      placeholder={language === 'en' ? 'Add task notes...' : '添加任务备注...'}
                      className="w-full px-3 py-2 rounded-lg bg-white/60 backdrop-blur-sm border border-gray-200/50 text-xs text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-violet-300 focus:outline-none resize-none"
                      rows={2}
                    />
                  </div>

                  {/* Date & Time - Compact inline */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-semibold text-gray-500 mb-1.5 uppercase">
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
                          className={`flex-1 px-2 py-1.5 rounded-lg font-semibold text-[10px] transition-all ${
                            !newTaskDate || newTaskDate === formatDateLocal(new Date())
                              ? 'bg-violet-500 text-white'
                              : 'bg-white/50 text-gray-600 hover:bg-white/70'
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
                          className={`flex-1 px-2 py-1.5 rounded-lg font-semibold text-[10px] transition-all ${
                            newTaskDate === formatDateLocal((() => {
                              const t = new Date()
                              t.setDate(t.getDate() + 1)
                              return t
                            })())
                              ? 'bg-violet-500 text-white'
                              : 'bg-white/50 text-gray-600 hover:bg-white/70'
                          }`}
                        >
                          {language === 'en' ? 'Tomorrow' : '明天'}
                        </button>
                        <input
                          type="date"
                          value={newTaskDate || formatDateLocal(new Date())}
                          onChange={(e) => setNewTaskDate(e.target.value)}
                          className="flex-1 px-2 py-1.5 rounded-lg font-semibold text-[10px] bg-white/50 text-gray-600 border border-gray-200/30 focus:outline-none focus:ring-2 focus:ring-violet-300"
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
                          className="w-10 text-center text-sm font-bold text-gray-800 bg-white/60 border border-gray-200/30 rounded-lg py-1 focus:ring-2 focus:ring-violet-300 focus:outline-none"
                        />
                        <span className="text-xs text-gray-400">:</span>
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
                          className="w-10 text-center text-sm font-bold text-gray-800 bg-white/60 border border-gray-200/30 rounded-lg py-1 focus:ring-2 focus:ring-violet-300 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-4 py-3 border-t border-gray-200/50 bg-gray-50/30">
                  <button
                    onClick={handleConfirmNewTask}
                    className="w-full bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2 rounded-lg text-xs shadow-md shadow-violet-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle size={14} />
                    <span>{language === 'en' ? 'Confirm' : '确认'}</span>
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
                className="absolute bottom-5 right-5 z-[60] flex items-center gap-3 px-4 py-3 bg-white/90 backdrop-blur-xl border border-violet-100/50 rounded-2xl shadow-xl shadow-violet-500/10 overflow-hidden"
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
                   <h3 className="text-xs font-bold text-neu-text">{t.upToDate}</h3>
                   <p className="text-[10px] text-neu-muted">{t.latestVersion} {VERSION}</p>
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
                className="w-full max-w-sm bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 overflow-hidden max-h-[80vh] flex flex-col"
              >
                {/* Header */}
                <div className="px-4 py-3 flex justify-between items-center border-b border-gray-200/50 flex-shrink-0">
                  <h1 className="text-sm font-semibold text-gray-800">
                    {language === 'en' ? `Clear ${filterMode === 'today' ? 'Today' : filterMode === 'past' ? 'Past' : 'Future'} Tasks` : `清空${filterMode === 'today' ? '今日' : filterMode === 'past' ? '过去' : '未来'}任务`}
                  </h1>
                  <button
                    onClick={() => {
                      setShowClearSelect(false)
                      setSelectedClearIds(new Set())
                    }}
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
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
                        <div className="text-center py-8 text-gray-500 text-xs">
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
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                          selectedClearIds.has(todo.id)
                            ? 'bg-violet-50 border border-violet-200'
                            : 'bg-white/50 hover:bg-white/70 border border-gray-200/50'
                        }`}
                      >
                        {/* Checkbox */}
                        <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                          style={{
                            borderColor: selectedClearIds.has(todo.id) ? 'rgb(139, 92, 246)' : 'rgb(156, 163, 175)',
                            backgroundColor: selectedClearIds.has(todo.id) ? 'rgb(139, 92, 246)' : 'transparent'
                          }}
                        >
                          {selectedClearIds.has(todo.id) && (
                            <Check size={12} className="text-white" strokeWidth={3} />
                          )}
                        </div>
                        {/* Task Text */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium truncate ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                            {todo.text}
                          </p>
                        </div>
                      </div>
                    ))
                  })()}
                </div>

                {/* Action Buttons */}
                <div className="px-4 py-3 border-t border-gray-200/50 bg-gray-50/30 flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      setShowClearSelect(false)
                      setSelectedClearIds(new Set())
                    }}
                    className="flex-1 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 font-semibold text-xs hover:bg-gray-50 transition-all active:scale-[0.98]"
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
                    className="flex-1 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white font-semibold text-xs shadow-md shadow-violet-500/30 transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
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
                className="w-full max-w-sm bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 overflow-hidden max-h-[80vh] flex flex-col"
              >
                {/* Header */}
                <div className="px-4 py-3 flex justify-between items-center border-b border-gray-200/50 flex-shrink-0">
                  <h1 className="text-sm font-semibold text-gray-800">
                    {language === 'en' ? 'Select Tasks to Delete' : '选择要删除的任务'}
                  </h1>
                  <button
                    onClick={() => {
                      setShowDeleteSelect(false)
                      setSelectedDeleteIds(new Set())
                    }}
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
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
                        <div className="text-center py-8 text-gray-500 text-xs">
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
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                          selectedDeleteIds.has(todo.id)
                            ? 'bg-violet-50 border border-violet-200'
                            : 'bg-white/50 hover:bg-white/70 border border-gray-200/50'
                        }`}
                      >
                        {/* Checkbox */}
                        <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                          style={{
                            borderColor: selectedDeleteIds.has(todo.id) ? 'rgb(139, 92, 246)' : 'rgb(156, 163, 175)',
                            backgroundColor: selectedDeleteIds.has(todo.id) ? 'rgb(139, 92, 246)' : 'transparent'
                          }}
                        >
                          {selectedDeleteIds.has(todo.id) && (
                            <Check size={12} className="text-white" strokeWidth={3} />
                          )}
                        </div>
                        {/* Task Text */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium truncate ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                            {todo.text}
                          </p>
                        </div>
                      </div>
                    ))
                  })()}
                </div>

                {/* Action Buttons */}
                <div className="px-4 py-3 border-t border-gray-200/50 bg-gray-50/30 flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      setShowDeleteSelect(false)
                      setSelectedDeleteIds(new Set())
                    }}
                    className="flex-1 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 font-semibold text-xs hover:bg-gray-50 transition-all active:scale-[0.98]"
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
                    className="flex-1 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white font-semibold text-xs shadow-md shadow-violet-500/30 transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
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
                className="w-full max-w-xs bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 overflow-hidden"
              >
                {/* Header */}
                <div className="px-4 py-3 flex justify-between items-center border-b border-gray-200/50">
                  <h1 className="text-sm font-semibold text-gray-800">
                    {language === 'en' ? 'Delete Tasks' : '删除任务'}
                  </h1>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false)
                      setPendingDeleteIds(new Set())
                    }}
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-xs text-gray-700 mb-2">
                    {language === 'en' 
                      ? `Are you sure you want to delete ${pendingDeleteIds.size} task(s)?`
                      : `确定要删除 ${pendingDeleteIds.size} 个任务吗？`
                    }
                  </p>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {Array.from(pendingDeleteIds).map(id => {
                      const todo = todos.find(t => t.id === id)
                      return todo ? (
                        <div key={id} className="text-[10px] text-gray-600 truncate">
                          • {todo.text}
                        </div>
                      ) : null
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-4 py-3 border-t border-gray-200/50 bg-gray-50/30 flex gap-2">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false)
                      setPendingDeleteIds(new Set())
                    }}
                    className="flex-1 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 font-semibold text-xs hover:bg-gray-50 transition-all active:scale-[0.98]"
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
                className="w-full max-w-xs bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 overflow-hidden"
              >
                {/* Header */}
                <div className="px-4 py-3 flex justify-between items-center border-b border-gray-200/50">
                  <h1 className="text-sm font-semibold text-gray-800">
                    {language === 'en' ? 'Clear Tasks' : '清空任务'}
                  </h1>
                  <button
                    onClick={() => {
                      setShowClearConfirm(false)
                      setPendingClearIds(new Set())
                    }}
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-xs text-gray-700 mb-2">
                    {language === 'en' 
                      ? `Are you sure you want to clear ${pendingClearIds.size} task(s)?`
                      : `确定要清空 ${pendingClearIds.size} 个任务吗？`
                    }
                  </p>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {Array.from(pendingClearIds).map(id => {
                      const todo = todos.find(t => t.id === id)
                      return todo ? (
                        <div key={id} className="text-[10px] text-gray-600 truncate">
                          • {todo.text}
                        </div>
                      ) : null
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-4 py-3 border-t border-gray-200/50 bg-gray-50/30 flex gap-2">
                  <button
                    onClick={() => {
                      setShowClearConfirm(false)
                      setPendingClearIds(new Set())
                    }}
                    className="flex-1 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 font-semibold text-xs hover:bg-gray-50 transition-all active:scale-[0.98]"
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
                className="w-full max-w-xs bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 overflow-hidden"
              >
                {/* Header */}
                <div className="px-4 py-3 flex justify-between items-center border-b border-gray-200/50">
                  <div className="flex items-center gap-2">
                    <h1 className="text-sm font-semibold text-gray-800">
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
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                  {/* Time Sort */}
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 mb-2 uppercase">
                      {language === 'en' ? 'Time' : '时间'}
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSortOptions({ ...sortOptions, time: sortOptions.time === 'asc' ? undefined : 'asc' })
                        }}
                        className={`flex-1 px-3 py-2 rounded-lg font-semibold text-[10px] transition-all flex items-center justify-center gap-1 ${
                          sortOptions.time === 'asc'
                            ? 'bg-violet-500 text-white'
                            : 'bg-white/50 text-gray-600 hover:bg-white/70'
                        }`}
                      >
                        <ArrowUp size={12} />
                        {language === 'en' ? 'Ascending' : '升序'}
                      </button>
                      <button
                        onClick={() => {
                          setSortOptions({ ...sortOptions, time: sortOptions.time === 'desc' ? undefined : 'desc' })
                        }}
                        className={`flex-1 px-3 py-2 rounded-lg font-semibold text-[10px] transition-all flex items-center justify-center gap-1 ${
                          sortOptions.time === 'desc'
                            ? 'bg-violet-500 text-white'
                            : 'bg-white/50 text-gray-600 hover:bg-white/70'
                        }`}
                      >
                        <ArrowDown size={12} />
                        {language === 'en' ? 'Descending' : '降序'}
                      </button>
                    </div>
                  </div>

                  {/* Priority Sort */}
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 mb-2 uppercase">
                      {language === 'en' ? 'Priority' : '优先级'}
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSortOptions({ ...sortOptions, priority: sortOptions.priority === 'asc' ? undefined : 'asc' })
                        }}
                        className={`flex-1 px-3 py-2 rounded-lg font-semibold text-[10px] transition-all flex items-center justify-center gap-1 ${
                          sortOptions.priority === 'asc'
                            ? 'bg-violet-500 text-white'
                            : 'bg-white/50 text-gray-600 hover:bg-white/70'
                        }`}
                      >
                        <ArrowUp size={12} />
                        {language === 'en' ? 'Low to High' : '低到高'}
                      </button>
                      <button
                        onClick={() => {
                          setSortOptions({ ...sortOptions, priority: sortOptions.priority === 'desc' ? undefined : 'desc' })
                        }}
                        className={`flex-1 px-3 py-2 rounded-lg font-semibold text-[10px] transition-all flex items-center justify-center gap-1 ${
                          sortOptions.priority === 'desc'
                            ? 'bg-violet-500 text-white'
                            : 'bg-white/50 text-gray-600 hover:bg-white/70'
                        }`}
                      >
                        <ArrowDown size={12} />
                        {language === 'en' ? 'High to Low' : '高到低'}
                      </button>
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 mb-2 uppercase">
                      {language === 'en' ? 'Status' : '状态'}
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSortOptions({ ...sortOptions, completed: sortOptions.completed === true ? undefined : true })
                        }}
                        className={`flex-1 px-3 py-2 rounded-lg font-semibold text-[10px] transition-all ${
                          sortOptions.completed === true
                            ? 'bg-violet-500 text-white'
                            : 'bg-white/50 text-gray-600 hover:bg-white/70'
                        }`}
                      >
                        {language === 'en' ? 'Completed' : '已完成'}
                      </button>
                      <button
                        onClick={() => {
                          setSortOptions({ ...sortOptions, uncompleted: sortOptions.uncompleted === true ? undefined : true })
                        }}
                        className={`flex-1 px-3 py-2 rounded-lg font-semibold text-[10px] transition-all ${
                          sortOptions.uncompleted === true
                            ? 'bg-violet-500 text-white'
                            : 'bg-white/50 text-gray-600 hover:bg-white/70'
                        }`}
                      >
                        {language === 'en' ? 'Uncompleted' : '未完成'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-4 py-3 border-t border-gray-200/50 bg-gray-50/30 flex gap-2">
                  <button
                    onClick={() => {
                      setSortOptions({})
                      setShowSortMenu(false)
                    }}
                    className="flex-1 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 font-semibold text-xs hover:bg-gray-50 transition-all active:scale-[0.98]"
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
                    className="flex-1 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white font-semibold text-xs shadow-md shadow-violet-500/30 transition-all active:scale-[0.98]"
                  >
                    {language === 'en' ? 'Confirm' : '确定'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}

export default App
