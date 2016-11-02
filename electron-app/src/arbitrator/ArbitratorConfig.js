import { remote } from 'electron';
import jetpack from 'fs-jetpack';
import { secret } from './secret';
import { app } from 'electron';

var appDir = jetpack.cwd(app.getAppPath());

export var ArbitratorConfig = {
  /**
   * Set this value to the Google Web Application Client ID you generated when
   * creating a new OAuth2 permission in your Google Developer Console.
   */
  'google_client_id': secret.googleClientId,
  'google_client_secret': secret.googleClientSecret,
  // 'google_api_key': secret.googleAPIKey,
  'version_number': appDir.read('package.json', 'json').version
};
