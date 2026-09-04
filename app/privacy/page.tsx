import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal-document";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy notice for the Satellite Inference public website.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalDocument eyebrow="PUBLIC WEBSITE" title="Privacy notice" updated="4 September 2026">
      <section>
        <h2>Current site</h2>
        <p>
          This is a static informational website hosted through GitHub Pages. It currently has no
          user accounts, forms, advertising, behavioral analytics, tracking pixels, or first-party database.
        </p>
      </section>
      <section>
        <h2>Email and external services</h2>
        <p>
          GitHub may process technical request information, such as an IP address and access logs,
          under its own privacy terms. If you email Satellite Inference, the message and related
          metadata are processed through Google Workspace. Following an external link may expose
          information to that service under its own privacy terms.
        </p>
      </section>
      <section>
        <h2>Future changes</h2>
        <p>
          This notice will be updated before forms, accounts, telemetry, analytics, or other data
          collection features are enabled. Questions may be sent to procurement@satelliteinference.com.
        </p>
      </section>
    </LegalDocument>
  );
}
