"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    const newInquiry = {
      ...formData,
      id: `INQ-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleString()
    };

    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInquiry)
      });
    } catch (err) {
      console.error("Failed to save inquiry:", err);
    }

    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 4500);
  };

  return (
    <div className="pt-24 min-h-screen flex flex-col">
      {/* Banner */}
      <section className="relative h-[30vh] min-h-[200px] flex items-center justify-center bg-lightMint/80 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero/pexels-enginakyurt-4531546.jpg"
            alt="Contact background"
            className="w-full h-full object-cover opacity-15 mix-blend-luminosity"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-backgroundCustom via-backgroundCustom/50 to-transparent z-0" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-primary space-y-2">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold">
            Connect With Us
          </h1>
          <p className="text-xs font-inter text-secondary/70 select-none">
            Home / Contact
          </p>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        {/* Info Column */}
        <div className="lg:col-span-5 space-y-8 select-none">
          <div className="space-y-4">
            <h2 className="text-3xl font-playfair font-bold text-primary dark:text-white">
              Support Desks
            </h2>
            <p className="font-inter text-xs text-textCustom/60 dark:text-lightMint/60 leading-relaxed max-w-sm">
              Do you have inquiries regarding wholesale contracts, private labels, or need help with a retail checkout? Select the corresponding channel.
            </p>
          </div>

          <div className="space-y-6 bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/5 p-8 rounded-3xl">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-secondary/10 dark:bg-accent/10 rounded-xl text-primary dark:text-accent mt-1">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-playfair text-lg font-bold text-textCustom dark:text-white">
                  Email Support
                </h4>
                <p className="font-inter text-xs text-textCustom/60 dark:text-lightMint/60 mt-1 pb-1">
                  General inquiries, orders, refunds and suggestions.
                </p>
                <a href="mailto:dipakparmar2466@gmail.com" className="text-sm font-poppins font-semibold text-primary dark:text-accent hover:underline">
                  dipakparmar2466@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-secondary/10 dark:bg-accent/10 rounded-xl text-primary dark:text-accent mt-1">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-playfair text-lg font-bold text-textCustom dark:text-white">
                  B2B Phone Lines
                </h4>
                <p className="font-inter text-xs text-textCustom/60 dark:text-lightMint/60 mt-1 pb-1">
                  Wholesale, distributors and brand partnership contracts.
                </p>
                <div className="flex flex-col space-y-1">
                  <a href="tel:+919924750849" className="text-sm font-poppins font-semibold text-primary dark:text-accent hover:underline">
                    +91 99247 50849
                  </a>
                  <a href="tel:+919510583980" className="text-sm font-poppins font-semibold text-primary dark:text-accent hover:underline">
                    +91 95105 83980
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7 bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/5 p-8 md:p-10 rounded-3xl">
          <AnimatePresence mode="wait">
            {formSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4"
              >
                <div className="p-4 bg-accent/20 text-primary dark:text-accent rounded-full">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="font-playfair text-2xl font-bold text-primary dark:text-accent">
                  Message Dispatched
                </h3>
                <p className="font-inter text-sm text-textCustom/60 dark:text-lightMint/60 max-w-md leading-relaxed">
                  Your message has been processed successfully. We will follow up via email at <span className="font-bold">{formData.email}</span> within one business day.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name-input" className="text-xs font-poppins font-bold uppercase tracking-wider text-textCustom/70 dark:text-lightMint/70">
                      FullName
                    </label>
                    <input
                      id="name-input"
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full px-5 py-3 border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/25 text-sm rounded-xl focus:outline-none focus:border-primary dark:focus:border-accent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email-input" className="text-xs font-poppins font-bold uppercase tracking-wider text-textCustom/70 dark:text-lightMint/70">
                      Email Address
                    </label>
                    <input
                      id="email-input"
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. eleanor@example.com"
                      className="w-full px-5 py-3 border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/25 text-sm rounded-xl focus:outline-none focus:border-primary dark:focus:border-accent"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject-input" className="text-xs font-poppins font-bold uppercase tracking-wider text-textCustom/70 dark:text-lightMint/70">
                    Subject Topic
                  </label>
                  <input
                    id="subject-input"
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="e.g. Wholesale Bulk Catalog Request"
                    className="w-full px-5 py-3 border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/25 text-sm rounded-xl focus:outline-none focus:border-primary dark:focus:border-accent"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message-input" className="text-xs font-poppins font-bold uppercase tracking-wider text-textCustom/70 dark:text-lightMint/70">
                    Message Details
                  </label>
                  <textarea
                    id="message-input"
                    rows={6}
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Briefly state your wholesale query, custom orders, or skin concerns..."
                    className="w-full px-5 py-3 border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/25 text-sm rounded-xl focus:outline-none focus:border-primary dark:focus:border-accent resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-primary dark:bg-accent text-white dark:text-primary font-poppins text-xs font-semibold uppercase tracking-widest rounded-xl transition-all duration-300 hover:opacity-90 flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
                >
                  <span>Transmit Query</span>
                  <Send className="w-4.5 h-4.5" />
                </button>
              </form>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
