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
    // Exchange the code for a short-lived access token
    const shortTokenRes = await fetch('https://api.instagram.com/oauth/access_token', {
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

    if (!shortTokenData.access_token) {
      throw new Error('Failed to get short-lived access token');
    }

    // Exchange short-lived token for a long-lived token
    const longTokenRes = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${
        process.env.INSTAGRAM_CLIENT_SECRET
      }&access_token=${shortTokenData.access_token}`
    );

    const longTokenData = await longTokenRes.json();

    if (!longTokenData.access_token) {
      throw new Error('Failed to get long-lived access token');
    }

    return {
      access_token: longTokenData.access_token,
      token_type: longTokenData.token_type,
      expires_in: longTokenData.expires_in,
    };
  } catch (error) {
    console.error('Error generating tokens:', error);
    throw error;
  }
};
