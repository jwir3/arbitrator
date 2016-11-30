import gulp from 'gulp';
import GulpSSH from 'gulp-ssh';
import gulpUtil from 'gulp-util';
import jetpack from 'fs-jetpack';
import fs from 'fs';
import os from 'os';

var currentDate = new Date().toISOString();
var packageJson = jetpack.read('app/package.json', 'json');

// Retrieve the configuration information for the deployment
var releaseConfig = packageJson.deploy_config;
var privateKeyFile = releaseConfig.private_key_file.replace('~', os.homedir)
if (!releaseConfig) {
  gulpUtil.log(gulpUtil.colors.yellow('Warning:'),
               "deploy_config in package.json not properly configured. You will not be able to deploy.");
} else if (!fs.existsSync(privateKeyFile)) {
  gulpUtil.log(gulpUtil.colors.yellow('Warning:'), "Unable to find private key:",
               gulpUtil.colors.cyan(privateKeyFile),
               "You will not be able to deploy");
} else {
  releaseConfig.privateKey = fs.readFileSync(privateKeyFile);

  var gulpSSH = new GulpSSH({
    ignoreErrors: false,
    sshConfig: releaseConfig
  });

  // Create a new release directory with the current timestamp on the server.
  var releaseVersion = packageJson.version;
  var versionFolderName = releaseVersion;
  var fullReleaseDirPath = releaseConfig.remote_directory + '/releases/' + versionFolderName;
  var currentSymlinkPath = releaseConfig.remote_directory + '/current';

  function removeDirectories(dirs) {
    var rmDirCommands = [];
    for (var dirIndex in dirs) {
      var nextDir = dirs[dirIndex];
      var removeCommand = 'rm -rf ' + releaseConfig.remote_directory + '/releases/' + nextDir;
      rmDirCommands.push(removeCommand);
    }

    gulpSSH.exec(rmDirCommands, { filePath: 'release-' + currentDate + '.log'})
           .pipe(gulp.dest('logs'));
  }

  gulp.task('makeRemotePath', function() {
    return gulpSSH.exec(['mkdir -p ' + fullReleaseDirPath],
                        { filePath: 'release-' + currentDate + '.log'})
                  .pipe(gulp.dest('logs'));
  });

  gulp.task('transferDistribution', ['package', 'makeRemotePath'], function() {
    // Upload the packaged release to the server.
    return gulp.src(['./dist/*.deb', './dist/*.dmg'])
               .pipe(gulpSSH.dest(fullReleaseDirPath));
  });

  gulp.task('createCurrentSymlink', ['transferDistribution'], function() {
    // Create a symlink to the "current" release.
    return gulpSSH.exec(['rm -f ' + currentSymlinkPath,
                         'ln -s ' + fullReleaseDirPath + " " + currentSymlinkPath],
                        { filePath: 'release-' + currentDate + '.log'})
                  .pipe(gulp.dest('logs'));
  });

  gulp.task('removeOldReleases', ['transferDistribution'], function() {
    var toRemove = [];

    // Delete all old releases, as specified in the configuration.
    return gulpSSH.exec(['ls ' + releaseConfig.remote_directory + '/releases'])
                  .on ('ssh2Data', (chunk) => {
                    let directories = chunk.toString('utf8').split('\n');
                    var lastDir = directories.pop(); // Last directory is an empty newline
                    var index = 0;
                    for (var index = 0; index < directories.length - (releaseConfig.releases_to_keep); index++) {
                      toRemove.push(directories[index]);
                    }

                    removeDirectories(toRemove);
                  });
  });

  gulp.task('setReleaseGroup', ['removeOldReleases'], function() {
    return gulpSSH.exec(['chgrp -R ' + releaseConfig.group + ' ' + fullReleaseDirPath],
                        {filePath: 'release-' + currentDate + '.log'})
                  .pipe(gulp.dest('logs'));
  });

  gulp.task('setReleasePermissions', ['setReleaseGroup'], function() {
    return gulpSSH.exec(['chmod -R ' + releaseConfig.permissions + ' ' + fullReleaseDirPath],
                        {filePath: 'release-' + currentDate + '.log'})
                  .pipe(gulp.dest('logs'));
  });

  gulp.task('release', ['setReleasePermissions'], function () {

  })
}
