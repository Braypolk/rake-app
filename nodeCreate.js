import fs from 'fs';
import YAML from 'yaml';

// Replace 'input.yaml' with the path to your YAML file
const yamlFilePath = '/Users/braypolkinghorne/Documents/code/Rake/provider-gcp/package/crds/compute.gcp.upbound.io_backendservices.yaml';
const yamlContent = fs.readFileSync(yamlFilePath, 'utf8');

const doc = YAML.parse(yamlContent);
const kind = doc.spec.names.kind;
console.log(kind);
const properties = doc.spec.versions[0].schema.openAPIV3Schema.properties.spec.properties.forProvider.properties;

// Helper function to generate input fields
function generateInputField(propertyName, propertyDetails) {
    if (propertyDetails.type === 'boolean') {
        return `<input
            type="checkbox"
            name="${propertyName}State"
            on:change={(evt) => {
                data.${propertyName} = evt.target?.checked;
            }}
        />`;
    } else {
        return `<input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.${propertyName} = evt.target?.value;}}
        value={data.${propertyName}}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />`;
    }
}

let scriptMarkup = `<script>
    import NodeTemplate from "$lib/nodeComponents/NodeTemplate.svelte";
    import { ${kind.toLowerCase()}Data } from "$lib/nodeComponents/nodeData";
    export let data = ${kind.toLowerCase()}Data;
</script>`;

const nodeData = {name:""};
Object.entries(properties).map(([propertyName, propertyDetails]) => {
    nodeData[propertyName] = propertyDetails.type === 'boolean' ? false : ''
});

console.log(nodeData);

// Generate the markup for each property
let propertiesMarkup = Object.entries(properties).map(([propertyName, propertyDetails]) => {
    return `
    <div class="property">
      <span class="property-${propertyName}">${propertyName}</span>
      <span class="info-icon" title="${propertyDetails.description || ''}">ℹ</span>
      ${generateInputField(propertyName, propertyDetails)}
    </div>
  `;
}).join('\n');

// Combine everything into the Svelte component's code
let svelteComponent = `${scriptMarkup}

<NodeTemplate type="${kind}" provider="compute" data={data}>
${propertiesMarkup}
</NodeTemplate>

<style>
  :global(.svelte-flow__node-${kind}) {
    background-color: rgba(131, 131, 131, 0.539);
    border: 3px solid rgb(200, 200, 200);
    border-radius: 1rem;
  }
  .info-icon {
    /* Your CSS styles */
    cursor: help; /* Change the cursor to indicate hoverable */
  }
</style>`;
// Replace 'Component.svelte' with the desired output file path
fs.writeFileSync(`/Users/braypolkinghorne/Documents/code/Rake/rake-app/src/lib/nodeComponents/${kind}Node.svelte`, svelteComponent);

console.log('Svelte component created successfully.');






function objectToString(obj) {
    const isObject = val => typeof val === 'object' && val !== null;

    let objString = '{\n';
    for (const [key, value] of Object.entries(obj)) {
        let valueString = JSON.stringify(value);
        objString += `  ${key}: ${valueString},\n`;
    }
    objString += '}';
    return objString;
}

// File path of the file you want to modify
let filePath = '/Users/braypolkinghorne/Documents/code/Rake/rake-app/src/lib/nodeComponents/nodeData.ts';

// Read the current content of the file
let fileContent = fs.readFileSync(filePath, 'utf8');

// Data to be added
let dataToAdd = `\nexport let ${kind.toLowerCase()}Data = ${objectToString(nodeData)};\n`;

// Find the location of 'nodeTypeToDataMap' and split the content
let indexOfNodeTypeToDataMap = fileContent.indexOf('export const nodeTypeToDataMap');
if (indexOfNodeTypeToDataMap !== -1) {
    // Insert new data above 'nodeTypeToDataMap'
    const updatedContent = [
        fileContent.slice(0, indexOfNodeTypeToDataMap).trimEnd(),
        dataToAdd,
        fileContent.slice(indexOfNodeTypeToDataMap)
    ].join('\n');

    // Write the updated content back to the file
    fs.writeFileSync(filePath, updatedContent);

    console.log('Data added above nodeTypeToDataMap successfully.');
}
else {
    console.error('Could not find the nodeTypeToDataMap declaration.');
}









fileContent = fs.readFileSync(filePath, 'utf8');

// This regex matches the nodeTypeToDataMap object declaration and captures the contents
let nodeTypeToDataMapRegex = /(export\s+const\s+nodeTypeToDataMap\s+=\s+{)([^]*?)(};)/;

// Check if the nodeTypeToDataMap export is found in the file
if (nodeTypeToDataMapRegex.test(fileContent)) {
    // Replace the matched group with new content, adding the Firewall data
    fileContent = fileContent.replace(nodeTypeToDataMapRegex, (match, p1, p2, p3) => {
        // If the Firewall key already exists, don't add it again
        if (p2.includes(`${kind}:`)) {
            return match; // Return the original match if Firewall is already there
        } else {
            // Add the Firewall data before the closing }
            return `${p1}${p2}    ${kind}: ${kind.toLowerCase()}Data,\n${p3}`;
        }
    });

    // Write the updated content back to the file
    fs.writeFileSync(filePath, fileContent);

    console.log('nodeTypeToDataMap updated successfully.');
} else {
    console.error('Could not find the nodeTypeToDataMap export in the file.');
}







filePath = '/Users/braypolkinghorne/Documents/code/Rake/rake-app/src/lib/nodeComponents/nodeComponents.js';



// Read the current content of the file
fileContent = fs.readFileSync(filePath, 'utf8');

// Data to be added
dataToAdd = `import ${kind}Node from './${kind}Node.svelte';\n`;

// Find the location of 'nodeTypeToDataMap' and split the content
indexOfNodeTypeToDataMap = fileContent.indexOf('export const nodeTypes');
if (indexOfNodeTypeToDataMap !== -1) {
    // Insert new data above 'nodeTypeToDataMap'
    const updatedContent = [
        fileContent.slice(0, indexOfNodeTypeToDataMap).trimEnd(),
        dataToAdd,
        fileContent.slice(indexOfNodeTypeToDataMap)
    ].join('\n');

    // Write the updated content back to the file
    fs.writeFileSync(filePath, updatedContent);

    console.log('Data added above nodeTypes successfully.');
}
else {
    console.error('Could not find the nodeTypes declaration.');
}





fileContent = fs.readFileSync(filePath, 'utf8');

// This regex matches the nodeTypeToDataMap object declaration and captures the contents
nodeTypeToDataMapRegex = /(export\s+const\s+nodeTypes\s+=\s+{)([^]*?)(};)/;

// Check if the nodeTypeToDataMap export is found in the file
if (nodeTypeToDataMapRegex.test(fileContent)) {
    // Replace the matched group with new content, adding the Firewall data
    fileContent = fileContent.replace(nodeTypeToDataMapRegex, (match, p1, p2, p3) => {
        // If the Firewall key already exists, don't add it again
        if (p2.includes(`${kind}:`)) {
            return match; // Return the original match if Firewall is already there
        } else {
            // Add the Firewall data before the closing }
            return `${p1}${p2}  ${kind}: ${kind}Node,\n${p3}`;
        }
    });

    // Write the updated content back to the file
    fs.writeFileSync(filePath, fileContent);

    console.log('nodeTypes updated successfully.');
} else {
    console.error('Could not find the nodeTypes export in the file.');
}
















filePath = '/Users/braypolkinghorne/Documents/code/Rake/rake-app/src/routes/Sidebar.svelte';

// Read the current content of the file
fileContent = fs.readFileSync(filePath, 'utf8');

// Data to be added
dataToAdd = `    <div
        class="${kind.toLowerCase()} blob"
        on:dragstart={(event) => onDragStart(event, "${kind}")}
        draggable={true}
        >
            ${kind}
        </div>`;

// Find the location of 'nodeTypeToDataMap' and split the content
indexOfNodeTypeToDataMap = fileContent.indexOf('<!-- END OF NODES -->');
if (indexOfNodeTypeToDataMap !== -1) {
    // Insert new data above 'nodeTypeToDataMap'
    const updatedContent = [
        fileContent.slice(0, indexOfNodeTypeToDataMap).trimEnd(),
        dataToAdd,
        fileContent.slice(indexOfNodeTypeToDataMap)
    ].join('\n');

    // Write the updated content back to the file
    fs.writeFileSync(filePath, updatedContent);

    console.log('Data added above nodeTypes successfully.');
}
else {
    console.error('Could not find the nodeTypes declaration.');
}









filePath = '/Users/braypolkinghorne/Documents/code/Rake/rake-app/src/lib/nodes-edges.ts';

// Read the current content of the file
fileContent = fs.readFileSync(filePath, 'utf8');

// Data to be added
dataToAdd = `  '${kind}': 99,`;

// Find the location of 'nodeTypeToDataMap' and split the content
indexOfNodeTypeToDataMap = fileContent.indexOf('// END OF SORT ORDER');
if (indexOfNodeTypeToDataMap !== -1) {
    // Insert new data above 'nodeTypeToDataMap'
    const updatedContent = [
        fileContent.slice(0, indexOfNodeTypeToDataMap).trimEnd(),
        dataToAdd,
        fileContent.slice(indexOfNodeTypeToDataMap)
    ].join('\n');

    // Write the updated content back to the file
    fs.writeFileSync(filePath, updatedContent);

    console.log('Data added above nodeTypes successfully.');
}
else {
    console.error('Could not find the nodeTypes declaration.');
}