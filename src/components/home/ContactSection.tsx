"use client";

import { motion } from "framer-motion";
import { getCompany } from "@/lib/data";
import { MapPin, Mail, Phone, Clock, User, MessageCircle, MessageSquare, Globe, Share2 } from "lucide-react";
import InquiryForm from "@/components/ui/InquiryForm";

export default function ContactSection() {
  const company = getCompany();
  const social = company.social;
  const waLink = `https://wa.me/${social.whatsapp.replace(/\D/g, "")}`;

  return (
    <section id="contact" className="py-20 border-t border-gray-200 section-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">Get In Touch</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mt-3 mb-4">Start Your Inquiry</h2>
          <p className="text-[#64748B] max-w-2xl mx-auto">Reach out to our team for product inquiries, pricing, and technical specifications. We respond within 24 hours.</p>
        </motion.div>
        <div className="grid lg:grid-cols-5 gap-10">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-[#0F172A] mb-6">{company.name}</h3>
              <div className="space-y-5">
                {[{icon:MapPin,label:"Address",val:company.contact.address.full},{icon:Mail,label:"Email",val:company.contact.email,isLink:true},{icon:Phone,label:"Phone",val:company.contact.phones[0]},{icon:User,label:"Contact Person",val:company.contact.contactPerson},{icon:Clock,label:"Working Hours",val:`${company.contact.workingHours.days} ${company.contact.workingHours.hours} (${company.contact.workingHours.timezone})`}].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-start gap-3">
                      <Icon size={18} className="text-accent mt-0.5 shrink-0" />
                      <div><div className="text-xs font-medium text-[#64748B] mb-0.5">{item.label}</div>
                      {'isLink' in item ? <a href={`mailto:${item.val}`} className="text-sm text-[#475569] hover:text-accent transition-colors">{item.val}</a> : <div className="text-sm text-[#475569]">{item.val}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Connect - social from company.json (hidden if empty) */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-[#0F172A] mb-6">Quick Connect</h3>
              <div className="space-y-5">
                {social.whatsapp && (<div className="flex items-start gap-3"><MessageCircle size={18} className="text-green-500 mt-0.5 shrink-0" /><div><div className="text-xs font-medium text-[#64748B] mb-0.5">WhatsApp</div><a href={waLink} target="_blank" rel="noopener noreferrer" className="text-sm text-[#475569] hover:text-accent transition-colors">{social.whatsapp}</a></div></div>)}
                {social.wechat && (<div className="flex items-start gap-3"><MessageSquare size={18} className="text-green-600 mt-0.5 shrink-0" /><div><div className="text-xs font-medium text-[#64748B] mb-0.5">WeChat</div><div className="text-sm text-[#475569]">{social.wechat}</div></div></div>)}
                {social.facebook && (<div className="flex items-start gap-3"><Globe size={18} className="text-blue-600 mt-0.5 shrink-0" /><div><div className="text-xs font-medium text-[#64748B] mb-0.5">Facebook</div><a href={social.facebook} target="_blank" rel="noopener noreferrer" className="text-sm text-[#475569] hover:text-accent transition-colors">{social.facebook}</a></div></div>)}
                {social.linkedin && (<div className="flex items-start gap-3"><Share2 size={18} className="text-sky-700 mt-0.5 shrink-0" /><div><div className="text-xs font-medium text-[#64748B] mb-0.5">LinkedIn</div><a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-[#475569] hover:text-accent transition-colors">{social.linkedin}</a></div></div>)}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-3"><InquiryForm /></motion.div>
        </div>
      </div>
    </section>
  );
}