const execSync = require('child_process').execSync;
const join = require('path').join;
const unlinkSync = require('fs').unlinkSync;
const process = require('process');
const cwd = process.cwd;

const reportsFolder = join(cwd(), 'accessible-cli-reports');
const lighthouseReport = join(reportsFolder, 'lighthouseReport.json');

module.exports = function(args){
  let { url, config } = args;
  const perfTestLightHouseConfig = require(config).lighthouse;
  
  const tests = [];
  const errors = [];
  
  execSync('npm install lighthouse --save');
  execSync( join(cwd(), 'node_modules/.bin/lighthouse') + ' ' + url + ' --output=json --output-path=' + lighthouseReport + ' --quiet --chrome-flags="--headless"');
  
  const audits = require(lighthouseReport).audits;
  
  for (let audit of Object.keys(perfTestLightHouseConfig)) {
    const auditObj = {
      title: audits[audit].title,
      requiredScore: perfTestLightHouseConfig[audit],
      score: audits[audit].score,
      url: audits[audit].description
        .split("[Learn more](")[1]
        .replace(").", "")
    };
    tests.push(auditObj);
    if (audits[audit].score !== perfTestLightHouseConfig[audit]) {
      errors.push(auditObj);
    }
  }
  unlinkSync(lighthouseReport);
  return  {
    tests: tests,
    errors: errors
  }
}