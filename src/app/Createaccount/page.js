"use client";
import React, { useState } from "react";
import axios from "axios";

const Page = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
    username: "",
    profilephoto: "",
  });
  const [otp, setOtp] = useState(""); // State for OTP input
  const [otpSent, setOtpSent] = useState(false); // Track if OTP was sent
  const [isVerified, setIsVerified] = useState(false); // Track if OTP is verified

  // Handle input changes for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  // Send OTP to email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/send-otp", {
        email: data.email,
      });
      if (response.status === 200) {
        alert("OTP sent to your email!");
        setOtpSent(true);
      }
    } catch (error) {
      alert("Failed to send OTP. Check your email and try again.");
      console.error("Error sending OTP:", error);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/verify-otp", {
        email: data.email,
        otp,
      });
      if (response.status === 200) {
        alert("OTP verified successfully!");
        setIsVerified(true);
        setOtpSent(false); // Hide OTP input after verification
      }
    } catch (error) {
      alert("Invalid or expired OTP. Please try again.");
      console.error("Error verifying OTP:", error);
    }
  };

  // Submit form to create account
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isVerified) {
      alert("Please verify your email with OTP first!");
      return;
    }

    try {
      console.log("Data sending:", data);
      const response = await axios.post("http://localhost:5000/createaccount", {
        ...data,
        isVerified, // Pass verification status
      });
      if (response.status === 200) {
        alert("Account created successfully!");
        setData({ email: "", password: "", username: "", profilephoto: "" });
        setIsVerified(false); // Reset for next user
      }
    } catch (error) {
      alert("Username or email already exists!");
      console.error("Error creating account:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-green-200 p-8 rounded-lg shadow-lg w-full max-w-md bg-opacity-75">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        <form onSubmit={otpSent ? handleVerifyOtp : handleSubmit}>
          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-black text-lg font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-green-500 font-semibold leading-tight focus:outline-none focus:shadow-outline border-green"
              id="email"
              type="email"
              placeholder="Enter your email"
              name="email"
              value={data.email}
              onChange={handleChange}
              required
              disabled={otpSent || isVerified} // Disable after OTP sent or verified
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-black text-lg font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-green-500 font-semibold mb-3 leading-tight focus:outline-none focus:shadow-outline border-green"
              id="password"
              type="password"
              placeholder="Enter your password"
              name="password"
              value={data.password}
              onChange={handleChange}
              required
              disabled={otpSent || isVerified} // Disable during OTP phase
            />
          </div>

          {/* Username Field */}
          <div className="mb-4">
            <label className="block text-black text-lg font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-green-500 font-semibold mb-3 leading-tight focus:outline-none focus:shadow-outline border-green"
              id="username"
              type="text"
              placeholder="Enter your identity"
              name="username"
              value={data.username}
              onChange={handleChange}
              required
              disabled={otpSent || isVerified} // Disable during OTP phase
            />
          </div>

          {/* Profile Photo Field */}
          <div className="mb-6">
            <label className="block text-black text-lg font-bold mb-2" htmlFor="profilephoto">
              Profile Photo
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-green-500 font-semibold leading-tight focus:outline-none focus:shadow-outline border-green"
              id="profilephoto"
              type="text"
              placeholder="Profile photo URL"
              name="profilephoto"
              value={data.profilephoto}
              onChange={handleChange}
              required
              disabled={otpSent || isVerified} // Disable during OTP phase
            />
          </div>

          {/* OTP Input (shown only when OTP is sent) */}
          {otpSent && !isVerified && (
            <div className="mb-6">
              <label className="block text-black text-lg font-bold mb-2" htmlFor="otp">
                Enter OTP
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-green-500 font-semibold leading-tight focus:outline-none focus:shadow-outline border-green"
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-center gap-4">
            {!otpSent && !isVerified && (
              <button
                className="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-40 h-11 flex items-center justify-center bg-cover bg-center bg-opacity-20"
                type="button"
                onClick={handleSendOtp}
                style={{
                  backgroundImage:
                    "url('https://imgs.search.brave.com/W6fSD_1MpkGA5roJvqQQZEM17mlGu4DloXinml4eGeI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dHRndG1lZGlhLmNv/bS9ybXMvY29tcHV0/ZXJ3ZWVrbHkvSGFj/a2VyLXN0ZXJlb3R5/cGUtaG9vZGllLWNv/ZGUtYWRvYmUtODAw/cHguanBlZw')",
                }}
              >
                Send OTP
              </button>
            )}
            {otpSent && !isVerified && (
              <button
                className="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-40 h-11 flex items-center justify-center bg-cover bg-center bg-opacity-20"
                type="submit"
                style={{
                  backgroundImage:
                    "url('https://imgs.search.brave.com/W6fSD_1MpkGA5roJvqQQZEM17mlGu4DloXinml4eGeI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dHRndG1lZGlhLmNv/bS9ybXMvY29tcHV0/ZXJ3ZWVrbHkvSGFj/a2VyLXN0ZXJlb3R5/cGUtaG9vZGllLWNv/ZGUtYWRvYmUtODAw/cHguanBlZw')",
                }}
              >
                Verify OTP
              </button>
            )}
            {isVerified && (
              <button
                className="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-40 h-11 flex items-center justify-center bg-cover bg-center bg-opacity-20"
                type="submit"
                style={{
                  backgroundImage:
                    "url('https://imgs.search.brave.com/W6fSD_1MpkGA5roJvqQQZEM17mlGu4DloXinml4eGeI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dHRndG1lZGlhLmNv/bS9ybXMvY29tcHV0/ZXJ3ZWVrbHkvSGFj/a2VyLXN0ZXJlb3R5/cGUtaG9vZGllLWNv/ZGUtYWRvYmUtODAw/cHguanBlZw')",
                }}
              >
                Create Account
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;