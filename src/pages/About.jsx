import { motion } from "framer-motion";
import { FiAward, FiUsers, FiTrendingUp, FiHeart } from "react-icons/fi";

const About = () => {
  const stats = [
    { icon: FiUsers, value: "500+", label: "Happy Clients" },
    { icon: FiAward, value: "50+", label: "Expert Decorators" },
    { icon: FiTrendingUp, value: "1000+", label: "Projects Done" },
    { icon: FiHeart, value: "98%", label: "Satisfaction Rate" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-sky/70 via-primarydeep to-[var(--lum-accent)] text-white overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About Lumora
            </h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              We&apos;re passionate about transforming ordinary spaces into
              extraordinary experiences through creative decoration.
            </p>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full"
        />
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-sky to-primarydeep rounded-full flex items-center justify-center">
                    <Icon size={32} className="text-white" />
                  </div>
                  <div className="text-4xl font-bold text-primarydeep mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gradient-to-br from-cream to-peach">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Founded in 2020, Lumora began with a simple mission: to make
                professional decoration services accessible to everyone. What
                started as a small team of passionate decorators has grown into
                Bangladesh&apos;s leading decoration booking platform.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We believe that every space tells a story, and we&apos;re here to
                help you tell yours. Whether it&apos;s a wedding, home renovation, or
                corporate event, our team of expert decorators brings
                creativity, professionalism, and attention to detail to every
                project.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, we&apos;re proud to serve hundreds of clients across Dhaka and
                beyond, creating memorable experiences one decoration at a time.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800"
                alt="Our Team"
                className="rounded-3xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Quality First",
                description:
                  "We never compromise on the quality of our decorations and services.",
                color: "from-sky to-primarydeep",
              },
              {
                title: "Customer Focused",
                description:
                  "Your satisfaction is our top priority, and we go above and beyond.",
                color: "from-[var(--lum-primary)] to-[var(--lum-accent)]",
              },
              {
                title: "Innovation",
                description:
                  "We constantly explore new design trends and techniques.",
                color: "from-primarydeep to-sky",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${value.color} rounded-2xl p-8 text-white card-hover`}
              >
                <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                <p className="opacity-90">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
