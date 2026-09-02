import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal-document";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Technical and commercial disclaimer for Satellite Inference public materials.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <LegalDocument eyebrow="PUBLIC WORKING CONCEPT" title="Technical disclaimer" updated="2 September 2026">
      <section>
        <h2>Preliminary program</h2>
        <p>
          Satellite Inference™ is currently operated by RFID INC, a Delaware corporation. Public
          materials describe an early-stage program, proposed reference missions and preliminary
          analytical assumptions.
        </p>
      </section>
      <section>
        <h2>Not flight-release data</h2>
        <p>
          Nothing published here is manufacturing instruction, supplier specification, external
          quotation, launch reservation, regulatory determination, service-level commitment, or an
          offer to sell securities.
        </p>
      </section>
      <section>
        <h2>Validation required</h2>
        <p>
          Orbit, latency, eclipse, power, battery, solar-array, thermal, schedule, and scale values
          are screening estimates. Mission-grade work requires selected hardware, defined
          interfaces, supplier evidence, workload benchmarks, environmental analysis, regulatory
          review, and systems-engineering verification.
        </p>
      </section>
      <section>
        <h2>Third-party references</h2>
        <p>
          Third-party names and source links provide public context only. They do not imply
          endorsement, partnership, availability, pricing, or technical acceptance.
        </p>
      </section>
    </LegalDocument>
  );
}
