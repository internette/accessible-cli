const execSync = require('child_process').execSync;
const join = require('path').join;
const cwd = require('process').cwd;
const unlinkSync = require('fs').unlinkSync;

const reportsFolder = join(cwd(), 'accessible-cli-reports');
let waveReport = join(reportsFolder, 'WAVE.json');

module.exports = function(args){
    let { url, envPath, config } = args;

    const reportsFolder = join(cwd(), 'accessible-cli-reports');
    
    execSync(`npm install webaim-wave --save`);
    execSync(`webaim-wave --url=${url} --envPath=${envPath} --output=${reportsFolder}`);

    const perfTestWaveConfig = require(config).wave;
    const audits = require(waveReport).categories;
    const tests = [];
    const errors = [];

    for (let audit of Object.keys(perfTestWaveConfig)) {
        const auditObj = {
          title: audits[audit].description,
          requiredScore: perfTestWaveConfig[audit],
          score: audits[audit].count,
          items: audits[audit].items
        };
        tests.push(auditObj);
        if (audits[audit].count !== perfTestWaveConfig[audit]) {
          errors.push(auditObj);
        }
    }
    unlinkSync(waveReport);
    return  {
        tests: tests,
        errors: errors
    }
}
