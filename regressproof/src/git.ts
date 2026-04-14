import { execFile } from "node:child_process";
import { promisify } from "node:util";

import type { GitContext } from "./types";

const execFileAsync = promisify(execFile);

export async function collectGitContext(baselineRef: string): Promise<GitContext> {
  const repoRoot = await git(["rev-parse", "--show-toplevel"]);
  const currentBranch = await git(["rev-parse", "--abbrev-ref", "HEAD"]);
  const headCommit = await git(["rev-parse", "HEAD"]);
  const changedFilesOutput = await gitOptional([
    "diff",
    "--name-only",
    `${baselineRef}...HEAD`,
  ]);

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
  };
}

async function git(args: string[]): Promise<string> {
  const { stdout } = await execFileAsync("git", args, { encoding: "utf8" });
  return stdout.trim();
}

async function gitOptional(args: string[]): Promise<string> {
  try {
    return await git(args);
  } catch {
    return "";
  }
}
