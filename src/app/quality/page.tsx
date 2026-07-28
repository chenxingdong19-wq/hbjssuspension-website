"use client";

import { motion } from "framer-motion";
import { getCertifications } from "@/lib/data";
import { ShieldCheck, Microscope, ClipboardCheck, Award, FlaskConical, Gauge } from "lucide-react";

const processes = [
  {
    icon: FlaskConical,
    step: "01",
    title: "Incoming Material Inspection",
    description:
      "All raw materials undergo chemical composition analysis, hardness testing, and dimensional verification against material certificates before entering production.",
  },
  {
    icon: Microscope,
    step: "02",
    title: "In-Process Quality Control",
    description:
      "Real-time monitoring at each production stage. Statistical process control (SPC) methods track critical dimensions and identify deviations before they become defects.",
  },
  {
    icon: Gauge,
    step: "03",
    title: "Performance Testing",
    description:
      "Functional testing of assembled components including ball joint articulation torque, bushing durometer hardness, and fatigue cycle testing for critical parts.",
  },
  {
    icon: ClipboardCheck,
    step: "04",
    title: "Final Inspection & Audit",
    description:
      "100% visual and dimensional inspection. Random sample testing against AQL standards. Each batch receives a detailed inspection report before shipment approval.",
  },
];

export default function QualityPage() {
  const certifications = getCertifications();

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <span className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
            Quality Control
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mt-3 mb-4">
            Quality Management System
          </h1>
          <p className="text-text-secondary max-w-3xl mx-auto">
            Quality is embedded in every process at our facility. From incoming raw
            materials to final shipment, our multi-stage inspection system ensures every
            component meets rigorous performance standards.
          </p>
        </motion.div>

        {/* Process */}
        <div className="relative mb-20">
          {/* Vertical line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-white/[0.06] -translate-x-1/2" />

          <div className="space-y-12 lg:space-y-0">
            {processes.map((proc, i) => {
              const Icon = proc.icon;
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={proc.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  className={`lg:grid lg:grid-cols-2 lg:gap-16 items-center ${
                    i > 0 ? "lg:mt-16" : ""
                  }`}
                >
                  <div
                    className={`${
                      isEven ? "lg:text-right lg:pr-16" : "lg:col-start-2 lg:pl-16"
                    }`}
                  >
                    <div className={`mb-4 ${isEven ? "lg:justify-end" : ""} flex`}>
                      <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                        <Icon size={24} className="text-accent" />
                      </div>
                    </div>
                    <div className="text-6xl font-bold text-white/[0.03] mb-2">
                      {proc.step}
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                      {proc.title}
                    </h3>
                    <p className="text-sm text-text-secondary/70 leading-relaxed max-w-md lg:max-w-none">
                      {proc.description}
                    </p>
                  </div>
                  <div className={isEven ? "lg:col-start-2" : ""} />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
            Certifications
          </span>
          <h2 className="text-3xl font-bold text-text-primary mt-3 mb-10">
            Internationally Recognized Standards
          </h2>

          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {certifications.map((cert, i) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6"
              >
                <div className="aspect-[3/2] bg-[#F8FAFC] rounded-md flex items-center justify-center mb-5">
                  <img
                    src={cert.image}
                    alt={cert.name}
                    className="w-full h-full object-contain p-4"
                  />
                </div>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Award size={16} className="text-accent" />
                  <h3 className="text-base font-semibold text-text-primary">
                    {cert.name}
                  </h3>
                </div>
                <p className="text-sm text-text-secondary/70 mt-3 leading-relaxed">
                  {cert.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
