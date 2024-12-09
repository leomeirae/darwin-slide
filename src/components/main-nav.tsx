'use client'

import Link from 'next/link'
import { useChatStore } from '@/store/use-chat-store'
import { Button } from '@/components/ui/button'

export function MainNav() {
  const { setIsOpen } = useChatStore()

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center font-bold text-black">
          li
        </div>
        <span className="text-xl font-semibold text-white">
          IAGO
        </span>
      </div>
      <nav className="hidden space-x-6 text-sm text-blue-200 md:block">
        <Link href="#pricing">Planos</Link>
        <button 
          onClick={() => setIsOpen(true)}
          className="hover:text-white transition-colors"
        >
          Como funciona
        </button>
      </nav>
      <Button className="bg-white hover:bg-white/90">
        <Link href="/dashboard" className="text-black font-medium">Login</Link>
      </Button>
    </div>
  )
} 