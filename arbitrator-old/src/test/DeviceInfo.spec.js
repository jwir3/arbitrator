import { expect, assert } from 'chai';
import { DeviceInfoSingleton } from '../arbitrator/DeviceInfo';

var deviceInfo = DeviceInfoSingleton.instance;

describe("Hardware-Specific Device Information Retrieval", function () {
  it ("should retrieve the same encrypted machine key for multiple queries within a single session", function(done) {
    deviceInfo.getEncryptedDeviceKey()
      .then((machineKey1) => {
        expect(machineKey1).to.have.lengthOf(64);
        deviceInfo.getEncryptedDeviceKey()
          .then((machineKey2) => {
            expect(machineKey2).to.have.lengthOf(64);
            expect(machineKey1).to.eq(machineKey2);
            done();
          })
          .catch((error) => {
            done(error);
          });
      })
      .catch((error) => {
        done(error);
      });
  });

  it ("is able to retrieve an encrypted machine key of length 64 bytes", function (done) {
    deviceInfo.getEncryptedDeviceKey()
      .then((machineKey) => {
        expect(machineKey).to.have.lengthOf(64);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it ("is able to retrieve a machine identifer which is a collection of other attributes", function (done) {
    deviceInfo.getMachineIdentifier()
      .then((machineId) => {
        deviceInfo.getMacAddress()
          .then((macAddress) => {
            var expectedMachineId = deviceInfo.getOSName()
              + deviceInfo.getOSVersion()
              + deviceInfo.getCPUModel()
              + macAddress;

              expect(machineId).to.eql(expectedMachineId);
              done();
          })
          .catch((aError) => {
            done(aError);
          });
      })
      .catch((error) => {
        done(error);
      });
  });

  it ("is able to retrieve the OS version", function() {
    expect(deviceInfo.getOSVersion()).to.not.be.null;
  });

  it ("is able to retrieve the OS platform name", function() {
    expect(deviceInfo.getOSName()).to.not.be.null;
  });

  it ("is able to retrieve the CPU model", function () {
    var cpuModel = deviceInfo.getCPUModel();
    expect(cpuModel).to.not.be.null;
  });

  it ("is able to retrieve the device mac address", function(done) {
    deviceInfo.getMacAddress()
    .then((macAddress) => {
      // The device's mac address should be 6 sets of two hexidecimal digits.
      var numSections = macAddress.split(':');
      expect(numSections).to.have.lengthOf(6);
      for (var i = 0; i < numSections.length; i++) {
        var section = numSections[i];
        expect(section).to.have.lengthOf(2);
      }

      done();
    })
    .catch((error) => {
      done(error);
    });
  });
});
