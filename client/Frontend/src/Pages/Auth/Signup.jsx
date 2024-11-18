import React, { useState, useRef } from 'react';
import Structure from '../../Components/structure/Structure';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

      // Move to the next input field if it's not the last one
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
      toast.error('Please fill  all required fields');
      return;
    }
    try {
      
      const res = await axios.post('http://localhost:8080/api/auth/otp', { email });
      if (res.data.success) {
        toast.success('OTP sent successfully. Check your email!');
        setOtpSent(true);
        setCanResendOtp(false);
        setTimer(150);
        startTimer();
      } 
      else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Enter the Correct Details.');
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
      const res = await axios.post('http://localhost:8080/api/auth/signup', { ...formData, otp });
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
      <div className="min-h-screen flex">
        {/* Left Side */}
        <div className="w-1/2 bg-gradient-to-r from-blue-400 to-indigo-500 relative flex justify-center items-center">
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="relative">
              <h1 className="text-white text-4xl font-bold text-center">Welcome to Sharespace</h1>
              <p className="text-white text-lg mt-4 text-center">
                A platform for buying and selling within your college community.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-1/2 flex justify-center items-center bg-white p-8">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-semibold text-center text-gray-800">
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
                    className="w-full p-4 text-gray-700 border rounded-lg"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                    className="w-full p-4 text-gray-700 border rounded-lg"
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required 
                    className="w-full p-4 text-gray-700 border rounded-lg"
                  />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full p-4 text-gray-700 border rounded-lg"
                  />
                  <input
                    type="text"
                    name="collegeId"
                    placeholder="College ID"
                    value={formData.collegeId}
                    onChange={handleInputChange}
                    required
                    className="w-full p-4 text-gray-700 border rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleOtpSend}
                    className="w-full py-3 bg-indigo-600 text-white rounded-lg shadow-md"
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
                        ref={otpRefs[index]} // Attach ref for auto-focus
                        className="w-16 p-4 text-center text-gray-700 border rounded-lg"
                      />
                    ))}
                  </div>
                  <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-lg shadow-md">
                    Complete Signup
                  </button>
                  {canResendOtp ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="w-full mt-4 py-2 bg-gray-600 text-white rounded-lg"
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
