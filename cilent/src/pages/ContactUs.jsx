import React, { useState } from "react";
import { 
  Mail, 
  Phone, 
  Send, 
  User, 
  MessageSquare,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Globe
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
    
    setLoading(false);
  };

  const socialLinks = [
    {
      icon: Github,
      url: "https://github.com/coder-writes",
      name: "GitHub",
      color: "hover:text-gray-800"
    },
    {
      icon: Linkedin,
      url: "https://linkedin.com/in/rishi-verma-sde",
      name: "LinkedIn", 
      color: "hover:text-blue-600"
    },
    {
      icon: Twitter,
      url: "https://twitter.com/risshi-codes",
      name: "Twitter",
      color: "hover:text-blue-400"
    },
    {
      icon: Instagram,
      url: "https://instagram.com/codewithkrish_",
      name: "Instagram",
      color: "hover:text-pink-500"
    },
    {
      icon: Globe,
      url: "https://risshi.me",
      name: "Website",
      color: "hover:text-green-500"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 overflow-y-auto p-6 flex items-center justify-center text-slate-700">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8">
          
          {/* Contact Form */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Send className="w-6 h-6 text-blue-500" />
              <h1 className="text-2xl font-semibold">Get In Touch</h1>
            </div>
            
            <p className="text-gray-600 mb-6">
              Have a question or want to work together? I'd love to hear from you.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Your Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Tell me about your project or question..."
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"></span>
                ) : (
                  <Send className="w-5 h-5" />
                )}
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Contact Info & Socials */}
          <div className="space-y-6">
            
            {/* Contact Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Phone className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-semibold">Contact Information</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <a 
                      href="mailto:vortex@risshi.me" 
                      className="text-blue-500 hover:text-blue-600 hover:underline font-medium"
                    >
                      vortex@risshi.me
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <a 
                      href="tel:+1234567890" 
                      className="text-blue-500 hover:text-blue-600 hover:underline font-medium"
                    >
                      +1 (234) 567-8900
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6">Connect With Me</h2>
              
              <div className="grid grid-cols-5 gap-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center w-12 h-12 bg-gray-50 rounded-lg border transition-all hover:scale-110 hover:shadow-md ${social.color}`}
                      title={social.name}
                    >
                      <IconComponent className="w-6 h-6" />
                    </a>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border">
                <p className="text-sm text-gray-600 text-center">
                  Follow me on social media for updates and behind-the-scenes content!
                </p>
              </div>
            </div>

            {/* Quick Response Promise */}
            <div className="bg-blue-500 hover:bg-blue-600 rounded-lg p-6 text-white transition-all">
              <h3 className="text-lg font-semibold mb-2">Quick Response Promise</h3>
              <p className="text-sm opacity-90">
                I typically respond to messages within 24 hours. Looking forward to hearing from you!
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;
