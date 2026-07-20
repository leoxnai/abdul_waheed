import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaRobot, FaTimes, FaPaperPlane, FaSpinner, FaExternalLinkAlt } from 'react-icons/fa'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useApp } from '../../context/AppContext'
import { adminAPI } from '../../services/api'

const quickReplies = [
  'What services do you offer?',
  'What is your experience?',
  'How can I hire you?',
  'What software do you use?',
]

// Custom link component — renders as a premium button instead of raw URL text
function ChatLink({ href, children }) {
  const label = String(children || '').replace(/^🔗\s*/, '')
  const displayText = label || href?.replace(/^https?:\/\//, '').split('/')[0] || 'Visit Link'

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 my-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-medium hover:bg-primary/20 transition-all duration-200 break-all max-w-full"
    >
      <FaExternalLinkAlt size={10} />
      <span className="truncate">{displayText}</span>
    </a>
  )
}

// Custom Markdown renderer with the link override
function ChatMarkdown({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ChatLink,
        p: ({ children }) => <p className="mb-1 last:mb-0 leading-relaxed">{children}</p>,
        ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 my-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 my-1">{children}</ol>,
        li: ({ children }) => <li className="text-sm">{children}</li>,
        strong: ({ children }) => <strong className="font-semibold text-[#1F2937]">{children}</strong>,
        code: ({ children }) => (
          <code className="px-1.5 py-0.5 rounded bg-white/5 text-xs font-mono">{children}</code>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

export default function Chatbot() {
  const { chatbotConfig } = useApp()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: chatbotConfig?.greeting || '👋 Hi! I\'m Abdul Waheed\'s AI assistant. Ask me anything!' },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (chatbotConfig && chatbotConfig.enabled === false) return null

  const handleSend = async (message) => {
    const userMessage = message || input
    if (!userMessage.trim() || isLoading) return

    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const res = await adminAPI.chat(userMessage)
      setMessages((prev) => [...prev, { role: 'assistant', content: res.data.reply || res.data.message }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I couldn\'t process that. Please email abdulwaheedgraphics097@gmail.com for assistance.' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button id="chatbot-toggle" onClick={() => setIsOpen(!isOpen)} className="hidden" />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-28 left-4 right-4 z-50 h-[420px] overflow-hidden rounded-[1.75rem] border border-[#EFE5DA] bg-[rgba(255,255,255,0.95)] shadow-[0_30px_90px_-40px_rgba(31,31,31,0.35)] sm:left-auto sm:right-6 sm:h-[520px] sm:w-[400px]"
          >
            <div className="flex h-full flex-col backdrop-blur-xl">
              {/* Header */}
              <div className="flex items-center justify-between bg-gradient-primary p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                    <FaRobot className="text-[#FFF8F2] text-lg" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#FFF8F2]">AI Assistant</p>
                    <p className="text-xs text-[#FFF8F2]/80">Online</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-[#FFF8F2]/80 transition-colors hover:text-[#FFF8F2]">
                  <FaTimes />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 space-y-4 overflow-y-auto bg-[#FFF8F2]/70 p-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-[1.2rem] p-3 text-sm ${
                        msg.role === 'user'
                          ? 'rounded-br-sm bg-primary text-[#FFF8F2]'
                          : 'rounded-bl-sm bg-white text-[#1F1F1F] shadow-[0_12px_30px_-20px_rgba(31,31,31,0.3)]'
                      }`}
                      style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                    >
                      {msg.role === 'user' ? (
                        msg.content
                      ) : (
                        <ChatMarkdown content={msg.content} />
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-[1.2rem] rounded-bl-sm bg-white p-3 shadow-[0_12px_30px_-20px_rgba(31,31,31,0.3)]">
                      <FaSpinner className="animate-spin text-primary" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              {messages.length <= 2 && (
                <div className="px-4 pb-2">
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((reply) => (
                      <button key={reply} onClick={() => handleSend(reply)}
                        className="rounded-full border border-[#EFE5DA] bg-white px-3 py-1.5 text-xs text-[#4B5563] transition-all duration-300 hover:border-primary/40 hover:text-primary">
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="border-t border-[#EFE5DA] p-4">
                <div className="flex space-x-2">
                  <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 rounded-xl border border-[#EFE5DA] bg-white px-4 py-2.5 text-sm text-[#1F1F1F] placeholder:text-[#9CA3AF] focus:border-primary focus:outline-none" />
                  <button onClick={() => handleSend()} disabled={isLoading}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-[#FFF8F2] transition-all duration-300 hover:shadow-lg disabled:opacity-50">
                    <FaPaperPlane size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
