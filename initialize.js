const fs = require('fs');
const YAML = require('js-yaml');
const { exec } = require('node:child_process')

const parametersString = process.env.PULUMI_PARAMETERS
const parameters = JSON.parse(parametersString)

// Pulumi.yaml
const pulumi = {
    name: parameters.projectName,
    description: parameters.projectDescription,
    runtime: "nodejs",
}

// Stack Keys
const keys = {
    awsRegionKey: 'aws:region',
    projectNameKey: `${pulumi.name}:projectName`,
    errorFileKey: `${pulumi.name}:errorDocument`,
    indexFileKey: `${pulumi.name}:indexDocument`,
    distPathKey: `${pulumi.name}:path`,
}

// Pulumi.{stack}.yaml
const stack = {
    config: {
        [keys.awsRegionKey]: parameters.awsRegion,
        [keys.projectNameKey]: pulumi.name,
        [keys.indexFileKey]: parameters.indexFile,
        [keys.errorFileKey]: parameters.errorFile,
        [keys.distPathKey]: parameters.distPath,
    }
}

// Stacks
const stackFiles = {
    dev: "Pulumi.dev.yaml",
    test: "Pulumi.test.yaml",
    staging: "Pulumi.staging.yaml",
    prod: "Pulumi.prod.yaml",
}

// YAML files to create
const yamlFiles = {
    "Pulumi.yaml": pulumi,
    [stackFiles.dev]: stack,
    [stackFiles.test]: stack,
    [stackFiles.staging] : stack,
    [stackFiles.prod]: stack,
}

// Creating files
let fileNames = Object.keys(yamlFiles);
fileNames.forEach(fileName => {
    const json = yamlFiles[fileName];
    const yaml = YAML.dump(json);
    fs.writeFileSync(fileName, yaml, function (err) {
        if (err) throw err;
    })
})

// Initializing Stacks
const stackNames = Object.keys(stackFiles)
stackNames.forEach(stack => {
    const command =  `pulumi stack init ${stack}`;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.log(stderr)
        } else {
            console.log(`Successfully created ${stack} stack \n`)
        }
    })
})