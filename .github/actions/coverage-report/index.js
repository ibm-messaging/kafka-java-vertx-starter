const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

function comment(message) {
  try {
    const github_token = core.getInput('GITHUB_TOKEN');

    const pull_request_number = github.context.payload.pull_request.number;
    const repo = github.context.repo;
  
    const octokit = new github.GitHub(github_token);
    octokit.issues.createComment({
      ...repo,
      issue_number: pull_request_number,
      body: message
    });
  } catch (error) {
    core.setFailed(error.message)
  }
}

async function formatCoverage() {
  try {
    const coverage = JSON.parse(fs.readFileSync("./ui/coverage/jest/coverage-summary.json"));

    let coverageText = "## Test Coverage Report\n| File | Lines | Statement | Functions | Branches |\n| --- | --- | --- | --- | --- |\n";
  
    const regex = /^\/(.+\/)*(.+)$/;
  
    Object.entries(coverage).forEach(([key,value]) => {
      coverageText += `| ${key != 'total' ? key.match(regex)[2] : 'Total'} | ${value.lines.pct}% | ${value.statements.pct}% | ${value.functions.pct}% | ${value.branches.pct}% |\n` 
    });
  
    comment(coverageText);
  } catch (error) {
    core.setFailed(error.message);
  }
}

formatCoverage();