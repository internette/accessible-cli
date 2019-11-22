#!/usr/bin/env node

const args = require('process').argv;
const commands = args.filter(arg => arg === 'create' || arg === 'test');
let flag;
if(commands[0] === 'create'){
    flag = args.filter(arg => arg.indexOf('--') > -1)[0];
}

if(commands.length === 1){
    const command = commands[0];
    if(command === 'test' || command === 'create'){
        if(command === 'test'){
            require('./test.js')();
        } else {
            require('./create.js')(flag);
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