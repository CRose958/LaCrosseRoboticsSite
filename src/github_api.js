// GitHub API integration for auto-push (Cloudflare Worker fetch)
// NOTE: Store your GitHub token in a secret or env var in production!
const GITHUB_REPO = 'CRose958/LaCrosseRoboticsSite';
const GITHUB_BRANCH = 'TEST';
const GITHUB_API = 'https://api.github.com';
const GITHUB_TOKEN = 'YOUR_GITHUB_TOKEN_HERE'; // TODO: Use env var/secret

export async function pushFileToGitHub(filename, content, author) {
  // 1. Get the latest commit SHA for the branch
  const branchRes = await fetch(`${GITHUB_API}/repos/${GITHUB_REPO}/git/refs/heads/${GITHUB_BRANCH}`, {
    headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
  });
  const branchData = await branchRes.json();
  const latestCommitSha = branchData.object.sha;

  // 2. Get the tree SHA
  const commitRes = await fetch(`${GITHUB_API}/repos/${GITHUB_REPO}/git/commits/${latestCommitSha}`, {
    headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
  });
  const commitData = await commitRes.json();
  const baseTreeSha = commitData.tree.sha;

  // 3. Create a new blob for the file
  const blobRes = await fetch(`${GITHUB_API}/repos/${GITHUB_REPO}/git/blobs`, {
    method: 'POST',
    headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, encoding: 'utf-8' })
  });
  const blobData = await blobRes.json();

  // 4. Create a new tree with the updated file
  const treeRes = await fetch(`${GITHUB_API}/repos/${GITHUB_REPO}/git/trees`, {
    method: 'POST',
    headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      base_tree: baseTreeSha,
      tree: [{ path: filename, mode: '100644', type: 'blob', sha: blobData.sha }]
    })
  });
  const treeData = await treeRes.json();

  // 5. Create a new commit
  const commitMsg = `Admin edit: ${filename} by ${author || 'admin'}`;
  const newCommitRes = await fetch(`${GITHUB_API}/repos/${GITHUB_REPO}/git/commits`, {
    method: 'POST',
    headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: commitMsg,
      tree: treeData.sha,
      parents: [latestCommitSha]
    })
  });
  const newCommitData = await newCommitRes.json();

  // 6. Update the branch ref to point to the new commit
  await fetch(`${GITHUB_API}/repos/${GITHUB_REPO}/git/refs/heads/${GITHUB_BRANCH}`, {
    method: 'PATCH',
    headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ sha: newCommitData.sha })
  });

  return { ok: true };
}
