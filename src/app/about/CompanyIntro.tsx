"use client";

import { motion } from "framer-motion";
import { getCompany } from "@/lib/data";
import { Target, Globe, Users, Factory, ShieldCheck, Award } from "lucide-react";

const features = [
  {
    icon: Factory,
    title: "12+ Years Manufacturing",
    description:
      "Established in 2012, we have grown into a trusted manufacturer with extensive experience in automotive suspension systems.",
  },
  {
    icon: Globe,
    title: "Global Export Service",
    description:
      "Serving importers, distributors, and wholesalers across multiple continents with reliable shipping and documentation.",
  },
  {
    icon: ShieldCheck,
    title: "ISO 9001 & IATF 16949",
    description:
      "Certified quality management systems ensuring every product meets international automotive standards.",
  },
  {
    icon: Award,
    title: "OEM / ODM Capability",
    description:
      "Flexible manufacturing capable of producing to customer specifications or developing custom solutions.",
  },
];

const values = [
  {
    icon: Target,
    title: "Quality First",
    description:
      "Every component undergoes rigorous inspection before leaving our factory. Quality is embedded in every process.",
  },
  {
    icon: Users,
    title: "Customer Partnership",
    description:
      "We build long-term relationships through reliable supply, consistent quality, and responsive communication.",
  },
  {
    icon: Factory,
    title: "Continuous Innovation",
    description:
      "Investing in advanced manufacturing technology and skilled workforce to stay at the forefront of the industry.",
  },
];

export default function CompanyIntro() {
  const company = getCompany();

  return (
    <div className="pt-28 pb-20">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
            About Us
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mt-3 mb-6">
            {company.name}
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed">
            {company.description}
          </p>
        </motion.div>
      </section>

      {/* Key Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-accent" />
                </div>
                <h3 className="text-base font-semibold text-text-primary mb-2">
                  {feat.title}
                </h3>
                <p className="text-sm text-text-secondary/70 leading-relaxed">
                  {feat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Mission & Values */}
      <section className="border-t border-white/[0.04] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
              Our Values
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mt-3 mb-4">
              What Drives Us
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {values.map((val, i) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-14 h-14 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-5">
                    <Icon size={24} className="text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {val.title}
                  </h3>
                  <p className="text-sm text-text-secondary/70 leading-relaxed">
                    {val.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
