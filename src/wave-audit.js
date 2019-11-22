const execSync = require('child_process').execSync;
const join = require('path').join;
const unlinkSync = require('fs').unlinkSync;


module.exports = function(args){
    let { url, envPath, config, reportsFolder } = args;
    const waveReport = join(reportsFolder, 'WAVE.json');
    
    try {
      require.resolve("webaim-wave");
    } catch (e) {
      execSync('npm install webaim-wave --save');
    }
    execSync(`${join(cwd(), 'node_modules/.bin/webaim-wave') } --url=${url} --envPath=${envPath} --output=${reportsFolder}`);

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
