#!/usr/bin/env node

const { readFile } = require("node:fs/promises");

async function main() {
  const args = process.argv.slice(2);
  const bodyFileIndex = args.indexOf("--body-file");
  const bodyFile = bodyFileIndex >= 0 ? args[bodyFileIndex + 1] : "";

  if (!bodyFile) {
    throw new Error("Missing required --body-file argument.");
  }

  const token = process.env.GITHUB_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY;
  const prNumber = process.env.PR_NUMBER;

  if (!token || !repository || !prNumber) {
    throw new Error("GITHUB_TOKEN, GITHUB_REPOSITORY, and PR_NUMBER must be set.");
  }

  const [owner, repo] = repository.split("/");
  if (!owner || !repo) {
    throw new Error(`Invalid GITHUB_REPOSITORY value: ${repository}`);
  }

  const body = await readFile(bodyFile, "utf8");
  const marker = "<!-- regressproof-comment -->";

  const comments = await githubRequest(
    `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`,
    token,
    { method: "GET" },
  );

  const existing = comments.find((comment) => typeof comment.body === "string" && comment.body.includes(marker));

  if (existing) {
    await githubRequest(
      `https://api.github.com/repos/${owner}/${repo}/issues/comments/${existing.id}`,
      token,
      {
        method: "PATCH",
        body: JSON.stringify({ body }),
      },
    );
    process.stdout.write(`Updated RegressProof PR comment ${existing.id}\n`);
    return;
  }

  const created = await githubRequest(
    `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`,
    token,
    {
      method: "POST",
      body: JSON.stringify({ body }),
    },
  );
  process.stdout.write(`Created RegressProof PR comment ${created.id}\n`);
}

async function githubRequest(url, token, options) {
  const response = await fetch(url, {
    method: options.method,
    headers: {
      "Accept": "application/vnd.github+json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "regressproof",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: options.body,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub request failed (${response.status}): ${text}`);
  }

  return response.json();
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`RegressProof PR comment error: ${message}\n`);
  process.exitCode = 1;
});
