import React from "react";

export default function PrivacyPage() {
  const updated = new Date().toISOString().slice(0, 10);
  return (
    <main className="flex-1 mx-auto text-left panel-wide glass-panel">
      {/* Hero Section */}
      <section className="flex flex-col items-center p-8 mb-8">
        <h1 className="text-3xl font-semibold">Privacy Policy</h1>
        <p className="mt-2 text-grey-40/80">Last updated: {updated}</p>
      </section>

      <div className="space-y-2">
        {/* Sections */}

        <section className="p-6 text-gray-300">
          <h2 className="mb-2 text-xl font-medium">Introduction</h2>
          <p>
            This Privacy Policy explains how Lexi ("we", "us", "lexiapp.space")
            collects, uses, stores, and discloses personal data when you use our
            website and services. We comply with major privacy laws including
            GDPR (EU), CCPA (California), and other applicable regulations. For
            questions, contact:{" "}
            <a
              href="mailto:legal@lexiapp.space"
              className="text-gray-200 underline"
            >
              legal@lexiapp.space
            </a>
            .
          </p>
        </section>

        <section className="p-6 text-gray-300">
          <h2 className="mb-2 text-xl font-medium">Data We Collect</h2>
          <ul className="pl-6 space-y-2 list-disc">
            <li>
              Account data: email address, username, display name, and email
              verification status. Passwords are stored as a hashed value.
            </li>
            <li>
              Profile data: profile image URL, bio, and other profile fields the
              user provides.
            </li>
            <li>
              Generated content and activity: rephraser inputs and outputs,
              activity logs, quiz/test attempts, and other usage metadata. Some
              content may be persisted and can be shared publicly if you opt in.
            </li>
            <li>
              Authentication/session data: account and session records used by
              NextAuth. Cookies are used for sessions.
            </li>
            <li>
              Technical and usage data: IP address, browser/user agent, device
              info, and logs.
            </li>
            <li>
              Cookie and tracking data: see our{" "}
              <a href="/legal/cookies" className="text-gray-200 underline">
                Cookie Policy
              </a>
              .
            </li>
          </ul>
        </section>

        <section className="p-6 text-gray-300">
          <h2 className="mb-2 text-xl font-medium">How We Use Your Data</h2>
          <ul className="pl-6 space-y-2 list-disc">
            <li>To operate and improve the service</li>
            <li>Authenticate users and manage accounts</li>
            <li>
              Send transactional emails (verification, password reset, welcome)
            </li>
            <li>Provide profile and sharing features</li>
            <li>Security, fraud prevention, and abuse detection</li>
            <li>Comply with legal obligations</li>
          </ul>
          <p className="mt-2">
            When you mark content as public or create a share link, that content
            becomes accessible to anyone with the link.
          </p>
        </section>

        <section className="p-6 text-gray-300">
          <h2 className="mb-2 text-xl font-medium">Third-Party Processors</h2>
          <ul className="pl-6 space-y-2 list-disc">
            <li>Database provider (PostgreSQL or managed host)</li>
            <li>Email sending via Microsoft Graph / Office 365 APIs</li>
            <li>
              Object storage (S3-compatible provider such as MinIO or AWS S3)
              for avatar and file uploads. Uploaded files may be returned as
              public URLs.
            </li>
            <li>
              Other integrations (if enabled): analytics, social login, etc.
            </li>
          </ul>
          <p className="mt-2">
            These processors may store and process personal data on our behalf.
            See their privacy policies for details.
          </p>
        </section>

        <section className="p-6 text-gray-300">
          <h2 className="mb-2 text-xl font-medium">International Transfers</h2>
          <p>
            Your data may be stored or processed in countries outside your own.
            We take steps to ensure appropriate safeguards are in place for
            international transfers, as required by GDPR and other laws.
          </p>
        </section>

        <section className="p-6 text-gray-300">
          <h2 className="mb-2 text-xl font-medium">Retention & Security</h2>
          <p>
            Data is retained as needed to provide the service, comply with legal
            obligations, and support security. We use technical and
            organizational measures to protect data. Passwords are hashed before
            storage. Do not upload sensitive personal information to content you
            intend to share publicly.
          </p>
        </section>

        <section className="p-6 text-gray-300">
          <h2 className="mb-2 text-xl font-medium">
            Your Rights (GDPR, CCPA, etc.)
          </h2>
          <ul className="pl-6 space-y-2 list-disc">
            <li>Access: You can request a copy of your personal data.</li>
            <li>Correction: You can request correction of inaccurate data.</li>
            <li>
              Deletion: You can request deletion of your data ("right to be
              forgotten").
            </li>
            <li>
              Portability: You can request export of your data in a portable
              format.
            </li>
            <li>
              Opt-out: You can opt out of certain data uses (e.g., marketing,
              analytics).
            </li>
            <li>
              Non-discrimination: We will not discriminate against you for
              exercising your rights.
            </li>
          </ul>
          <p className="mt-2">
            To exercise these rights, contact{" "}
            <a
              href="mailto:legal@lexiapp.space"
              className="text-gray-200 underline"
            >
              legal@lexiapp.space
            </a>
            . We may require verification of your identity before fulfilling
            requests.
          </p>
        </section>

        <section className="p-6 text-gray-300">
          <h2 className="mb-2 text-xl font-medium">Children's Privacy</h2>
          <p>
            Lexi does not knowingly collect personal information from children
            under the age required by law in your jurisdiction. If you believe a
            child has provided us with personal data, please contact us to
            request deletion.
          </p>
        </section>

        <section className="p-6 text-gray-300">
          <h2 className="mb-2 text-xl font-medium">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be
            posted on this page with an updated revision date. Continued use of
            Lexi after changes means you accept the revised policy.
          </p>
        </section>

        <section className="p-6 text-gray-300">
          <h2 className="mb-2 text-xl font-medium">Contact</h2>
          <p>
            If you have any questions about this Privacy Policy or your rights,
            please contact us at{" "}
            <a
              href="mailto:legal@lexiapp.space"
              className="text-gray-200 underline"
            >
              legal@lexiapp.space
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
