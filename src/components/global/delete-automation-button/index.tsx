'use client'

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
import { deleteAutomationAction } from '@/actions/automations'
import { useMutationData } from '@/hooks/use-mutation-data'
import { Loader2, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

type Props = {
  id: string
}

const DeleteAutomationButton = ({ id }: Props) => {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const queryClient = useQueryClient()
  
  const { mutate, isPending } = useMutationData(
    ['delete-automation'],
    async (data: { id: string }) => {
      const result = await deleteAutomationAction(data.id)
      if (result.status === 200) {
        // Optimistically remove the automation from the cache
        queryClient.setQueryData(['user-automations'], (oldData: any) => ({
          ...oldData,
          data: oldData.data.filter((automation: any) => automation.id !== data.id)
        }))
        setOpen(false)
        router.push('/dashboard/LeonardoFranca/automations')
      }
      return result
    },
    'user-automations'
  )

  const handleDelete = () => {
    mutate({ id })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="destructive" 
          size="icon"
          className="rounded-full"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Automation</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this automation? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteAutomationButton 