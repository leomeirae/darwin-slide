import { create } from 'zustand'

interface ChatStore {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  toggleChat: () => void
}

export const useChatStore = create<ChatStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
})) 