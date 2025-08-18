import React from "react";

export default function CookiesPage() {
  const updated = new Date().toISOString().slice(0, 10);
  return (
    <main className="flex-1 mx-auto text-left panel-wide glass-panel">
      {/* Hero Section */}
      <section className="flex flex-col items-center p-8 mb-8">
        <h1 className="text-3xl font-semibold">Cookie Policy</h1>
        <p className="mt-2 text-grey-40/80">Last updated: {updated}</p>
      </section>

      <div className="space-y-2">
        {/* Sections */}

        <section className="p-6 text-gray-300">
          <h2 className="mb-2 text-xl font-medium">What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device that help the
            website remember information about your visit, preferences, and
            activity.
          </p>
        </section>

        <section className="p-6 text-gray-300">
          <h2 className="mb-2 text-xl font-medium">Types of Cookies We Use</h2>
          <ul className="pl-6 space-y-2 list-disc">
            <li>
              <strong>Session cookies:</strong> Used for authentication and to
              keep you logged in (NextAuth session cookies). These are necessary
              for the service.
            </li>
            <li>
              <strong>Functional cookies:</strong> Enable features like
              remembering preferences or settings.
            </li>
            <li>
              <strong>Analytics cookies:</strong> If enabled, help us understand
              usage and improve the service. (No analytics provider is enabled
              by default.)
            </li>
            <li>
              <strong>Third-party cookies:</strong> May be set by integrations
              (e.g., Google Analytics, social login). See their policies for
              details.
            </li>
          </ul>
        </section>

        <section className="p-6 text-gray-300">
          <h2 className="mb-2 text-xl font-medium">Third-Party Cookies</h2>
          <p>
            Some features or integrations may use third-party cookies. These are
            managed by the respective providers and subject to their own privacy
            policies. Lexi does not control third-party cookies.
          </p>
        </section>

        <section className="p-6 text-gray-300">
          <h2 className="mb-2 text-xl font-medium">Consent & Opt-Out</h2>
          <p>
            By using Lexi, you consent to the use of necessary cookies. You can
            opt out of optional cookies (such as analytics) via browser settings
            or cookie banners (if enabled). Blocking cookies may affect site
            functionality.
          </p>
        </section>

        <section className="p-6 text-gray-300">
          <h2 className="mb-2 text-xl font-medium">Managing Cookies</h2>
          <p>
            You can control or delete cookies through your browser settings.
            Instructions are available in your browser’s help section. You may
            also use browser extensions to block or manage cookies.
          </p>
        </section>

        <section className="p-6 text-gray-300">
          <h2 className="mb-2 text-xl font-medium">Compliance & Your Rights</h2>
          <p>
            Lexi aims to comply with privacy laws including GDPR, CCPA, and
            ePrivacy Directive. You have the right to request information about
            cookies, opt out of non-essential cookies, and request deletion of
            your data. See our{" "}
            <a href="/legal/privacy" className="text-gray-200 underline">
              Privacy Policy
            </a>{" "}
            for more details.
          </p>
        </section>

        <section className="p-6 text-gray-300">
          <h2 className="mb-2 text-xl font-medium">Contact</h2>
          <p>
            For cookie or privacy inquiries:{" "}
            <a
              href="mailto:legal@lexiapp.space"
              className="text-gray-200 underline"
            >
              legal@lexiapp.space
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
