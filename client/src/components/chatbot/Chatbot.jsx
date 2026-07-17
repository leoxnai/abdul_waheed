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
        strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
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
            className="fixed bottom-28 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 h-[400px] sm:h-[500px] rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col h-full bg-card border border-white/10 backdrop-blur-xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-gradient-primary">
                <div className="flex items-center space-x-3">
                  <FaRobot className="text-background text-lg" />
                  <div>
                    <p className="text-background font-bold text-sm">AI Assistant</p>
                    <p className="text-background/70 text-xs">Online</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-background/80 hover:text-background transition-colors">
                  <FaTimes />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                        msg.role === 'user'
                          ? 'bg-primary text-background rounded-br-sm'
                          : 'bg-white/5 text-white rounded-bl-sm'
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
                    <div className="bg-white/5 p-3 rounded-2xl rounded-bl-sm">
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
                        className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray hover:text-white hover:border-primary/50 transition-all duration-300">
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-white/5">
                <div className="flex space-x-2">
                  <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-gray/50" />
                  <button onClick={() => handleSend()} disabled={isLoading}
                    className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-background hover:shadow-lg transition-all duration-300 disabled:opacity-50">
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
