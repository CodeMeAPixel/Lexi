"use client";

import React from "react";
import ErrorPage from "@/components/core/ErrorPage";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  // Log the error to the console for devs
  console.error(error);

  return (
    <main className="flex items-center justify-center w-full mt-24">
      <ErrorPage
        title="Something went wrong"
        message={error?.message || "An unexpected error occurred."}
        primaryLabel="Try again"
        onPrimary={reset}
      />
    </main>
  );
}
