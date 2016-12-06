import gulp from 'gulp';
import { DeploymentException, GulpSSHDeploy } from 'gulp-ssh-deploy';

var options = {
  "host": "endor.glasstowerstudios.com",
  "port": 22,
  "remote_directory": "/var/www/arbitrator.glasstowerstudios.com",
  "source_files": ["dist/*.deb", "dist/*.dmg"],
  "username": "scottj",
  "ssh_key_file": "~/.ssh/id_rsa",
  "releases_to_keep": 3,
  "group": "www-glasstower",
  "permissions": "ugo+rX",
  "package_json_file_path": "app/package.json",
  "package_task": "package"
};

try {
  let deployer = new GulpSSHDeploy(options, gulp);
} catch (exception) {
  exception.printWarning();
}
