// Returns true if the given release (by tag or id) is the latest in the list
export function isLatestRelease(
  releases: GithubRelease[],
  release: GithubRelease | string | number,
): boolean {
  if (!Array.isArray(releases) || releases.length === 0) return false;
  const latest = releases.reduce((a, b) =>
    new Date(a.published_at) > new Date(b.published_at) ? a : b,
  );
  if (typeof release === "string") {
    return latest.tag_name === release || latest.name === release;
  } else if (typeof release === "number") {
    return latest.id === release;
  } else {
    return latest.id === release.id;
  }
}
// Simple GitHub client for fetching releases and release bodies
export type GithubRelease = {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  html_url: string;
  author: {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
  };
  assets: any[];
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  updated_at: string;
  tarball_url: string;
  zipball_url: string;
  target_commitish: string;
};

const GITHUB_API = "https://api.github.com";

export async function fetchReleases(
  owner: string,
  repo: string,
): Promise<GithubRelease[]> {
  const url = `${GITHUB_API}/repos/${owner}/${repo}/releases`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      // Optionally add Authorization: `Bearer ...` for private repos
    },
  });

  if (!res.ok) throw new Error("Failed to fetch releases");

  const data = await res.json();

  return Array.isArray(data)
    ? data.map((r) => ({
        id: r.id,
        tag_name: r.tag_name,
        name: r.name,
        body: r.body,
        published_at: r.published_at,
        html_url: r.html_url,
        author: {
          login: r.author?.login,
          id: r.author?.id,
          avatar_url: r.author?.avatar_url,
          html_url: r.author?.html_url,
        },
        assets: r.assets ?? [],
        draft: r.draft,
        prerelease: r.prerelease,
        created_at: r.created_at,
        updated_at: r.updated_at,
        tarball_url: r.tarball_url,
        zipball_url: r.zipball_url,
        target_commitish: r.target_commitish,
      }))
    : [];
}

export async function fetchRelease(
  owner: string,
  repo: string,
  tag: string,
): Promise<GithubRelease | null> {
  const url = `${GITHUB_API}/repos/${owner}/${repo}/releases/tags/${tag}`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
    },
  });

  if (!res.ok) return null;
  const r = await res.json();

  await console.log(r);

  return {
    id: r.id,
    tag_name: r.tag_name,
    name: r.name,
    body: r.body,
    published_at: r.published_at,
    html_url: r.html_url,
    author: {
      login: r.author?.login,
      id: r.author?.id,
      avatar_url: r.author?.avatar_url,
      html_url: r.author?.html_url,
    },
    assets: r.assets ?? [],
    draft: r.draft,
    prerelease: r.prerelease,
    created_at: r.created_at,
    updated_at: r.updated_at,
    tarball_url: r.tarball_url,
    zipball_url: r.zipball_url,
    target_commitish: r.target_commitish,
  };
}
