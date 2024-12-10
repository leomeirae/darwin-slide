import { onIntegrate } from '@/actions/integrations'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  searchParams: {
    code: string
  }
}

const Page = async ({ searchParams: { code } }: Props) => {
  if (code) {
    console.log(code)
    try {
      const user = await onIntegrate(code.split('#_')[0])
      if (user.status === 200) {
        const firstname = user.data?.firstname || 'User'; // Fallback para evitar URL malformada
        const lastname = user.data?.lastname || ''; // Fallback para evitar URL malformada
        return redirect(`/dashboard/${firstname}${lastname}/integrations`)
      }
    } catch (error) {
      console.error('Erro ao integrar:', error)
      // Você pode redirecionar para uma página de erro ou mostrar uma mensagem
    }
  }
  return redirect('/sign-up')
}

export default Page
