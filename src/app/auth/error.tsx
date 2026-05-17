"use client";

import React from "react";
import ErrorPage from "@/components/core/ErrorPage";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log the error to the console for devs
  if (error) console.error(error);

  return (
    <main className="flex items-center justify-center w-full mt-24">
      <ErrorPage
        title="Authorization Failed"
        message="We are unable to log you in at this time, please try again later. If this issue persists, please contact support."
        primaryLabel="Try again"
        onPrimary={reset}
      />
    </main>
  );
}
