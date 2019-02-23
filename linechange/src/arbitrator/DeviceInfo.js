import macaddress from 'macaddress';
import os from 'os';
import crypto from 'crypto';

const DEVICE_SINGLETON_KEY = Symbol("DeviceInfo");

var DeviceInfo = function() {

}

DeviceInfo.prototype = {
  mMachineKey: null,
  mMacAddress: null,

  getEncryptedDeviceKey: function() {
    var self = this;
    return new Promise((resolve, reject) => {
      if (self.mMachineKey != null) {
        resolve(self.mMachineKey);
      }

      self.getMachineIdentifier()
        .then((machineId) => {
          self.mMachineKey = crypto.pbkdf2Sync(machineId, os.userInfo().username,
                                               1, 32, 'sha512').toString('hex')
          resolve(self.mMachineKey);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  getMachineIdentifier: function() {
    var self = this;
    return new Promise((resolve, reject) => {
      var osName = self.getOSName();
      var osVersion = self.getOSVersion();
      var cpuModel = self.getCPUModel();
      self.getMacAddress()
      .then((aMacAddress) => {
        resolve(osName + osVersion + cpuModel + aMacAddress);
      })
      .catch((error) => {
        reject(error);
      });
    });
  },

  getOSVersion: function() {
    return os.release();
  },

  getOSName: function() {
    return os.platform();
  },

  getCPUModel: function() {
    return os.cpus()[0].model;
  },

  getMacAddress: function() {
    var self = this;

    return new Promise((resolve, reject) => {
      if (self.mMacAddress) {
        resolve(self.mMacAddress);
      }

      macaddress.one(function(aError, aMac) {
        if (aError) {
          reject (new Error(aError));
        }

        self.mMacAddress = aMac;
        resolve(self.mMacAddress);
      });
    });
  }
};

export var DeviceInfoSingleton = {};

Object.defineProperty(DeviceInfoSingleton, "instance", {
  get: function() {
    if (!global[DEVICE_SINGLETON_KEY]) {
      global[DEVICE_SINGLETON_KEY] = new DeviceInfo();
    }

    return global[DEVICE_SINGLETON_KEY];
  }
});

Object.freeze(DeviceInfoSingleton);
