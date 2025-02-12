import React, { useState, useRef } from 'react';
import Structure from '../../Components/structure/Structure';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../apiConfig';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    collegeId: '',
    otp: ['', '', '', '', '', ''], 
  });
  const [otpSent, setOtpSent] = useState(false);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [timer, setTimer] = useState(10);
  const navigate = useNavigate();

  const otpRefs = Array.from({ length: 6 }, () => useRef(null));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    if (value === '' || /^\d$/.test(value)) { 
      const updatedOtp = [...formData.otp];
      updatedOtp[index] = value;
      setFormData({ ...formData, otp: updatedOtp });

      if (value && index < 5) {
        otpRefs[index + 1].current.focus();
      } else if (!value && index > 0) {
        otpRefs[index - 1].current.focus(); 
      }
    }
  };

  const handleOtpSend = async () => {
    const { email, password, collegeId } = formData;
  
    if (!email || !password || !collegeId) {
      toast.error('Please fill all required fields');
      return;
    }
  
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/otp`, { email, collegeId });
      if (res.data.success) {
        toast.success('OTP sent successfully. Check your email!');
        setOtpSent(true);
        setCanResendOtp(false);
        setTimer(150);
        startTimer();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        toast.error('User Already registered');
      } else {
        toast.error('Enter the Correct Details.');
      }
    }
  };

  const startTimer = () => {
    let countdown = 150;
    const interval = setInterval(() => {
      countdown -= 1;
      setTimer(countdown);
      if (countdown <= 0) {
        clearInterval(interval);
        setCanResendOtp(true);
      }
    }, 1000);
  };

  const handleResendOtp = async () => {
    await handleOtpSend();
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const otp = formData.otp.join(''); 
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/signup`, { ...formData, otp });
      if (res.data.success) {
        toast.success('Signup successful!');
        navigate('/signin');
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Signup failed. Please try again.');
    }
  };

  return (
    <Structure>
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Left Side */}
        <div className="w-full md:w-1/2 relative flex justify-center items-center mb-4 md:mb-0">
          <video
            autoPlay
            
            muted
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/signup.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 bg-gradient-to-r from-blue-100 to-blue-200 relative flex justify-center items-center">
        <div className="w-full max-w-md p-4 sm:p-6 rounded-lg shadow-lg bg-white bg-opacity-80">
            <h2 className="text-3xl font-semibold text-center text-blue-800">
              {otpSent ? 'Verify OTP & Sign Up' : 'Sign Up'}
            </h2>
            <form onSubmit={otpSent ? handleSignup : (e) => e.preventDefault()} className="space-y-6 mt-8">
              {!otpSent && (
                <>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-4 text-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email  (Only Vit mail Id)"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-4 text-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full p-4 text-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full p-4 text-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    name="collegeId"
                    placeholder="College ID"
                    value={formData.collegeId}
                    onChange={handleInputChange}
                    required
                    className="w-full p-4 text-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleOtpSend}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                  >
                    Send OTP
                  </button>
                </>
              )}
              {otpSent && (
                <>
                  <div className="flex space-x-2">
                    {formData.otp.map((otpValue, index) => (
                      <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={otpValue}
                      onChange={(e) => handleOtpChange(e, index)}
                      ref={otpRefs[index]} 
                      className="w-full sm:w-16 p-3 text-center text-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />                    
                    ))}
                  </div>
                  <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                    Complete Signup
                  </button>
                  {canResendOtp ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="w-full mt-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Resend OTP
                    </button>
                  ) : (
                    <p className="text-sm text-gray-500 text-center mt-2">
                      Resend OTP in {timer} seconds
                    </p>
                  )}
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </Structure>
  );
};

export default Signup;
