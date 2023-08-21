import axios from 'axios';

export const fetchLongLivedAccessToken = async (accessToken: string) => {
  const result = axios.get('https://graph.facebook.com/oauth/access_token', {
    params: {
      grant_type: 'fb_exchange_token',
      client_id: process.env.FB_APP_ID,
      client_secret: process.env.FB_APP_SECRET,
      fb_exchange_token: accessToken,
    },
  });

  const longLivedAccessToken = (await result).data.access_token;

  return longLivedAccessToken;
};

export const fetchLongLivedAccessTokenForPage = async (pageId: string, accessToken: string) => {
  const result = axios.get(`https://graph.facebook.com/${pageId}`, {
    params: {
      fields: 'access_token',
      access_token: accessToken,
    },
  });

  const longLivedAccessToken = (await result).data.access_token;

  return longLivedAccessToken;
};

export const validateAccessToken = async (accessToken: string) => {
  const result = axios.get('https://graph.facebook.com/debug_token', {
    params: {
      input_token: accessToken,
      access_token: `${process.env.FB_APP_ID}|${process.env.FB_APP_SECRET}`,
    },
  });

  const isValid = (await result).data.data.is_valid;

  return isValid;
};
