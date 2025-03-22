import React, { useEffect } from 'react';
import Structure from '../Components/structure/Structure';
import { FaUsers, FaHandHoldingUsd, FaRecycle, FaGraduationCap, FaHeart, FaLeaf } from 'react-icons/fa';
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
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <Structure>
      <div className="about-page">
        <div className="hero-section">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>About ShareSpace</h1>
            <p>Connecting students through sustainable commerce</p>
          </motion.div>
          <div className="hero-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>

        {/* Our Story Section */}
        <section className="story-section" ref={storyRef}>
          <motion.div
            className="section-container"
            variants={containerVariants}
            initial="hidden"
            animate={storyControls}
          >
            <motion.div className="story-content" variants={itemVariants}>
              <h2>Our Story</h2>
              <p>
                At ShareSpace, we aim to build a sustainable and community-driven platform where students can buy, sell, and exchange college items. 
                Whether it's books, electronics, or other resources, we believe in reusing items to reduce waste and make college life more affordable for everyone.
              </p>
              <p>
                Our platform rewards users with points when they create products, and sellers receive additional points when their orders are delivered. This points system encourages active participation and helps build a thriving marketplace community.
              </p>
            </motion.div>
            <motion.div className="story-image" variants={itemVariants}>
              <img
                src="/ban-2.jpg"
                alt="About Us"
                className="rounded-image"
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Metrics Section */}
        <section className="metrics-section" ref={metricsRef}>
          <motion.div
            className="section-container"
            variants={containerVariants}
            initial="hidden"
            animate={metricsControls}
          >
            <motion.div className="metrics-header" variants={itemVariants}>
              <h2>Our Impact</h2>
              <p>Growing stronger with each transaction</p>
            </motion.div>
            <motion.div className="metrics-grid" variants={containerVariants}>
              {[
                { value: '2.5k', label: 'Sellers online', color: 'blue' },
                { value: '13k', label: 'Monthly sales', color: 'purple' },
                { value: '4.5k', label: 'Active customers', color: 'pink' },
                { value: '25k', label: 'Annual transactions', color: 'indigo' }
              ].map((metric, index) => (
                <motion.div
                  key={index}
                  className={`metric-card ${metric.color}`}
                  variants={itemVariants}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                >
                  <h3>{metric.value}</h3>
                  <p>{metric.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Team Section */}
        <section className="team-section" ref={teamRef}>
          <motion.div
            className="section-container"
            variants={containerVariants}
            initial="hidden"
            animate={teamControls}
          >
            <motion.div className="team-header" variants={itemVariants}>
              <h2>Meet Our Team</h2>
              <p>The minds behind ShareSpace</p>
            </motion.div>
            <motion.div className="team-grid" variants={containerVariants}>
              {[
                {
                  name: "Nitin Kumar Jhaa",
                  role: "Co-Founder & Developer",
                  image: "/nitin.jpeg",
                  description: "Nitin is passionate about web development and sustainability. He built this platform to help students connect and share valuable resources.",
                  icon: <FaGraduationCap className="team-icon blue" />
                },
                {
                  name: "Md Faizan",
                  role: "Co-Founder & Designer",
                  image: "/faizan.jpg",
                  description: "Faizan is a creative designer who ensures that the platform is user-friendly and aesthetically appealing for all students.",
                  icon: <FaHeart className="team-icon pink" />
                },
                {
                  name: "Faiz Ahmed",
                  role: "Co-Founder & Architect",
                  image: "/faiz.jpg",
                  description: "Faiz leads the technical vision and architecture of ShareSpace, ensuring a seamless and scalable platform for students to exchange items effortlessly.",
                  icon: <FaLeaf className="team-icon green" />
                }
              ].map((member, index) => (
                <motion.div
                  key={index}
                  className="team-card"
                  variants={itemVariants}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                >
                  <div className="member-image-container">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="member-image"
                    />
                  </div>
                  <div className="member-info">
                    <div className="member-name">
                      {member.icon}
                      <h3>{member.name}</h3>
                    </div>
                    <p className="member-role">{member.role}</p>
                    <p className="member-description">{member.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="features-section" ref={featuresRef}>
          <motion.div
            className="section-container"
            variants={containerVariants}
            initial="hidden"
            animate={featuresControls}
          >
            <motion.div className="features-header" variants={itemVariants}>
              <h2>What We Offer</h2>
              <p>Features that make ShareSpace special</p>
            </motion.div>
            <motion.div className="features-grid" variants={containerVariants}>
              {[
                {
                  title: "Free and Fast Delivery",
                  description: "Enjoy fast delivery of products within your campus community.",
                  icon: <FaHandHoldingUsd className="feature-icon" />,
                  color: "blue"
                },
                {
                  title: "24/7 Customer Service",
                  description: "Friendly 24/7 support available for all your queries and concerns.",
                  icon: <FaUsers className="feature-icon" />,
                  color: "purple"
                },
                {
                  title: "Sustainable Reuse",
                  description: "Promote sustainability by giving pre-owned items a second life.",
                  icon: <FaRecycle className="feature-icon" />,
                  color: "green"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className={`feature-card ${feature.color}`}
                  variants={itemVariants}
                  whileHover={{ 
                    y: -10,
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className="feature-icon-container">
                    {feature.icon}
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Points System Section */}
        <section className="points-section">
          <motion.div 
            className="section-container"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="points-content">
              <h2>Our Points System</h2>
              <p>At ShareSpace, we reward our community members for their contributions:</p>
              <ul className="points-list">
                <li>
                  <span className="points-highlight">20 points</span> awarded when you create a new product
                </li>
                <li>
                  <span className="points-highlight">100 points</span> awarded to sellers when an order is delivered
                </li>
                <li>
                  Points can be used for premium features and special promotions
                </li>
                <li>
                  Complete transaction history tracking for all your point activities
                </li>
              </ul>
            </div>
            <div className="points-image">
              <img src="/pro.png" alt="Points System" className="rounded-image" />
            </div>
          </motion.div>
        </section>
      </div>
    </Structure>
  );
};

export default About;
