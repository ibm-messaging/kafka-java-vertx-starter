const core = require("@actions/core");
const fs = require("fs");

async function calculateBundle() {
  try {
    const fileSize =
      Math.round(
        (fs.statSync("./src/main/resources/webroot/main.bundle.js")["size"] /
          1024.0) *
          100
      ) / 100;

    core.setOutput("bundle_size", `${fileSize}KB`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

calculateBundle();
