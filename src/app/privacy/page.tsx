import type { Metadata } from "next";
import { getCompany } from "@/lib/data";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Hebei Jingshun Auto Parts Co., Ltd.",
};

export default function PrivacyPage() {
  const company = getCompany();

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8 sm:p-10">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Privacy Policy</h1>
          <p className="text-sm text-text-secondary/60 mb-8">
            Last updated: July 2026
          </p>

          <div className="prose prose-invert prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">1. Information We Collect</h2>
              <p className="text-sm text-text-secondary/80 leading-relaxed">
                When you submit an inquiry through our website, we collect the
                information you provide: name, company name, email address, country,
                and message content. This information is used solely for responding
                to your business inquiry.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">2. How We Use Your Information</h2>
              <p className="text-sm text-text-secondary/80 leading-relaxed">
                We use the information you submit to:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-text-secondary/80">
                <li>Respond to your product inquiries and business questions</li>
                <li>Send relevant product information and quotations</li>
                <li>Maintain business communication records</li>
                <li>Improve our products and services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">3. Data Protection</h2>
              <p className="text-sm text-text-secondary/80 leading-relaxed">
                We implement appropriate technical and organizational measures to
                protect your personal data against unauthorized access, alteration,
                disclosure, or destruction. Your information is stored securely and
                accessed only by authorized personnel.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">4. Data Sharing</h2>
              <p className="text-sm text-text-secondary/80 leading-relaxed">
                We do not sell, trade, or rent your personal information to third
                parties. Your data may be shared with our internal sales and
                technical teams solely for the purpose of serving your inquiry.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">5. Contact</h2>
              <p className="text-sm text-text-secondary/80 leading-relaxed">
                For any questions about this Privacy Policy, please contact us at{" "}
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
