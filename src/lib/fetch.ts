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
    
    // Exchange the code for an access token using Instagram's endpoint
    const tokenRes = await fetch(process.env.INSTAGRAM_TOKEN_URL as string, {
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

    const tokenData = await tokenRes.json();
    console.log('Token response:', tokenData);

    if (!tokenData.access_token) {
      console.error('Token error:', tokenData);
      throw new Error(tokenData.error?.message || 'Failed to get access token');
    }

    // Get the long-lived token
    const longLivedTokenRes = await fetch(`${process.env.INSTAGRAM_BASE_URL}/refresh_access_token?grant_type=ig_refresh_token&access_token=${tokenData.access_token}`);
    const longLivedTokenData = await longLivedTokenRes.json();

    if (!longLivedTokenData.access_token) {
      console.error('Long-lived token error:', longLivedTokenData);
      throw new Error('Failed to get long-lived access token');
    }

    return {
      access_token: longLivedTokenData.access_token,
      token_type: 'bearer',
      expires_in: longLivedTokenData.expires_in,
    };
  } catch (error) {
    console.error('Error in generateTokens:', error);
    throw error;
  }
};
