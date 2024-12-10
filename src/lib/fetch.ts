import axios from 'axios'

export const refreshToken = async (token: string) => {
  const refresh_token = await axios.get(
    `${process.env.INSTAGRAM_BASE_URL}/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`
  )

  return refresh_token.data
}

export const sendDM = async (
  userId: string,
  recieverId: string,
  prompt: string,
  token: string
) => {
  console.log('sending message')
  return await axios.post(
    `${process.env.INSTAGRAM_BASE_URL}/v21.0/${userId}/messages`,
    {
      recipient: {
        id: recieverId,
      },
      message: {
        text: prompt,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
}

export const sendPrivateMessage = async (
  userId: string,
  recieverId: string,
  prompt: string,
  token: string
) => {
  console.log('sending message')
  return await axios.post(
    `${process.env.INSTAGRAM_BASE_URL}/${userId}/messages`,
    {
      recipient: {
        comment_id: recieverId,
      },
      message: {
        text: prompt,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
}


export const generateTokens = async (code: string) => {
  try {
    console.log('Starting token generation with code:', code);
    
    // Exchange the code for a short-lived access token
    const shortTokenRes = await fetch('https://graph.facebook.com/v21.0/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.INSTAGRAM_CLIENT_ID as string,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET as string,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXT_PUBLIC_HOST_URL}/callback/instagram`,
        code: code,
      }),
    });

    const shortTokenData = await shortTokenRes.json();
    console.log('Short token response:', shortTokenData);

    if (!shortTokenData.access_token) {
      console.error('Short token error:', shortTokenData);
      throw new Error(shortTokenData.error?.message || 'Failed to get short-lived access token');
    }

    // Exchange short-lived token for a long-lived token
    const longTokenRes = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${
        process.env.INSTAGRAM_CLIENT_ID
      }&client_secret=${
        process.env.INSTAGRAM_CLIENT_SECRET
      }&fb_exchange_token=${shortTokenData.access_token}`
    );

    const longTokenData = await longTokenRes.json();
    console.log('Long token response:', longTokenData);

    if (!longTokenData.access_token) {
      console.error('Long token error:', longTokenData);
      throw new Error('Failed to get long-lived access token');
    }

    return {
      access_token: longTokenData.access_token,
      token_type: longTokenData.token_type,
      expires_in: longTokenData.expires_in,
    };
  } catch (error) {
    console.error('Error in generateTokens:', error);
    throw error;
  }
};
