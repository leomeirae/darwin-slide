'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const checkUser = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error checking user:', error.message)
      }
    } finally {
      setIsLoading(false)
    }
  }, [supabase.auth, router])

  useEffect(() => {
    checkUser()
  }, [checkUser])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-white/60">
          Manage your application settings
        </p>
      </div>

      {/* Content */}
      <div className="bg-[#111111] border border-white/5 rounded-xl p-6">
        <h2 className="text-lg font-medium text-white mb-4">General Settings</h2>
        <p className="text-white/60">Configure your application preferences</p>
      </div>
    </div>
  )
} 