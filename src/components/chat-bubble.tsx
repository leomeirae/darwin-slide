'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react'
import { useChat } from 'ai/react'
import { useChatStore } from '@/store/use-chat-store'

const PRESET_QUESTIONS = [
  "Como o IAGO pode me ajudar no Instagram?",
  "É difícil configurar o IAGO?",
  "Quais são os planos e valores do IAGO?"
]

interface Message {
  content: string
  isUser: boolean
}

function formatApiResponse(text: string): string {
  // Convert markdown bold to HTML strong tags and add CTA button
  const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  return `${formattedText}
  
<div class="mt-4 flex justify-start">
  <a href="/dashboard" class="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white text-xs font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200">
    Quero Testar
    <svg class="ml-1.5 -mr-0.5 w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
  </a>
</div>`
}

async function query(question: string) {
  const response = await fetch(
    "https://flowise.darwinai.com.br/api/v1/prediction/327d6b5a-49f0-49f5-9822-ce3e04a747f3",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question })
    }
  )
  const reader = response.body?.getReader()
  if (!reader) return ''

  const decoder = new TextDecoder()
  let result = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      result += decoder.decode(value)
    }
    const jsonResult = JSON.parse(result)
    return formatApiResponse(jsonResult.text || '')
  } catch (error) {
    console.error('Error reading stream:', error)
    return ''
  } finally {
    reader.releaseLock()
  }
}

export default function ChatBubble() {
  const { isOpen, toggleChat } = useChatStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(() => {
    scrollToBottom()
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [messages, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage = inputValue.trim()
    setInputValue('')
    setMessages(prev => [...prev, { content: userMessage, isUser: true }])
    setIsLoading(true)

    try {
      const response = await query(userMessage)
      if (response) {
        setMessages(prev => [...prev, { content: response, isUser: false }])
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { 
        content: 'Sorry, something went wrong. Please try again.', 
        isUser: false 
      }])
    } finally {
      setIsLoading(false)
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }

  const handlePresetQuestion = async (question: string) => {
    if (isLoading) return
    setMessages(prev => [...prev, { content: question, isUser: true }])
    setIsLoading(true)

    try {
      const response = await query(question)
      if (response) {
        setMessages(prev => [...prev, { content: response, isUser: false }])
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { 
        content: 'Sorry, something went wrong. Please try again.', 
        isUser: false 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {!isOpen ? (
        <button
          onClick={toggleChat}
          className="fixed bottom-4 right-4 rounded-2xl px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center gap-2 z-50 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="font-medium">Chat com IAGO</span>
        </button>
      ) : (
        <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col border border-white/20 z-50 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-xl flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">IAGO AI Assistant</h3>
                <p className="text-xs text-white/70">Powered by Darwin AI</p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="h-8 w-8 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-xl flex items-center justify-center transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50 to-white">
            {messages.length === 0 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-4">
                    <Bot className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Como posso ajudar?</h2>
                  <p className="text-sm text-gray-500">Escolha uma das opções abaixo ou faça sua própria pergunta</p>
                </div>
                <div className="grid gap-3">
                  {PRESET_QUESTIONS.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handlePresetQuestion(question)}
                      className="w-full p-4 text-left text-sm bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-indigo-50 border border-gray-200 rounded-xl transition-all duration-200 text-gray-900 font-medium hover:border-blue-200 hover:shadow-lg group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600/10 to-indigo-600/10 flex items-center justify-center group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-200">
                          <Sparkles className="h-4 w-4 text-blue-600 group-hover:text-white" />
                        </div>
                        {question}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!message.isUser && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0">
                    <Bot className="h-5 w-5" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.isUser
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-900 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p 
                    className="text-sm whitespace-pre-wrap leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: message.content }}
                  />
                </div>
                {message.isUser && (
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="bg-white border border-gray-200 text-gray-900 rounded-2xl rounded-bl-none p-4 shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-100">
            <form onSubmit={handleSubmit} className="relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="w-full pl-4 pr-12 py-3 bg-gray-50 hover:bg-gray-100 focus:bg-white text-gray-900 text-sm rounded-xl border border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={isLoading || !inputValue.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 disabled:opacity-50 disabled:hover:text-gray-400 transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
} 