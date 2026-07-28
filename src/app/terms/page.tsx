import type { Metadata } from "next";
import { getCompany } from "@/lib/data";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Hebei Jingshun Auto Parts Co., Ltd.",
};

export default function TermsPage() {
  const company = getCompany();

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8 sm:p-10">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Terms of Service</h1>
          <p className="text-sm text-text-secondary/60 mb-8">
            Last updated: July 2026
          </p>

          <div className="prose prose-invert prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">1. Acceptance of Terms</h2>
              <p className="text-sm text-text-secondary/80 leading-relaxed">
                By accessing and using the {company.name} website, you accept and
                agree to be bound by these Terms of Service. If you do not agree,
                please do not use this website.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">2. Website Use</h2>
              <p className="text-sm text-text-secondary/80 leading-relaxed">
                The content on this website is for general information and business
                communication purposes. Product specifications, images, and
                descriptions are provided for reference and may be updated without
                notice.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">3. Intellectual Property</h2>
              <p className="text-sm text-text-secondary/80 leading-relaxed">
                All content on this website, including text, images, logos, and
                product information, is the property of {company.name} and is
                protected by applicable intellectual property laws. Unauthorized
                reproduction or distribution is prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">4. Product Information</h2>
              <p className="text-sm text-text-secondary/80 leading-relaxed">
                Product information, OEM numbers, and vehicle compatibility data
                are provided for reference. While we strive for accuracy, we
                recommend confirming specifications directly with our sales team
                before placing orders.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">5. Limitation of Liability</h2>
              <p className="text-sm text-text-secondary/80 leading-relaxed">
                {company.name} shall not be liable for any direct, indirect, or
                consequential damages arising from the use of or reliance on
                information provided on this website.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">6. Governing Law</h2>
              <p className="text-sm text-text-secondary/80 leading-relaxed">
                These terms shall be governed by the laws of the People&apos;s Republic
                of China. Any disputes shall be subject to the jurisdiction of the
                courts in Hebei Province, China.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">7. Contact</h2>
              <p className="text-sm text-text-secondary/80 leading-relaxed">
                For questions about these Terms, please contact us at{" "}
                <a
                  href={`mailto:${company.contact.email}`}
                  className="text-accent hover:text-accent-hover transition-colors"
                >
                  {company.contact.email}
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
