import React from "react";

export default function TermsPage() {
  const updated = new Date().toISOString().slice(0, 10);

  return (
    <main className="flex-1 mx-auto text-left panel-wide glass-panel">
      {/* Hero Section */}
      <section className="flex flex-col items-center p-8 mb-8">
        <h1 className="text-3xl font-semibold">Terms of Service</h1>
        <p className="mt-2 text-grey-40/80">Last updated: {updated}</p>
      </section>

      <div className="space-y-2">
        {/* Sections */}

        <section className="p-6 text-gray-300">
          <h2 className="mb-2 text-xl font-medium">Acceptance of Terms</h2>
          <p className="text-grey-40/80">
            By accessing or using Lexi, you agree to be bound by these Terms of
            Service and all applicable laws and regulations. If you do not
            agree, you may not use the service. These Terms apply to all users,
            including visitors, registered users, and contributors.
          </p>
        </section>

        <section className="p-6 text-gray-300">
          <h2 className="mb-2 text-xl font-medium">
            Eligibility & User Accounts
          </h2>
          <p>
            You must be at least 13 years old (or the minimum age required in
            your jurisdiction) to use Lexi. You agree to provide accurate,
            complete, and current information when creating an account. You are
            responsible for maintaining the confidentiality of your login
            credentials and for all activities that occur under your account.
            Notify us immediately of any unauthorized use or security breach.
          </p>
          <p className="mt-2">
            We reserve the right to suspend or terminate accounts that violate
            these Terms or for any reason at our discretion.
          </p>
        </section>

        <section className="p-6 text-gray-300">
          <h2 className="mb-2 text-xl font-medium">User Content & Sharing</h2>
          <p>
            You retain ownership of content you submit, including text, images,
            and other materials. By making content public or creating a share
            link, you grant Lexi a worldwide, non-exclusive, royalty-free
            license to use, display, and distribute that content for the purpose
            of operating and improving the service. You are solely responsible
            for the content you submit and its legality.
          </p>
          <p className="mt-2">
            Do not upload sensitive, confidential, or personal information in
            publicly accessible areas. You may delete your content or account at
            any time, but public content may remain accessible to others who
            have the link.
          </p>
        </section>

        <section className="p-6 text-gray-300">
          <h2 className="mb-2 text-xl font-medium">Prohibited Conduct</h2>
          <ul className="space-y-1 list-disc list-inside">
            <li>
              Using the service for unlawful, fraudulent, or malicious purposes
            </li>
            <li>Harassing, threatening, or abusing other users</li>
            <li>
              Attempting to gain unauthorized access to accounts, data, or
              systems
            </li>
            <li>Uploading harmful code, malware, viruses, or spam</li>
            <li>Impersonating any person or entity</li>
            <li>Violating intellectual property or privacy rights</li>
            <li>Interfering with or disrupting the service or servers</li>
          </ul>
          <p className="mt-2">
            We reserve the right to investigate, remove content, and suspend or
            terminate accounts that violate these rules or the law.
          </p>
        </section>

        <section className="p-6 text-gray-300">
          <h2 className="mb-2 text-xl font-medium">Intellectual Property</h2>
          <p>
            All rights, title, and interest in Lexi’s software, design,
            branding, and content (except user-submitted content) remain the
            property of Lexi or its licensors. You may not copy, modify,
            distribute, or reverse-engineer any part of the service without
            written permission.
          </p>
        </section>

        <section className="p-6 text-gray-300">
          <h2 className="mb-2 text-xl font-medium">
            Third-Party Services & Links
          </h2>
          <p>
            Lexi may contain links to third-party websites or services. We are
            not responsible for the content, privacy policies, or practices of
            third-party services. Your interactions with third-party services
            are governed by their own terms and policies.
          </p>
        </section>

        <section className="p-6 text-gray-300">
          <h2 className="mb-2 text-xl font-medium">
            Service Changes & Termination
          </h2>
          <p>
            Lexi may change, suspend, or discontinue any part of the service at
            any time, with or without notice. We may suspend or terminate your
            account if you violate these Terms, if required by law, or for any
            reason at our discretion. You may stop using Lexi at any time. Upon
            termination, your right to use the service will immediately cease.
          </p>
        </section>

        <section className="p-6 text-gray-300">
          <h2 className="mb-2 text-xl font-medium">
            Disclaimers & Limitation of Liability
          </h2>
          <p>
            The service is provided “as is” and “as available” without
            warranties of any kind, express or implied. Lexi does not guarantee
            uninterrupted or error-free operation, nor the accuracy or
            reliability of any content. To the extent permitted by law, Lexi is
            not liable for indirect, incidental, special, or consequential
            damages arising from your use of the service.
          </p>
        </section>

        <section className="p-6 text-gray-300">
          <h2 className="mb-2 text-xl font-medium">Privacy Policy Reference</h2>
          <p>
            Your use of Lexi is also subject to our{" "}
            <a href="/legal/privacy" className="text-gray-200 underline">
              Privacy Policy
            </a>
            , which explains how we collect, use, and protect your personal
            data.
          </p>
        </section>

        <section className="p-6 text-gray-300">
          <h2 className="mb-2 text-xl font-medium">Dispute Resolution</h2>
          <p>
            In the event of any dispute arising out of or relating to these
            Terms or your use of Lexi, you agree to first contact us to attempt
            to resolve the issue informally. If a resolution cannot be reached,
            disputes will be subject to the laws and jurisdiction specified
            below.
          </p>
        </section>

        <section className="p-6 text-gray-300">
          <h2 className="mb-2 text-xl font-medium">
            Governing Law & Jurisdiction
          </h2>
          <p>
            These Terms are governed by the laws of the jurisdiction where the
            service operator is established. Any disputes arising from these
            Terms or your use of Lexi will be subject to the exclusive
            jurisdiction of the courts in that location. Contact{" "}
            <a
              href="mailto:legal@lexiapp.space"
              className="text-gray-200 underline"
            >
              legal@lexiapp.space
            </a>{" "}
            for legal inquiries.
          </p>
        </section>

        <section className="p-6 text-gray-300">
          <h2 className="mb-2 text-xl font-medium">Contact</h2>
          <p>
            If you have any questions about these Terms, your account, or your
            rights, please contact us at{" "}
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
