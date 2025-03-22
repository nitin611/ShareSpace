import React, { useEffect } from 'react';
import Structure from '../Components/structure/Structure';
import { 
  FaUsers, 
  FaHandHoldingUsd, 
  FaRecycle, 
  FaGraduationCap, 
  FaHeart, 
  FaLeaf 
} from 'react-icons/fa';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './About.css';

const About = () => {
  // Animation controls
  const storyControls = useAnimation();
  const metricsControls = useAnimation();
  const teamControls = useAnimation();
  const featuresControls = useAnimation();

  // Refs for sections
  const [storyRef, storyInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [metricsRef, metricsInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [teamRef, teamInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [featuresRef, featuresInView] = useInView({ threshold: 0.2, triggerOnce: true });

  // Trigger animations when sections come into view
  useEffect(() => {
    if (storyInView) storyControls.start('visible');
    if (metricsInView) metricsControls.start('visible');
    if (teamInView) teamControls.start('visible');
    if (featuresInView) featuresControls.start('visible');
  }, [storyInView, metricsInView, teamInView, featuresInView, storyControls, metricsControls, teamControls, featuresControls]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 },
    },
  };

  return (
    <Structure>
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50 text-black relative overflow-hidden about-page">
        {/* Animated Background Circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"
              style={{
                background: `radial-gradient(circle, ${['#60A5FA', '#818CF8', '#A78BFA', '#C084FC', '#F472B6'][i]} 0%, transparent 70%)`,
                width: `${Math.random() * 400 + 200}px`,
                height: `${Math.random() * 400 + 200}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        {/* Hero Section */}
        <div className="hero-section relative flex items-center justify-center h-1/2 min-h-[400px]">
          <motion.div 
            className="hero-content text-center z-10 px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="w-full text-center text-5xl md:text-6xl font-extrabold tracking-wide bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              About ShareSpace
            </h1>
            <p className="text-lg mt-4">Connecting students through sustainable commerce</p>
          </motion.div>
          {/* Optional Hero Shapes */}
          <div className="hero-shapes absolute inset-0">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>

        {/* Our Story Section */}
        <section className="story-section py-16" ref={storyRef}>
          <motion.div 
            className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
            variants={containerVariants}
            initial="hidden"
            animate={storyControls}
          >
            <motion.div className="story-content space-y-6" variants={itemVariants}>
              <h2 className="text-4xl font-bold">Our Story</h2>
              <p className="text-lg leading-relaxed text-gray-700">
                At ShareSpace, we aim to build a sustainable and community-driven platform where students can buy, sell, and exchange college items.
                Whether it's books, electronics, or other resources, we believe in reusing items to reduce waste and make college life more affordable for everyone.
              </p>
              <p className="text-lg leading-relaxed text-gray-700">
                Our platform rewards users with points when they create products, and sellers receive additional points when their orders are delivered.
                This points system encourages active participation and helps build a thriving marketplace community.
              </p>
            </motion.div>
            <motion.div className="story-image" variants={itemVariants}>
              <img 
                src="/ban-2.jpg" 
                alt="About Us" 
                className="rounded-image w-full shadow-lg" 
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Metrics Section */}
        <section className="metrics-section py-16 bg-gray-100" ref={metricsRef}>
  <motion.div className="container mx-auto" variants={containerVariants} initial="hidden" animate={metricsControls}>
    <motion.div className="metrics-header text-center mb-12" variants={itemVariants}>
      <h2 className="text-4xl font-bold">Our Impact</h2>
      <p className="text-lg mt-2">Growing stronger with each transaction</p>
    </motion.div>
    <motion.div className="metrics-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6" variants={containerVariants}>
      {[
        { value: '2.5k', label: 'Sellers online', color: 'blue' },
        { value: '13k', label: 'Monthly sales', color: 'purple' },
        { value: '4.5k', label: 'Active customers', color: 'pink' },
        { value: '25k', label: 'Annual transactions', color: 'indigo' }
      ].map((metric, index) => (
        <motion.div
          key={index}
          className="relative group bg-white py-6 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
          variants={itemVariants}
          whileHover={{ y: -10, transition: { duration: 0.3 } }}
        >
          {/* Gradient overlay based on metric color */}
          <div
            className={`absolute inset-0 bg-gradient-to-r ${
              metric.color === 'blue'
                ? 'from-blue-500 to-blue-400'
                : metric.color === 'purple'
                ? 'from-purple-500 to-purple-400'
                : metric.color === 'pink'
                ? 'from-pink-500 to-pink-400'
                : 'from-indigo-500 to-indigo-400'
            } opacity-20 group-hover:opacity-50 transition duration-300`}
          ></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-center text-gray-800">{metric.value}</h3>
            <p className="text-center text-gray-600 mt-2">{metric.label}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  </motion.div>
</section>


        {/* Team Section */}
        <section className="team-section py-16" ref={teamRef}>
          <motion.div className="container mx-auto" variants={containerVariants} initial="hidden" animate={teamControls}>
            <motion.div className="team-header text-center mb-12" variants={itemVariants}>
              <h2 className="text-4xl font-bold">Meet Our Team</h2>
              <p className="text-lg text-gray-600">The minds behind ShareSpace</p>
            </motion.div>
            <motion.div className="team-grid grid grid-cols-1 md:grid-cols-3 gap-8" variants={containerVariants}>
              {[
                {
                  name: "Nitin Kumar Jhaa",
                  role: "Co-Founder & Developer",
                  image: "/nitin.jpeg",
                  description: "Nitin is passionate about web development and sustainability. He built this platform to help students connect and share valuable resources.",
                  icon: <FaGraduationCap className="text-blue-500" />
                },
                {
                  name: "Md Faizan",
                  role: "Co-Founder & Designer",
                  image: "/faizan.jpg",
                  description: "Faizan is a creative designer who ensures that the platform is user-friendly and aesthetically appealing for all students.",
                  icon: <FaHeart className="text-pink-500" />
                },
                {
                  name: "Faiz Ahmed",
                  role: "Co-Founder & Architect",
                  image: "/faiz.jpg",
                  description: "Faiz leads the technical vision and architecture of ShareSpace, ensuring a seamless and scalable platform for students to exchange items effortlessly.",
                  icon: <FaLeaf className="text-green-500" />
                }
              ].map((member, index) => (
                <motion.div 
                  key={index} 
                  className="relative group" 
                  variants={itemVariants} 
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                  <div className="relative bg-white p-8 rounded-xl shadow-xl">
                    <div className="flex justify-center mb-6">
                      {/* Gradient Photo Frame */}
                      <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-1 rounded-full">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-32 h-32 rounded-full object-cover shadow-xl transform group-hover:scale-105 transition duration-500"
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        {member.icon}
                        <h3 className="text-xl font-bold ml-2">{member.name}</h3>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">{member.role}</p>
                      <p className="text-gray-700 leading-relaxed">{member.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="features-section py-16" ref={featuresRef}>
  <motion.div className="container mx-auto" variants={containerVariants} initial="hidden" animate={featuresControls}>
    <motion.div className="features-header text-center mb-12" variants={itemVariants}>
      <h2 className="text-4xl font-bold">What We Offer</h2>
      <p className="text-lg text-gray-600">Features that make ShareSpace special</p>
    </motion.div>
    <motion.div className="features-grid grid grid-cols-1 md:grid-cols-3 gap-8" variants={containerVariants}>
      {[
        {
          title: "Free and Fast Delivery",
          description: "Enjoy fast delivery of products within your campus community.",
          icon: <FaHandHoldingUsd className="text-2xl" />,
          gradient: "from-blue-500 to-blue-600"
        },
        {
          title: "24/7 Customer Service",
          description: "Friendly 24/7 support available for all your queries and concerns.",
          icon: <FaUsers className="text-2xl" />,
          gradient: "from-purple-500 to-purple-600"
        },
        {
          title: "Sustainable Reuse",
          description: "Promote sustainability by giving pre-owned items a second life.",
          icon: <FaRecycle className="text-2xl" />,
          gradient: "from-green-500 to-green-600"
        }
      ].map((feature, index) => (
        <motion.div 
          key={index} 
          className="relative group" 
          variants={itemVariants} 
          whileHover={{ y: -10, transition: { duration: 0.3 } }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
          <div className="relative bg-white p-6 rounded-lg shadow-xl transition-all duration-300">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5, transition: { duration: 0.3 } }} 
              className={`text-4xl bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent mb-4 transition-all duration-300`}
            >
              {feature.icon}
            </motion.div>
            <h3 className="text-xl font-bold mb-2 transition-colors duration-300 group-hover:text-gray-800">
              {feature.title}
            </h3>
            <p className="text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
              {feature.description}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  </motion.div>
</section>


        {/* Points System Section */}
        <section className="points-section py-16">
          <motion.div 
            className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="points-content space-y-6">
              <h2 className="text-4xl font-bold">Our Points System</h2>
              <p className="text-lg text-gray-700">
                At ShareSpace, we reward our community members for their contributions:
              </p>
              <ul className="points-list list-disc pl-5 space-y-2">
                <li>
                  <span className="points-highlight font-semibold text-blue-600">20 points</span> awarded when you create a new product
                </li>
                <li>
                  <span className="points-highlight font-semibold text-blue-600">100 points</span> awarded to sellers when an order is delivered
                </li>
                <li>Points can be used for premium features and special promotions</li>
                <li>Complete transaction history tracking for all your point activities</li>
              </ul>
            </div>
            <div className="points-image">
              <img src="/pro.png" alt="Points System" className="rounded-image w-1/4 mx-auto shadow-lg" />
            </div>
          </motion.div>
        </section>
      </div>
    </Structure>
  );
};

export default About;
