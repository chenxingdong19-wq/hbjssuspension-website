"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { sendFullInquiryToEmail } from "@/lib/inquiry";

export default function InquiryForm({ defaultProduct }: { defaultProduct?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", email: "", country: "", product: defaultProduct || "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;

    setSending(true);
    setError(false);

    const ok = await sendFullInquiryToEmail({
      name: form.name,
      company: form.company,
      email: form.email,
      country: form.country,
      product: form.product,
      message: form.message,
      url: typeof window !== "undefined" ? window.location.href : "",
    });

    setSending(false);

    if (ok) {
      setSubmitted(true);
    } else {
      setError(true);
    }
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 text-center">
        <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-[#0F172A] mb-2">Inquiry Submitted</h3>
        <p className="text-[#64748B] text-sm">Thank you for your interest. Our team will respond within 24 hours.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8">
      <h3 className="text-lg font-semibold text-[#0F172A] mb-6">Send Business Inquiry</h3>
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-xs font-medium text-[#64748B] mb-1.5">Name <span className="text-accent">*</span></label><input type="text" name="name" required value={form.name} onChange={handleChange} className="w-full px-3 py-2.5 rounded-md text-sm" placeholder="Your full name" /></div>
          <div><label className="block text-xs font-medium text-[#64748B] mb-1.5">Company</label><input type="text" name="company" value={form.company} onChange={handleChange} className="w-full px-3 py-2.5 rounded-md text-sm" placeholder="Your company name" /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-xs font-medium text-[#64748B] mb-1.5">Business Email <span className="text-accent">*</span></label><input type="email" name="email" required value={form.email} onChange={handleChange} className="w-full px-3 py-2.5 rounded-md text-sm" placeholder="you@company.com" /></div>
          <div><label className="block text-xs font-medium text-[#64748B] mb-1.5">Country</label><input type="text" name="country" value={form.country} onChange={handleChange} className="w-full px-3 py-2.5 rounded-md text-sm" placeholder="Your country" /></div>
        </div>
        <div><label className="block text-xs font-medium text-[#64748B] mb-1.5">Interested Product</label>
          <select name="product" value={form.product} onChange={handleChange} className="w-full px-3 py-2.5 rounded-md text-sm appearance-none cursor-pointer">
            <option value="">Select a product category</option><option value="Control Arm Assembly">Control Arm Assembly</option><option value="Ball Joint">Ball Joint</option><option value="Rubber Bushings">Rubber Bushings</option><option value="Suspension Components">Suspension Components</option><option value="Other">Other / Custom Inquiry</option>
          </select>
        </div>
        <div><label className="block text-xs font-medium text-[#64748B] mb-1.5">Message <span className="text-accent">*</span></label><textarea name="message" required rows={4} value={form.message} onChange={handleChange} className="w-full px-3 py-2.5 rounded-md text-sm resize-none" placeholder="Please describe your requirements..." /></div>

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-md bg-red-50 border border-red-100 text-red-600 text-xs">
            <AlertCircle size={14} />
            Something went wrong. Please try again or email us directly.
          </div>
        )}

        <button type="submit" disabled={sending} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white text-sm font-semibold btn-primary shadow-lg shadow-red-200 disabled:opacity-60">
          {sending ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending...
            </>
          ) : (
            <>
              <Send size={16} />Send Inquiry
            </>
          )}
        </button>
      </div>
    </form>
  );
}