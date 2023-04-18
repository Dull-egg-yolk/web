
const { execSync } = require('child_process');

// git 最后一次提交的 Head
const commit = execSync('git show -s --format=%h').toString().trim();
const commitDateObj = execSync('git show -s --format=%cd').toString();
const commitDate = formatTime(commitDateObj);
const buildDate = formatTime();

module.exports = {
  commit,
  commitDate,
  buildDate
};

function formatTime (time = '') {
  const data = time ? new Date(time) : new Date();
  return data.toLocaleString();
}
