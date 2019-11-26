const execSync = require('child_process').execSync;
const path = require('path');
const join = path.join;
const unlinkSync = require('fs').unlinkSync;
const appDir = path.resolve('package.json').replace('/package.json', '');

module.exports = function(args){
    let { url, envPath, config, reportsFolder } = args;
    const waveReport = join(reportsFolder, 'WAVE.json');
    
    execSync(`${join(appDir, 'node_modules/.bin/webaim-wave') } --url=${url} --envPath=${envPath} --output=${reportsFolder}`);

    const perfTestWaveConfig = require(config).wave;
    const audits = require(waveReport).categories;
    const errors = [];

    for (let audit of Object.keys(perfTestWaveConfig)) {
      if (audits[audit].count !== perfTestWaveConfig[audit]) {
          const auditObj = {
            title: audits[audit].description,
            requiredScore: perfTestWaveConfig[audit],
            score: audits[audit].count,
            items: audits[audit].items
          };
          errors.push(auditObj);
        }
    }
    unlinkSync(waveReport);
    return  errors
}
