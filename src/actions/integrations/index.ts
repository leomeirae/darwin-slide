'use server'

import { redirect } from 'next/navigation'
import { onCurrentUser } from '../user'
import { createIntegration, getIntegration, deleteIntegration } from './queries'
import { generateTokens } from '@/lib/fetch'
import axios from 'axios'

export const onOAuthInstagram = async (strategy: 'INSTAGRAM' | 'CRM') => {
  if (strategy === 'INSTAGRAM') {
    const scopes = [
      'instagram_basic',
      'instagram_content_publish',
      'instagram_manage_comments',
      'instagram_manage_insights',
      'pages_show_list',
      'pages_read_engagement',
      'business_management'
    ].join(',')

    const authUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${process.env.INSTAGRAM_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_HOST_URL}/callback/instagram&scope=${scopes}&response_type=code`

    return redirect(authUrl)
  }
}

export const onIntegrate = async (code: string) => {
  console.log('Starting integration with code:', code);
  const user = await onCurrentUser()

  try {
    const integration = await getIntegration(user.id)
    console.log('Current integration status:', integration);

    if (!integration || integration.integrations.length === 0) {
      console.log('Generating tokens...');
      const token = await generateTokens(code)
      console.log('Tokens generated:', token);

      if (token && token.access_token) {
        console.log('Getting Instagram user ID...');
        const insta_id = await axios.get(
          `https://graph.facebook.com/v21.0/me?fields=id,instagram_business_account{id}&access_token=${token.access_token}`
        )
        console.log('Instagram response:', insta_id.data);

        if (!insta_id.data.instagram_business_account) {
          console.error('No Instagram business account found');
          return { status: 401, error: 'No Instagram business account found' }
        }

        const today = new Date()
        const expire_date = today.setDate(today.getDate() + 60)
        
        console.log('Creating integration...');
        const create = await createIntegration(
          user.id,
          token.access_token,
          new Date(expire_date),
          insta_id.data.instagram_business_account.id
        )
        console.log('Integration created:', create);
        return { status: 200, data: create }
      }
      console.log('🔴 401: No token generated');
      return { status: 401, error: 'No token generated' }
    }
    console.log('🔴 404: Integration already exists');
    return { status: 404, error: 'Integration already exists' }
  } catch (error) {
    console.log('🔴 500:', error);
    return { status: 500, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export const disconnectIntegration = async (id: string) => {
  await onCurrentUser()
  try {
    const deleted = await deleteIntegration(id)
    if (deleted) {
      return { status: 200, data: 'Integration disconnected successfully' }
    }
    return { status: 404, data: 'Integration not found' }
  } catch (error) {
    console.log('🔴 Error disconnecting integration:', error)
    return { status: 500, data: 'Oops! something went wrong' }
  }
}
