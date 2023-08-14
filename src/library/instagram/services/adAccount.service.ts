import * as adsSdk from 'facebook-nodejs-business-sdk';

const isDevMode = process.env.NODE_ENV === 'development';

export const get = async (accessToken: string) => {
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(isDevMode);
  const account = new adsSdk.User('me');

  const fields = ['id', 'name', 'instagram_accounts', 'saved_audiences'];
  const params = { limit: 500 };

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
      name: account._data.name,
      saved_audiences: account._data.saved_audiences,
    };
  });

  return adAccountsWithInstagram;
};
