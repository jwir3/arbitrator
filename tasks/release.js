'use strict';

var gulp = require('gulp');
var GulpSSH = require('gulp-ssh');
var jetpack = require('fs-jetpack');
var fs = require('fs');

var currentDate = new Date().toISOString();

// The things we need to do are (in order):
// 1. Retrieve the configuration information for the deployment
var releaseConfig = {
  host: 'endor.glasstowerstudios.com',
  port: 22,
  releaseDirectory: '/var/www/arbitrator.glasstowerstudios.com',
  username: 'scottj',
  privateKey: fs.readFileSync('/home/scottj/.ssh/id_rsa'),
  releasesToKeep: 3,
  group: 'www-glasstower',
  permissions: 'ugo+rX'
};

var gulpSSH = new GulpSSH({
  ignoreErrors: false,
  sshConfig: releaseConfig
});

// Create a new release directory with the current timestamp on the server.
var releaseVersion = jetpack.read('app/package.json', 'json').version;
var versionFolderName = releaseVersion;
var fullReleaseDirPath = releaseConfig.releaseDirectory + '/releases/' + versionFolderName;
var currentSymlinkPath = releaseConfig.releaseDirectory + '/current';

function removeDirectories(dirs) {
  var rmDirCommands = [];
  for (var dirIndex in dirs) {
    var nextDir = dirs[dirIndex];
    var removeCommand = 'rm -rf ' + releaseConfig.releaseDirectory + '/releases/' + nextDir;
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
  return gulpSSH.exec(['ls ' + releaseConfig.releaseDirectory + '/releases'])
                .on ('ssh2Data', (chunk) => {
                  let directories = chunk.toString('utf8').split('\n');
                  var lastDir = directories.pop(); // Last directory is an empty newline
                  var index = 0;
                  for (var index = 0; index < directories.length - (releaseConfig.releasesToKeep); index++) {
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
