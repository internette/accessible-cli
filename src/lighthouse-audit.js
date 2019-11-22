const execSync = require('child_process').execSync;
const path = require('path');
const join = path.join;
const unlinkSync = require('fs').unlinkSync;
const appDir = path.resolve('package.json').replace('/package.json', '');

module.exports = function(args){
  let { url, config, reportsFolder } = args;
  const lighthouseReport = join(reportsFolder, 'lighthouseReport.json');
  const perfTestLightHouseConfig = require(config).lighthouse;

  const errors = [];

  try {
    require.resolve("lighthouse");
  } catch (e) {
    execSync('npm install lighthouse --save');
  }
  execSync( join(appDir, 'node_modules/.bin/lighthouse') + ' ' + url + ' --output=json --output-path=' + lighthouseReport + ' --quiet --chrome-flags="--headless"');
  
  const audits = require(lighthouseReport).audits;
  
  for (let audit of Object.keys(perfTestLightHouseConfig)) {
    if (audits[audit].score !== perfTestLightHouseConfig[audit]) {
      const auditObj = {
        title: audits[audit].title,
        requiredScore: perfTestLightHouseConfig[audit],
        score: audits[audit].score,
        url: audits[audit].description
          .split("[Learn more](")[1]
          .replace(").", "")
      };
      errors.push(auditObj);
    }
  }
  unlinkSync(lighthouseReport);
  return errors
}