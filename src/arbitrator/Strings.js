import jetpack from 'fs-jetpack'; // module loaded from npm

export var Strings = jetpack.cwd(__dirname).read('Strings.json', 'json');
