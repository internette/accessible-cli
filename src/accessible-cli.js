// #!/usr/bin/env node

let lighthouse, webhint, webaimWave;
const execSync = require('child_process').execSync;
const join = require('path').join;
const process = require('process');
const cwd = process.cwd;
const args = process.argv;
const mkdirp = require('mkdirp');
const fs = require('fs');

// Flags
let tools = args.filter(arg => arg.indexOf('--tools') > -1);
tools = tools.length > 0 ? tools[0].replace('--tools=', '') : [];
if(tools.length > 0 ){
    tools = tools.indexOf(',') > -1 ? tools.split(',') : [tools];
}
let url = args.filter(arg => arg.indexOf('--url') > -1);
url = url.length > 0 ? url[0].replace('--url=', '') : 'http://localhost:4000';

let envPath = args.filter(arg => arg.indexOf('--envPath') > -1 );
envPath = envPath.length > 0 ? envPath[0].replace('--envPath=', '') : './';
envPath = join(cwd(), envPath);

// This is where all generated reports will be stored
const reportsFolder = join(cwd(), 'accessible-cli-reports');
mkdirp(reportsFolder);

const completeReport = {};

const config = join(cwd(), "./accessibility-config.json");

if(tools.indexOf('lighthouse') > -1){
    lighthouse = require('./lighthouse-audit')({ url, config });
    completeReport['lighthouse'] = lighthouse;
}
if(tools.indexOf('wave') > -1){
    wave = require('./wave-audit')({ url, config, envPath });
    completeReport['wave'] = wave;
}

fs.writeFileSync(join(reportsFolder, 'accessibility.json'), JSON.stringify(completeReport, null, 2), {encoding:'utf8',flag:'w'});