import { useState } from "react";
import emailjs from "@emailjs/browser";
import Alert from "../components/Alert";
import { Particles } from "../components/Particles";
import { services } from "../constants";
import { User, Mail, Phone, Briefcase, FileText, MessageSquare, Send, Loader2, Sparkles } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: services[0] || "Web Development",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showAlertMessage = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      showAlertMessage("danger", "Please fill in all required fields!");
      return;
    }

    setIsLoading(true);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_2p7jlyk";
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_4bcehhr";
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "fGbmS48VxwfvmwFb1";

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name.trim(),
          to_name: "Bhupesh",
          from_email: formData.email.trim(),
          to_email: "bhupeshdewangan160204@gmail.com",
          phone: formData.phone.trim() || "Not Provided",
          service: formData.service,
          subject: formData.subject.trim() || "Portfolio Inquiry",
          message: formData.message.trim(),
        },
        publicKey
      );
      setIsLoading(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: services[0] || "Web Development",
        subject: "",
        message: "",
      });
      showAlertMessage("success", "Your message has been sent successfully!");
    } catch (error) {
      setIsLoading(false);
      console.error("EmailJS Submission Error:", error);
      showAlertMessage("danger", "Something went wrong! Please check your network or try again.");
    }
  };

  return (
    <section className="relative flex items-center justify-center c-space section-spacing px-2 sm:px-5" id="contact">
      <Particles
        className="absolute inset-0 -z-50"
        quantity={60}
        ease={80}
        color={"#ffffff"}
        refresh
      />

      {showAlert && <Alert type={alertType} text={alertMessage} />}

      <div className="relative flex w-full flex-col items-center justify-center max-w-2xl p-6 sm:p-8 mx-auto border border-white/10 rounded-3xl bg-midnight/80 backdrop-blur-xl shadow-[0_0_50px_-12px_rgba(92,51,204,0.3)] transition-all duration-300 hover:border-white/20">
        {/* Background Radial Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-royal/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-lavender/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center sm:items-start text-center sm:text-left w-full gap-3 mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold tracking-wider text-lavender uppercase bg-lavender/10 rounded-full border border-lavender/20">
            <Sparkles className="w-3.5 h-3.5 text-lavender" /> Get In Touch
          </span>
          <h2 className="text-heading text-white font-bold">Let's Talk</h2>
          <p className="font-normal text-neutral-400 text-sm sm:text-base leading-relaxed">
            Whether you're looking to build a new website, improve your existing
            platform, or bring a unique project to life, I'm here to help.
          </p>
        </div>

        <form className="w-full space-y-4" onSubmit={handleSubmit}>
          {/* Row 1: Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="field-label block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Full Name <span className="text-royal">*</span>
              </label>
              <div className="relative flex items-center rounded-xl bg-white/5 border border-white/10 focus-within:border-lavender/60 focus-within:ring-2 focus-within:ring-royal/40 focus-within:shadow-[0_0_15px_rgba(122,87,219,0.25)] transition-all duration-200">
                <User className="absolute left-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="w-full bg-transparent pl-10 pr-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none"
                  placeholder="John Doe"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="field-label block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Email Address <span className="text-royal">*</span>
              </label>
              <div className="relative flex items-center rounded-xl bg-white/5 border border-white/10 focus-within:border-lavender/60 focus-within:ring-2 focus-within:ring-royal/40 focus-within:shadow-[0_0_15px_rgba(122,87,219,0.25)] transition-all duration-200">
                <Mail className="absolute left-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full bg-transparent pl-10 pr-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none"
                  placeholder="john@example.com"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Row 2: Phone & Service Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="field-label block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Phone / WhatsApp <span className="text-neutral-500 font-normal">(Optional)</span>
              </label>
              <div className="relative flex items-center rounded-xl bg-white/5 border border-white/10 focus-within:border-lavender/60 focus-within:ring-2 focus-within:ring-royal/40 focus-within:shadow-[0_0_15px_rgba(122,87,219,0.25)] transition-all duration-200">
                <Phone className="absolute left-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="w-full bg-transparent pl-10 pr-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none"
                  placeholder="+1 (555) 000-0000"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="service" className="field-label block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Service Required
              </label>
              <div className="relative flex items-center rounded-xl bg-white/5 border border-white/10 focus-within:border-lavender/60 focus-within:ring-2 focus-within:ring-royal/40 focus-within:shadow-[0_0_15px_rgba(122,87,219,0.25)] transition-all duration-200">
                <Briefcase className="absolute left-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />
                <select
                  id="service"
                  name="service"
                  className="w-full bg-transparent pl-10 pr-4 py-3 text-sm text-white focus:outline-none cursor-pointer appearance-none [&>option]:bg-midnight [&>option]:text-white"
                  value={formData.service}
                  onChange={handleChange}
                >
                  {services.map((serviceItem) => (
                    <option key={serviceItem} value={serviceItem}>
                      {serviceItem}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Row 3: Subject */}
          <div>
            <label htmlFor="subject" className="field-label block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              Subject <span className="text-neutral-500 font-normal">(Optional)</span>
            </label>
            <div className="relative flex items-center rounded-xl bg-white/5 border border-white/10 focus-within:border-lavender/60 focus-within:ring-2 focus-within:ring-royal/40 focus-within:shadow-[0_0_15px_rgba(122,87,219,0.25)] transition-all duration-200">
              <FileText className="absolute left-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />
              <input
                id="subject"
                name="subject"
                type="text"
                className="w-full bg-transparent pl-10 pr-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none"
                placeholder="e.g. Project Inquiry"
                autoComplete="off"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Row 4: Message Textarea */}
          <div>
            <label htmlFor="message" className="field-label block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              Your Message <span className="text-royal">*</span>
            </label>
            <div className="relative flex items-start rounded-xl bg-white/5 border border-white/10 focus-within:border-lavender/60 focus-within:ring-2 focus-within:ring-royal/40 focus-within:shadow-[0_0_15px_rgba(122,87,219,0.25)] transition-all duration-200">
              <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />
              <textarea
                id="message"
                name="message"
                rows="4"
                className="w-full bg-transparent pl-10 pr-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none resize-none"
                placeholder="Share project details, timelines, or goals..."
                autoComplete="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex items-center justify-center gap-2 min-h-12 w-full cursor-pointer rounded-xl bg-linear-to-r from-royal via-lavender to-indigo px-6 py-3 text-base font-medium text-white shadow-lg shadow-royal/25 hover:shadow-royal/40 hover:opacity-95 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sending Message...</span>
              </>
            ) : (
              <>
                <span>Send Message</span>
                <Send className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;




