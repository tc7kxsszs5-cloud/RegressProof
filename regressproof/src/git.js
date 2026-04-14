const { execFile } = require("node:child_process");
const { promisify } = require("node:util");

const execFileAsync = promisify(execFile);

async function collectGitContext(baselineRef, repoPath, config = {}) {
  const repoRoot = await git(["rev-parse", "--show-toplevel"], repoPath);
  const currentBranch = await git(["rev-parse", "--abbrev-ref", "HEAD"], repoPath);
  const headCommit = await git(["rev-parse", "HEAD"], repoPath);
  const diffArgs = [
    "diff",
    "--name-only",
    baselineRef,
    "HEAD",
  ];

  if (Array.isArray(config.targetPaths) && config.targetPaths.length > 0) {
    diffArgs.push("--", ...config.targetPaths);
  }

  const changedFilesOutput = await gitOptional(diffArgs, repoPath);

  const changedFiles = changedFilesOutput
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    repoRoot,
    currentBranch,
    headCommit,
    baselineRef,
    changedFiles,
    targetPaths: config.targetPaths || [],
  };
}

async function git(args, cwd) {
  const { stdout } = await execFileAsync("git", args, { encoding: "utf8", cwd });
  return stdout.trim();
}

async function gitOptional(args, cwd) {
  try {
    return await git(args, cwd);
  } catch {
    return "";
  }
}

module.exports = {
  collectGitContext,
};
