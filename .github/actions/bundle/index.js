const core = require("@actions/core");
const fs = require("fs");

const builtFiles = [{
  fileName: 'main.bundle.js',
  humanReadableName: 'Kafka Starter App custom UI code bundle size:'
}, {
  fileName: 'libs.bundle.js',
  humanReadableName: 'Dependancy UI code bundle size:'
}, {
  fileName: 'styles.bundle.css',
  humanReadableName: 'Kafka Starter App css bundle size:'
}];

async function calculateBundle() {
  try {

    const builtBundlesFeedback = builtFiles.reduce((previousBundleText, {fileName, humanReadableName}) => {
      const fileSize =
      Math.round(
        (fs.statSync(`./src/main/resources/webroot/${fileName}`)["size"] /
          1024.0) *
          100
      ) / 100;
      return `${previousBundleText} ${humanReadableName} ${fileSize}KB\n`;
    }, '');


    core.setOutput("bundle_size", builtBundlesFeedback);
  } catch (error) {
    core.setFailed(error.message);
  }
}

calculateBundle();
