import { onIntegrate } from '@/actions/integrations'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  searchParams: {
    code: string
    error?: string
    error_description?: string
  }
}

const Page = async ({ searchParams: { code, error, error_description } }: Props) => {
  // Handle Instagram OAuth errors
  if (error) {
    console.error('Instagram OAuth error:', error, error_description);
    return redirect(`/error?message=${encodeURIComponent(error_description || error)}`);
  }

  if (!code) {
    console.error('No authorization code received');
    return redirect('/error?message=No authorization code received');
  }

  console.log('Received authorization code:', code);
  
  try {
    const user = await onIntegrate(code.split('#_')[0])
    console.log('Integration result:', user);

    if (user.status === 200) {
      const firstname = user.data?.firstname || 'User';
      const lastname = user.data?.lastname || '';
      return redirect(`/dashboard/${firstname}${lastname}/integrations`);
    } else {
      // Handle different error cases
      switch (user.status) {
        case 401:
          return redirect(`/error?message=${encodeURIComponent('Authentication failed. Please make sure you have a business account.')}`);
        case 404:
          return redirect(`/error?message=${encodeURIComponent('Instagram account already connected.')}`);
        default:
          return redirect(`/error?message=${encodeURIComponent(user.error || 'Failed to connect Instagram account')}`);
      }
    }
  } catch (error) {
    console.error('Integration error:', error);
    return redirect('/error?message=Failed to connect Instagram account. Please try again.');
  }
}

export default Page
