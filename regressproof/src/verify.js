const { execFile } = require("node:child_process");
const { lstat, mkdir, mkdtemp, rm, symlink } = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { promisify } = require("node:util");

const execFileAsync = promisify(execFile);

async function executeVerificationFlow(config, gitContext) {
  const worktreePath = await mkdtemp(path.join(os.tmpdir(), "regressproof-"));
  const timeoutMs = config.checks.commandTimeoutMs || 300000;
  let baselineMode = config.baseline?.mode || "full_snapshot";

  try {
    let baseline = [];
    if (baselineMode !== "skip") {
      try {
        await createBaselineSnapshot(
          gitContext.repoRoot,
          gitContext.baselineRef,
          worktreePath,
          baselineMode,
          gitContext.targetPaths || [],
          config.baseline?.supportPaths || [],
        );
        await mirrorDependencies(gitContext.repoRoot, worktreePath);
        baseline = await runCheckList(config.checks.quick, worktreePath, timeoutMs);
      } catch (error) {
        if (baselineMode === "path_snapshot" && isMissingPathspecError(error)) {
          baselineMode = "skip";
          baseline = [];
        } else {
          throw error;
        }
      }
    }
    const current = await runCheckList(config.checks.quick, gitContext.repoRoot, timeoutMs);

    return {
      completed: true,
      baselineWorktree: worktreePath,
      baselineMode,
      changedFiles: gitContext.changedFiles,
      baseline,
      current,
    };
  } finally {
    await rm(worktreePath, { recursive: true, force: true });
  }
}

function isMissingPathspecError(error) {
  const stderr = typeof error?.stderr === "string" ? error.stderr : "";
  return stderr.includes("did not match any files");
}

async function runCheckList(commands, cwd, timeoutMs) {
  const results = [];

  for (const command of commands) {
    const startedAt = Date.now();
    try {
      await execCommand(command, cwd, timeoutMs);
      results.push({
        command,
        cwd,
        status: "passed",
        exitCode: 0,
        durationMs: Date.now() - startedAt,
      });
    } catch (error) {
      const timedOut = error.killed || error.signal === "SIGTERM";
      results.push({
        command,
        cwd,
        status: timedOut ? "timed_out" : "failed",
        exitCode: typeof error.code === "number" ? error.code : 1,
        durationMs: Date.now() - startedAt,
        stderr: takeSnippet(error.stderr),
        stdout: takeSnippet(error.stdout),
        signal: error.signal || "",
      });
    }
  }

  return results;
}

async function execCommand(command, cwd, timeoutMs) {
  return execFileAsync("/bin/zsh", ["-lc", command], {
    cwd,
    timeout: timeoutMs,
    maxBuffer: 1024 * 1024 * 10,
  });
}

async function createBaselineSnapshot(
  repoRoot,
  baselineRef,
  outputDir,
  baselineMode,
  targetPaths,
  supportPaths = [],
) {
  const archivePath = path.join(outputDir, "baseline.tar");
  const args = ["archive", "--format=tar", "-o", archivePath, baselineRef];
  if (baselineMode === "path_snapshot" && Array.isArray(targetPaths) && targetPaths.length > 0) {
    const allPaths = [...new Set([...targetPaths, ...supportPaths])];
    args.push("--", ...allPaths);
  }

  await execFileAsync("git", args, {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024 * 10,
  });

  await execFileAsync("tar", ["-xf", archivePath, "-C", outputDir], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024 * 10,
  });

  await rm(archivePath, { force: true });
}

async function mirrorDependencies(repoRoot, snapshotRoot) {
  await maybeLink(repoRoot, snapshotRoot, "node_modules");
}

async function maybeLink(repoRoot, snapshotRoot, relativePath) {
  const source = path.join(repoRoot, relativePath);
  const target = path.join(snapshotRoot, relativePath);

  try {
    const stats = await lstat(source);
    if (!stats.isDirectory() && !stats.isSymbolicLink()) {
      return;
    }
  } catch {
    return;
  }

  await mkdir(path.dirname(target), { recursive: true });

  try {
    await symlink(source, target);
  } catch {
    // Best-effort link only.
  }
}

function takeSnippet(value) {
  if (!value || typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, 1200);
}

module.exports = {
  executeVerificationFlow,
};
