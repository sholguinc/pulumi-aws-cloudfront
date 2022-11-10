// Initializing Stacks
const { exec } = require('node:child_process')
import { stackNames } from "./pulumi.mjs";

const organization = process.env.ORGANIZATION;

stackNames.forEach(stack => {
    const stackToInit = organization ? `${organization}/${stack}` : stack;
    const command =  `pulumi stack init ${stackToInit}`;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.log(stderr)
        } else {
            console.log(`Successfully created ${stackToInit} stack \n`)
        }
    })
})