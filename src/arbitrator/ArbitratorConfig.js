import { remote } from 'electron';
import jetpack from 'fs-jetpack';
import { secret } from './secret';

export var ArbitratorConfig = {
  /**
   * Set this value to the Google Web Application Client ID you generated when
   * creating a new OAuth2 permission in your Google Developer Console.
   */

  // NOTE: These values should all be injected, based on the appropriate
  //       environment, during the build.
  'google_client_id': secret.googleClientId,
  'google_client_secret': secret.googleClientSecret
};
