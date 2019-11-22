module.exports = function(){
    // Required node modules and packages
    const join = require('path').join;
    const cwd = require('process').cwd;
    const mkdirp = require('mkdirp');
    const fs = require('fs');

    // Config file
    const config = join(cwd(), "./accessibility-config.json");

    // Params
    const configFile = require(config);
    const tools = configFile.tools;
    const url = configFile.url.length > 0 ? configFile.url : 'http://localhost:4000';
    let envPath = configFile.envPath.length > 0 ? configFile.envPath : './.env';
    envPath = envPath.indexOf('./') > - 1 ? join(cwd(), envPath) : envPath;

    // Generated reports location
    let reportsFolder = configFile.outputFolder.length > 0 ? configFile.outputFolder : './accessibility-cli-reports';
    reportsFolder = reportsFolder.indexOf('./') > -1 ? join(cwd(), reportsFolder) : reportsFolder;
    mkdirp(reportsFolder);

    // Build report object and write to file
    const completeReport = {};

    if(tools.indexOf('lighthouse') > -1){
        const lighthouse = require('./lighthouse-audit')({ url, config, reportsFolder });
        completeReport['lighthouse'] = lighthouse;
    }
    if(tools.indexOf('wave') > -1){
        const wave = require('./wave-audit')({ url, config, envPath, reportsFolder });
        completeReport['wave'] = wave;
    }
    if(tools.indexOf('webhint') > -1){
        const forceSync = require('sync-rpc');
        const webhint = forceSync(require.resolve('./webhint-audit'));
        completeReport['webhint'] = webhint({ url, config, envPath, reportsFolder });
    }
    fs.writeFileSync(join(reportsFolder, 'accessibility.json'), JSON.stringify(completeReport, null, 2), {encoding:'utf8',flag:'w'});
}