#!/usr/bin/env node

const args = require('process').argv;
const commands = args.filter(arg => arg === 'create' || arg === 'test');
let flag;
if(commands[0] === 'create'){
    flag = args.filter(arg => arg.indexOf('--') > -1);
}

if(commands.length === 1){
    const command = commands[0];
    if(command === 'test' || command === 'create'){
        if(command === 'test'){
            require('./test.js')();
        } else {
            if(flag.length === 0){
                throw new Error('Accessible CLI create command requires one of the following flags: --all, --env, --config. Consult documentation for further understanding.');
            } else if (flag.length > 1){
                throw new Error('Accessible CLI create command only takes one flag.')
            } else {
                require('./create.js')(flag[0]);
            }
        }
    } else {
        throw new Error('You can only pass test or create as a command to the Accessible CLI');
    }
} else {
    if(commands.length === 0){
        throw new Error('Please pass either test or create command to the Accessible CLI');
    } else {
        throw new Error('You can only pass one command to the Accessible CLI');
    }
}