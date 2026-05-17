import { NextResponse } from "next/server";
import { fetchReleases, isLatestRelease } from "@/lib/github/changelog";

// Change these to your repo owner/name
const OWNER = "CodeMeAPixel";
const REPO = "Lexi";

export async function GET() {
  try {
    const releases = await fetchReleases(OWNER, REPO);
    const releasesWithLatest = releases.map((r) => ({
      ...r,
      isLatest: isLatestRelease(releases, r),
    }));
    return NextResponse.json({
      ok: true,
      releases: releasesWithLatest,
    });
  } catch (err) {
    console.error("changelog API error", err);
    return NextResponse.json(
      {
        error: "Failed to fetch changelog",
      },
      {
        status: 500,
      },
    );
  }
}
