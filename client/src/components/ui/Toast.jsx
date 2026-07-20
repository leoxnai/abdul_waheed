import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi'

const ToastContext = createContext()

export function useToast() {
  return useContext(ToastContext)
}

export function showToast(message, type = 'success') {
  // Global helper that dispatches to the provider
  window.__toast?.({ message, type })
}

export default function Toast() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ message, type = 'success' }) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  useEffect(() => {
    window.__toast = addToast
    return () => { window.__toast = null }
  }, [addToast])

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col space-y-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className={`pointer-events-auto flex items-center space-x-3 px-5 py-3 rounded-xl shadow-xl border ${
              toast.type === 'success'
                ? 'bg-[#FFF2E8] border-[#F47A20]/20 text-[#F47A20]'
                : 'bg-[#FFF8F2] border-[#EFE5DA] text-[#6B7280]'
            } backdrop-blur-xl`}
          >
            {toast.type === 'success' ? (
              <FiCheckCircle size={18} />
            ) : (
              <FiAlertCircle size={18} />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
            >
              <FiX size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
