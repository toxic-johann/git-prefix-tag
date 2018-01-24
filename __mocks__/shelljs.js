const shell = require('shelljs');
const fs = require('fs');
const path = require('path');

const originExec = shell.exec;

const gitTagsStdout = fs.readFileSync(path.resolve(__dirname, '../const/git-tags'), 'utf8');

shell.exec = (...args) => {
  if (args[0] !== 'git ls-remote --tags origin') {
    return originExec.bind(shell, ...args);
  }
  return {
    stdout: gitTagsStdout,
  };
};

module.exports = shell;
