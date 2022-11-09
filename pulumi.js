const fs = require('fs');
const YAML = require('js-yaml');

const parametersString = process.env.PARAMETERS
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

// YAML files to create
const yamlFiles = {
    "Pulumi.yaml": pulumi,
    "Pulumi.dev.yaml": stack,
    "Pulumi.test.yaml": stack,
    "Pulumi.staging.yaml" : stack,
    "Pulumi.prod.yaml": stack,
}

// Directory (Submodule Name)
const submodulePath = "pulumi"

// Creating files
let fileNames = Object.keys(yamlFiles);
fileNames.forEach(fileName => {
    const json = yamlFiles[fileName];
    const yaml = YAML.dump(json);
    fs.writeFileSync(fileName, yaml, function (err) {
        if (err) throw err;
    })
})
