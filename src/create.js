module.exports = function(flag = ''){
    // Required node modules and packages
    const fs = require('fs');
    const path = require('path');
    const join = path.join;
    const appDir = path.resolve('package.json').replace('/package.json', '');
    const readline = require('readline');

    // Create config
    if(['--all', '--config'].indexOf(flag) > -1 || flag.length === 0){
        // Create defaults
        const lighthouseDefaults = require('./defaults/lighthouse.json');
        const waveDefaults = require('./defaults/wave.json');
        const webhintDefaults = require('./defaults/webhint.json');
    
        const config = {
            url: "",
            tools: ["lighthouse", "webhint", "wave"],
            envPath: "config/.env",
            outputFolder: "./accessible-cli-reports",
            lighthouse:  lighthouseDefaults,
            wave: waveDefaults,
            webhint: webhintDefaults
        };

        // Checks if file exists before creating a new one
        if(fs.existsSync(path.resolve('accessible-config.json'))){
            // If it does, prompt user
            readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            readline.question(`A configuration file already exists. This will overwrite that file. Are you sure? (y/n) `, (answer) => {
                if(answer === 'y'){
                    fs.writeFileSync(join(appDir, 'accessible-config.json'), JSON.stringify(config, null, 2), {encoding:'utf8',flag:'w'});
                } else {
                    console.log('Configuration file was not created.');
                }
                readline.close();
            })
        } else {
            fs.writeFileSync(join(appDir, 'accessible-config.json'), JSON.stringify(config, null, 2), {encoding:'utf8',flag:'w'});
        }
    }
    // Create env
    if(['--all', '--env'].indexOf(flag) > -1 || flag.length === 0){
        // Create defaults
        const envDefaults = require('./defaults/env.json');
        let envStr = '';
        for(const prop of Object.keys(envDefaults)){
            envStr += `${prop}=default\n`;
        }
        // Checks if file exists before creating a new one
        if(fs.existsSync(path.resolve('.env'))){
            // If it does, prompt user
            readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            readline.question(`An environment file already exists. This will overwrite that file. Are you sure? (y/n) `, (answer) => {
                if(answer === 'y'){
                    fs.writeFileSync(join(appDir, '.env'), envStr.trim(), {encoding:'utf8',flag:'w'});
                } else {
                    console.log('Environment file was not created.');
                }
                readline.close();
            });
        } else {
           fs.writeFileSync(join(appDir, '.env'), envStr.trim(), {encoding:'utf8',flag:'w'});
        }
    }
}