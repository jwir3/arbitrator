import { expect } from 'chai';
import { QuickCrypto } from '../arbitrator/QuickCrypto';

describe ('Quick Cryptological Functions', function() {
  var quickCrypto = new QuickCrypto();
  it ("should be able to decrypt a previously encrypted password", function(done) {
    var expectedPassword = 'somePasswordThatMayOrMayNotBeSecure';
    quickCrypto.encrypt(expectedPassword)
      .then((encryptedVersion) => {
        expect(encryptedVersion).to.not.be.empty;
        quickCrypto.decrypt(encryptedVersion)
          .then((decryptedVersion) => {
            expect(decryptedVersion).to.not.be.empty;
            expect(expectedPassword).to.eq(decryptedVersion);
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

  it ("should be able to encrypt a password", function(done) {
    quickCrypto.encrypt('somePasswordThatMayOrMayNotBeSecure')
      .then((encryptedVersion) => {
        expect(encryptedVersion).to.not.be.empty;
        done();
      })
      .catch((error) => {
        done(error);
      });
  });
});
