import Twit from 'twit';
import twitterCred from './twitterCred';

// Replace with your actual Twitter API credentials
const config = {
  consumer_key: twitterCred.consumer_key,
  consumer_secret: twitterCred.consumer_secret,
  access_token: twitterCred.access_token_key,
  access_token_secret: twitterCred.access_token_secret,
};

// Initialize Twit client with your credentials
const twitClient = new Twit(config);

// Function to get the Twitter profile picture URL by user_id
async function getProfilePictureUrl(user_id: string): Promise<string | null> {
  try {
    // Get the user object using the users/show endpoint
    const { data } = await twitClient.get('users/show', { user_id });

    console.log(data);

    // Extract the profile picture URL and remove "_normal" to get the original size image
    // const profilePictureUrl = data?.profile_image_url_https?.replace('_normal', '');

    return null;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Replace the user_id with the one you have in your data
const user_id = '756201191646691328';

// Call the function to get the profile picture URL
getProfilePictureUrl(user_id)
  .then((profilePictureUrl) => {
    if (profilePictureUrl) {
      console.log('Twitter Profile Picture URL:', profilePictureUrl);
    } else {
      console.log('Unable to get the profile picture URL.');
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
