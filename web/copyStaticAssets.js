const shell = require('shelljs')
shell.rm('-R', '../node_server/dist')
shell.cp('-R', './dist', '../node_server/dist')