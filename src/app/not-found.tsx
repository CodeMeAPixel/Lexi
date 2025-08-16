import React from "react";
import ErrorPage from "@/components/core/ErrorPage";
import Navbar from "@/components/core/Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex items-center justify-center w-full mt-24">
        <ErrorPage
          title="Page not found"
          message={`We couldn't find the page you're looking for. It may have been moved or deleted.`}
          primaryLabel="Go home"
        />
      </main>
    </>
  );
}
