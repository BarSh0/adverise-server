import * as adsSdk from 'facebook-nodejs-business-sdk';

const isDevMode = process.env.NODE_ENV === 'development';

export const get = async (accessToken: string, adAccountId: string) => {
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(isDevMode);
  const account = new adsSdk.User('me');

  const fields = ['id', 'name', 'instagram_accounts{username,profile_pic}', 'saved_audiences'];
  const params = {};

  const adAccounts = await account.getAdAccounts(fields, params).catch((err) => {
    console.error(`Error in getting ad accounts`);
    throw err;
  });
  console.info(`Getting ad accounts`);

  let adAccountsWithInstagram = adAccounts.filter((account) => {
    return account._data.instagram_accounts && account._data.instagram_accounts.data.length > 0;
  });

  adAccountsWithInstagram = adAccountsWithInstagram.map((account) => {
    return {
      id: account._data.id,
      instagram_accounts: account._data.instagram_accounts.data,
    };
  });

  let pages = adAccountsWithInstagram.find((account) => account.id === adAccountId)?.instagram_accounts;

  pages = pages.map((page: any) => {
    return {
      pageId: page.id,
      name: page.username,
      picture: page.profile_pic,
    };
  });

  return pages;
};
