import { remote } from 'electron';
import env from '../env';

export var ArbitratorConfig = {
  /**
   * Set this value to the Google Web Application Client ID you generated when
   * creating a new OAuth2 permission in your Google Developer Console.
   */

  // NOTE: These values should all be injected, based on the appropriate
  //       environment, during the build.
  'google_client_id': env.google_client_id,
  'google_client_secret': env.google_client_secret,
  'google_api_key': env.google_api_key,

  // Feature flags below this line.
  'feature_arbiter_sports_login': false,
};
