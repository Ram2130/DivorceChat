import { callApi } from "@/lib/utils";
import React, { useState } from "react";

export default function LoginOtpCard() {
  const [step, setStep] = useState("login"); // "login" | "otp"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const handleGetOtp = async (e) => {
    e.preventDefault();
    if (!email) return alert("Please enter your email");
    if (!password) return alert("Please enter your email");
    

    
      try {
            const data =  await callApi('post','/login',{email,password});
            console.log("profile Data",data);
          console.log("Sending OTP to:", email);
    setTimeout(() => {
      alert("OTP sent to your email!");
      setStep("otp");
    }, 1000); 
            
      } catch (error) {
        console.log(error.message);
    
       
    }
      
    // simulate API call
    
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return alert("Please enter OTP");
 const data =  await callApi('post','/verify-otp',{email,password});
    
    console.log("Verifying OTP:", otp);
    setTimeout(() => {
      alert("OTP verified successfully!");
      setStep("done");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          {step === "login" && "Login with Email"}
          {step === "otp" && "Verify OTP"}
          {step === "done" && "✅ Verified Successfully"}
        </h2>

        {step === "login" && (
          <form onSubmit={handleGetOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
               <input
                type="password"
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Get OTP
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
              <input
                type="text"
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-center tracking-widest"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Verify OTP
            </button>

            <button
              type="button"
              onClick={() => setStep("login")}
              className="w-full text-sm text-indigo-600 hover:underline"
            >
              Change Email
            </button>
          </form>
        )}

        {step === "done" && (
          <div className="text-center space-y-3">
            <p className="text-green-700 font-medium">You’re successfully logged in!</p>
            <button
              onClick={() => setStep("login")}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
