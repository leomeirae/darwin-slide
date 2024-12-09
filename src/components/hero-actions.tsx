'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useChatStore } from '@/store/use-chat-store'

export function HeroActions() {
  const { setIsOpen } = useChatStore()

  return (
    <div className="mt-8 flex justify-center gap-4">
      <Button
        size="lg"
        className="bg-blue-600 text-white hover:bg-blue-700"
      >
        <Link href="/dashboard">Comece Agora</Link>
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="border-blue-400 hover:bg-blue-900/50"
        onClick={() => setIsOpen(true)}
      >
        Saiba Mais
      </Button>
    </div>
  )
} 