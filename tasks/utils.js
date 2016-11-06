'use strict';

var argv = require('yargs').argv;

exports.getEnvName = function () {
    console.log("***** DEBUG_JWIR3: Build information: ");
    console.log(argv);
    return argv.env || 'development';
};

exports.beepSound = function () {
    process.stdout.write('\u0007');
};
