const core = require("@actions/core");
const github = require("@actions/github");

const pull_request_number = github.context.payload.pull_request.number;
const repo = github.context.repo;
const github_token = core.getInput("GITHUB_TOKEN");
const octokit = new github.GitHub(github_token);

async function getCommentID() {
  let { data: comments } = await octokit.issues.listComments({
    ...repo,
    issue_number: pull_request_number,
  });

  let res = comments.filter((comment) => {
    return comment.user.login === "github-actions[bot]";
  });

  if (res.length > 0) {
    return res[0].id;
  } else {
    return null;
  }
}

async function comment(message) {
  try {
    const commentID = await getCommentID();

    if (commentID) {
      octokit.issues.updateComment({
        ...repo,
        issue_number: pull_request_number,
        comment_id: commentID,
        body: message,
      });
    } else {
      octokit.issues.createComment({
        ...repo,
        issue_number: pull_request_number,
        body: message,
      });
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function createComment() {
  try {
    const bundleSize = core.getInput("BUNDLE_SIZE");
    const testCoverage = core.getInput("TEST_COVERAGE");

    const commentText = `# PR Report\n ## Bundle Size\n${bundleSize}\n## Test Coverage\n${testCoverage}\n\nTriggered by commit: ${github.context.sha}`;
    await comment(commentText);
  } catch (error) {
    core.setFailed(error.message);
  }
}

createComment();
