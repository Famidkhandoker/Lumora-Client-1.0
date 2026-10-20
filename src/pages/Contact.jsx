// import { motion } from "framer-motion";
// import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";
// import { useState } from "react";
// import toast from "react-hot-toast";

// const contactInfo = [
//   {
//     icon: FiPhone,
//     title: "Call Us",
//     value: "+880 1234-567890",
//     sub: "Mon–Fri, 9am–8pm",
//     color: "from-amber-500 to-yellow-500",
//   },
//   {
//     icon: FiMail,
//     title: "Email Us",
//     value: "info@lumora.com",
//     sub: "We reply within 24 hours",
//     color: "from-[#e8a803] to-[#f59e0b]",
//   },
//   {
//     icon: FiMapPin,
//     title: "Visit Us",
//     value: "Dhaka, Bangladesh",
//     sub: "Serving all major areas",
//     color: "from-orange-500 to-amber-500",
//   },
// ];

// const Contact = () => {
//   const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     toast.success("Message sent! We'll get back to you soon.");
//     setFormData({ name: "", email: "", subject: "", message: "" });
//   };

//   const update = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-yellow-50/30 py-20">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-14"
//         >
//           <span className="inline-block px-4 py-1.5 rounded-full bg-[#e8a803]/10 text-[#e8a803] text-sm font-semibold mb-4">
//             Contact Us
//           </span>
//           <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
//             Get In Touch
//           </h1>
//           <p className="text-base-content/60 text-lg max-w-xl mx-auto">
//             Have a question or ready to book? We&apos;d love to hear from you.
//           </p>
//         </motion.div>

//         <div className="grid lg:grid-cols-5 gap-8">
//           {/* Contact Info */}
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.1 }}
//             className="lg:col-span-2 space-y-4"
//           >
//             {contactInfo.map((item, i) => {
//               const Icon = item.icon;
//               return (
//                 <motion.div
//                   key={i}
//                   initial={{ opacity: 0, y: 16 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.1 + i * 0.08 }}
//                   className="flex items-start gap-4 p-5 bg-base-100 rounded-2xl border border-base-200 shadow-sm hover:shadow-md transition-shadow"
//                 >
//                   <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
//                     <Icon size={20} className="text-white" />
//                   </div>
//                   <div>
//                     <p className="text-xs font-semibold text-base-content/40 uppercase tracking-wider mb-0.5">{item.title}</p>
//                     <p className="font-semibold text-base-content">{item.value}</p>
//                     <p className="text-sm text-base-content/50 mt-0.5">{item.sub}</p>
//                   </div>
//                 </motion.div>
//               );
//             })}

//             {/* Map placeholder */}
//             <div className="rounded-2xl overflow-hidden border border-base-200 shadow-sm h-40 bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center">
//               <div className="text-center">
//                 <FiMapPin size={28} className="text-[#e8a803] mx-auto mb-2" />
//                 <p className="text-sm font-medium text-base-content/60">Dhaka, Bangladesh</p>
//               </div>
//             </div>
//           </motion.div>

//           {/* Contact Form */}
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.15 }}
//             className="lg:col-span-3"
//           >
//             <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm p-8">
//               <h2 className="text-xl font-bold text-base-content mb-6">Send us a message</h2>

//               <form onSubmit={handleSubmit} className="space-y-5">
//                 <div className="grid sm:grid-cols-2 gap-5">
//                   <div className="form-control">
//                     <label className="label pb-1.5">
//                       <span className="label-text">Your name</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.name}
//                       onChange={update("name")}
//                       className="input input-bordered w-full text-sm"
//                       placeholder="John Doe"
//                       required
//                     />
//                   </div>
//                   <div className="form-control">
//                     <label className="label pb-1.5">
//                       <span className="label-text">Email address</span>
//                     </label>
//                     <input
//                       type="email"
//                       value={formData.email}
//                       onChange={update("email")}
//                       className="input input-bordered w-full text-sm"
//                       placeholder="you@example.com"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="form-control">
//                   <label className="label pb-1.5">
//                     <span className="label-text">Subject</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.subject}
//                     onChange={update("subject")}
//                     className="input input-bordered w-full text-sm"
//                     placeholder="How can we help you?"
//                     required
//                   />
//                 </div>

//                 <div className="form-control">
//                   <label className="label pb-1.5">
//                     <span className="label-text">Message</span>
//                   </label>
//                   <textarea
//                     value={formData.message}
//                     onChange={update("message")}
//                     className="textarea textarea-bordered w-full text-sm resize-none"
//                     placeholder="Tell us about your project or question..."
//                     rows={5}
//                     required
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   className="btn btn-primary w-full gap-2"
//                 >
//                   <FiSend size={16} />
//                   Send Message
//                 </button>
//               </form>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Contact;



import { motion } from "framer-motion";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
} from "react-icons/fi";
import { useState } from "react";
import toast from "react-hot-toast";

const contactInfo = [
  {
    icon: FiPhone,
    title: "Call Us",
    value: "+880 1234-567890",
    sub: "Mon–Fri, 9am–8pm",
    color: "from-amber-500 to-yellow-500",
  },
  {
    icon: FiMail,
    title: "Email Us",
    value: "info@lumora.com",
    sub: "We reply within 24 hours",
    color: "from-[#e8a803] to-[#f59e0b]",
  },
  {
    icon: FiMapPin,
    title: "Visit Us",
    value: "Dhaka, Bangladesh",
    sub: "Serving all major areas",
    color: "from-orange-500 to-amber-500",
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (sending) return;

    setSending(true);

    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/famidkhandoker.bubt53@gmail.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            _subject: `Lumora Contact: ${formData.subject}`,
            _template: "table",
          }),
        }
      );

      const result = await response.json();

      if (
        !response.ok ||
        result.success === false ||
        result.success === "false"
      ) {
        throw new Error(
          result.message || "Email submission failed"
        );
      }

      toast.success("Message sent successfully!");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form error:", error);

      toast.error(
        "Could not send message. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  const update = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-yellow-50/30 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#e8a803]/10 text-[#e8a803] text-sm font-semibold mb-4">
            Contact Us
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
            Get In Touch
          </h1>

          <p className="text-base-content/60 text-lg max-w-xl mx-auto">
            Have a question or ready to book? We&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-4"
          >
            {contactInfo.map((item, i) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="flex items-start gap-4 p-5 bg-base-100 rounded-2xl border border-base-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-sm`}
                  >
                    <Icon size={20} className="text-white" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-base-content/40 uppercase tracking-wider mb-0.5">
                      {item.title}
                    </p>

                    <p className="font-semibold text-base-content">
                      {item.value}
                    </p>

                    <p className="text-sm text-base-content/50 mt-0.5">
                      {item.sub}
                    </p>
                  </div>
                </motion.div>
              );
            })}

            {/* Map placeholder */}
            <div className="rounded-2xl overflow-hidden border border-base-200 shadow-sm h-40 bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center">
              <div className="text-center">
                <FiMapPin
                  size={28}
                  className="text-[#e8a803] mx-auto mb-2"
                />

                <p className="text-sm font-medium text-base-content/60">
                  Dhaka, Bangladesh
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-3"
          >
            <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm p-8">
              <h2 className="text-xl font-bold text-base-content mb-6">
                Send us a message
              </h2>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div className="grid sm:grid-cols-2 gap-5">

                  {/* Name */}
                  <div className="form-control">
                    <label className="label pb-1.5">
                      <span className="label-text">
                        Your name
                      </span>
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={update("name")}
                      className="input input-bordered w-full text-sm"
                      placeholder="John Doe"
                      required
                      disabled={sending}
                    />
                  </div>

                  {/* Email */}
                  <div className="form-control">
                    <label className="label pb-1.5">
                      <span className="label-text">
                        Email address
                      </span>
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={update("email")}
                      className="input input-bordered w-full text-sm"
                      placeholder="you@example.com"
                      required
                      disabled={sending}
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="form-control">
                  <label className="label pb-1.5">
                    <span className="label-text">
                      Subject
                    </span>
                  </label>

                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={update("subject")}
                    className="input input-bordered w-full text-sm"
                    placeholder="How can we help you?"
                    required
                    disabled={sending}
                  />
                </div>

                {/* Message */}
                <div className="form-control">
                  <label className="label pb-1.5">
                    <span className="label-text">
                      Message
                    </span>
                  </label>

                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={update("message")}
                    className="textarea textarea-bordered w-full text-sm resize-none"
                    placeholder="Tell us about your project or question..."
                    rows={5}
                    required
                    disabled={sending}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={sending}
                  className="btn btn-primary w-full gap-2"
                >
                  <FiSend size={16} />

                  {sending
                    ? "Sending..."
                    : "Send Message"}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
