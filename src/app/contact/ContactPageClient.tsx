"use client";

import { motion } from "framer-motion";
import { getCompany } from "@/lib/data";
import { MapPin, Mail, Phone, Clock, User } from "lucide-react";
import InquiryForm from "@/components/ui/InquiryForm";

export default function ContactPageClient() {
  const company = getCompany();

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mt-3 mb-4">
            Start Your Inquiry
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Reach out to our team for product inquiries, pricing, and technical
            specifications. We respond within 24 hours.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-6">
                {company.name}
              </h3>
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-accent mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-text-secondary/60 mb-0.5">Address</div>
                    <div className="text-sm text-text-secondary leading-relaxed">
                      {company.contact.address.full}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-accent mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-text-secondary/60 mb-0.5">Email</div>
                    <a
                      href={`mailto:${company.contact.email}`}
                      className="text-sm text-text-secondary hover:text-accent transition-colors"
                    >
                      {company.contact.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-accent mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-text-secondary/60 mb-0.5">Phone</div>
                    {company.contact.phones.map((p) => (
                      <div key={p} className="text-sm text-text-secondary">
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User size={18} className="text-accent mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-text-secondary/60 mb-0.5">Contact Person</div>
                    <div className="text-sm text-text-secondary">
                      {company.contact.contactPerson}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-accent mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-text-secondary/60 mb-0.5">Working Hours</div>
                    <div className="text-sm text-text-secondary">
                      {company.contact.workingHours.days}{" "}
                      {company.contact.workingHours.hours}{" "}
                      ({company.contact.workingHours.timezone})
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="glass-card p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                  <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                  <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                  <path d="M9.5 13.5c.5 1 1.5 2 2.5 2s2-1 2.5-2" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-text-primary">
                  WhatsApp Quick Connect
                </div>
                <a
                  href={`https://wa.me/${company.social.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-400 hover:text-green-300 transition-colors"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <InquiryForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
