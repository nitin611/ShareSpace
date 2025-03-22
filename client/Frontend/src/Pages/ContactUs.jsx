import React, { useState, useRef, useEffect } from "react";
import Structure from '../Components/structure/Structure';
import toast from 'react-hot-toast';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import { motion } from 'framer-motion';
import emailjs from "emailjs-com";
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const formRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        'service_6a9rho8', 
        'template_je5ru27', 
        formData,
        '8HLBd9ela5wOFI6qG' 
      )
      .then(
        () => {
          toast.success('Message sent successfully!');
          setFormData({ name: '', email: '', message: '' });
          setFormSubmitted(true);
          setTimeout(() => setFormSubmitted(false), 5000);
        },
        (error) => {
          console.error('EmailJS Error:', error);
          toast.error('Failed to send the message. Please try again.');
        }
      );
  };

  const contactInfo = [
    {
      icon: <FaPhoneAlt />,
      title: "Call Us",
      details: "+91 7992265461",
      color: "#4F46E5"
    },
    {
      icon: <FaEnvelope />,
      title: "Email Us",
      details: "sharespacestore@gmail.com",
      color: "#10B981"
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Visit Us",
      details: "VIT University, Chennai",
      color: "#F59E0B"
    }
  ];

  return (
    <Structure>
      <div className="contact-page">
        <div className="light-effect" style={{ 
          left: `${cursorPosition.x}px`, 
          top: `${cursorPosition.y}px` 
        }}></div>
        
        <div className="contact-container">
          <div className="contact-header">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Get in Touch with Us
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Have questions about ShareSpace? We're here to help you!
            </motion.p>
          </div>

          <div className="contact-content">
            <motion.div 
              className="contact-form-container"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="form-header">
                <h2>Send us a message</h2>
                <p>We'd love to hear from you</p>
              </div>

              <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Your email address"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="How can we help you?"
                    className="form-input"
                  ></textarea>
                </div>
                <motion.button
                  type="submit"
                  className="submit-button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <FiSend className="send-icon" />
                  <span>Send Message</span>
                </motion.button>
              </form>

              {formSubmitted && (
                <motion.div 
                  className="success-message"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="success-icon">✓</div>
                  <h3>Message Sent!</h3>
                  <p>We'll get back to you as soon as possible.</p>
                </motion.div>
              )}
            </motion.div>

            <motion.div 
              className="contact-info-container"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="info-header">
                <h2>Contact Information</h2>
                <p>Reach out to us through any of these channels</p>
              </div>

              <div className="info-cards">
                {contactInfo.map((info, index) => (
                  <motion.div 
                    key={index} 
                    className="info-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                    whileHover={{ 
                      y: -5,
                      boxShadow: `0 15px 30px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05), 0 0 20px ${info.color}40`
                    }}
                  >
                    <div className="card-icon" style={{ backgroundColor: `${info.color}20`, color: info.color }}>
                      {info.icon}
                    </div>
                    <div className="card-content">
                      <h3>{info.title}</h3>
                      <p>{info.details}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="map-container">
                <h3>Our Location</h3>
                <div className="map-frame">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.0417563422523!2d80.15123661464716!3d12.840646590946392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5259af8e491f67%3A0x944b42131b757d2d!2sVellore%20Institute%20of%20Technology%20-%20VIT%20Chennai!5e0!3m2!1sen!2sin!4v1648123456789!5m2!1sen!2sin" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="contact-footer">
          <div className="footer-shape shape-1"></div>
          <div className="footer-shape shape-2"></div>
          <div className="footer-shape shape-3"></div>
        </div>
      </div>
    </Structure>
  );
};

export default ContactUs;
