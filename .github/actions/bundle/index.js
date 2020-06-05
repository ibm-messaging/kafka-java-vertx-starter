const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

async function calculateBundle() {
  try {
    const fileSize = Math.round((fs.statSync('./ui/dist/public/main.bundle.js')['size'] / 1024.0) * 100) / 100;

    const github_token = core.getInput('GITHUB_TOKEN');

    const pull_request_number = github.context.payload.pull_request.number;
    const repo = github.context.repo;

    const octokit = new github.GitHub(github_token);
    octokit.issues.createComment({
      ...repo,
      issue_number: pull_request_number,
      body: `## Bundle size report\n ${fileSize}KB`
    });

  } catch (error) {
    core.setFailed(error.message);
  }
}

calculateBundle();