import crypto from 'crypto';
import { DeviceInfoSingleton } from './DeviceInfo';

export var QuickCrypto = function() {
  var self = this;
  var deviceInfo = DeviceInfoSingleton.instance;
  self.mMachineKeyPromise = deviceInfo.getEncryptedDeviceKey();
}

QuickCrypto.prototype = {
  mMachineKeyPromise: null, // This is a Promise to a machine key, not an actual one.

  encrypt: function(aData) {
    return new Promise((resolve, reject) => {
      var self = this;
      self.mMachineKeyPromise.then((machineKey) => {
        const cipher = crypto.createCipher('aes192', machineKey);

        var encrypted = '';
        cipher.on('readable', () => {
          var data = cipher.read();
          if (data) {
            encrypted += data.toString('hex');
          }
        });

        cipher.on('end', () => {
          resolve(encrypted);
        });

        cipher.write(aData);
        cipher.end();
      });
    });
  },

  decrypt: function(aEncryptedString) {
    var self = this;
    return new Promise((resolve, reject) => {
      self.mMachineKeyPromise.then((machineKey) => {
        const decipher = crypto.createDecipher('aes192', machineKey);

        var decrypted = '';
        decipher.on('readable', () => {
          var data = decipher.read();
          if (data) {
            decrypted += data.toString('utf8');
          }
        });

        decipher.on('end', () => {
          resolve(decrypted);
        });

        decipher.write(aEncryptedString, 'hex');
        decipher.end();
      });
    });
  }
};
