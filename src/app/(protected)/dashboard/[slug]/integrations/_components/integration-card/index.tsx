'use client'
import { disconnectIntegration, onOAuthInstagram } from '@/actions/integrations'
import { onUserInfo } from '@/actions/user'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useMutationData } from '@/hooks/use-mutation-data'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import React from 'react'

type Props = {
  title: string
  description: string
  icon: React.ReactNode
  strategy: 'INSTAGRAM' | 'CRM'
}

const IntegrationCard = ({ description, icon, strategy, title }: Props) => {
  const [open, setOpen] = React.useState(false)
  const queryClient = useQueryClient()
  const onInstaOAuth = () => onOAuthInstagram(strategy)

  const { data } = useQuery({
    queryKey: ['user-profile'],
    queryFn: onUserInfo,
  })

  const integrated = data?.data?.integrations.find(
    (integration) => integration.name === strategy
  )

  const { mutate: disconnectMutation, isPending } = useMutationData(
    ['disconnect-integration'],
    async () => {
      if (!integrated?.id) return
      const result = await disconnectIntegration(integrated.id)
      if (result.status === 200) {
        queryClient.invalidateQueries({ queryKey: ['user-profile'] })
        setOpen(false)
      }
      return result
    }
  )

  return (
    <div className="border-2 border-[#3352CC] rounded-2xl gap-x-5 p-5 flex items-center justify-between">
      {icon}
      <div className="flex flex-col flex-1">
        <h3 className="text-xl"> {title}</h3>
        <p className="text-[#9D9D9D] text-base ">{description}</p>
      </div>
      {integrated ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-red-600 text-white rounded-full text-lg hover:bg-red-700 transition duration-100"
            >
              Disconnect
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Disconnect Integration</DialogTitle>
              <DialogDescription>
                Are you sure you want to disconnect this integration? This will remove all associated automations.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => disconnectMutation({})}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {isPending ? 'Disconnecting...' : 'Disconnect'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Button
          onClick={onInstaOAuth}
          className="bg-gradient-to-br text-white rounded-full text-lg from-[#3352CC] font-medium to-[#1C2D70] hover:opacity-70 transition duration-100"
        >
          Connect
        </Button>
      )}
    </div>
  )
}

export default IntegrationCard
