const core = require("@actions/core");
const fs = require("fs");

async function formatCoverage() {
  try {
    const coverage = JSON.parse(
      fs.readFileSync("./ui/coverage/jest/coverage-summary.json")
    );

    let coverageText =
      "| File | Lines | Statement | Functions | Branches |\n| --- | --- | --- | --- | --- |\n";

    const regex = /^\/(.+\/)*(.+)$/;

    Object.entries(coverage).forEach(([key, value]) => {
      coverageText += `| ${key != "total" ? key.match(regex)[2] : "Total"} | ${
        value.lines.pct
      }% | ${value.statements.pct}% | ${value.functions.pct}% | ${
        value.branches.pct
      }% |\n`;
    });

    core.setOutput("test_coverage", coverageText);
  } catch (error) {
    core.setFailed(error.message);
  }
}

formatCoverage();
