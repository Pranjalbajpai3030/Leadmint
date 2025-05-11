import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import XenoLogo from "@/components/XenoLogo";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  // Google login handler
  const handleGoogleLogin = async (response: any) => {
    try {
      const { credential } = response;
      toast.loading("Logging in with Google...", { duration: 2000 });

      const res = await axios.post(
        `https://customer-relationship-management-pi.vercel.app/api/auth/google-login`,
        {
          tokenId: credential,
        }
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);
        toast.success("Google login successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("Google login error:", error);
      toast.error("Google login failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-xeno-secondary to-white">
      <div className="xeno-card max-w-md w-full flex flex-col items-center p-8">
        <div className="mb-8">
          <XenoLogo />
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Welcome to Xeno CRM
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Sign in to access your customer management platform
        </p>

        {/* Google Login */}
        <div className="mt-6 w-full">
          <h5 className="text-xs text-gray-500 text-center mb-3">OR</h5>
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => toast.error("Google login failed")}
            useOneTap
            shape="circle"
            size="large"
            theme="filled_black"
            containerProps={{ className: "w-full" }}
          />
        </div>

        <h6 className="text-xs text-gray-500 text-center mt-4">
          By signing in, you agree to our{" "}
          <a href="/terms" className="text-blue-500">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-blue-500">
            Privacy Policy
          </a>
          .
        </h6>
      </div>
    </div>
  );
};

export default LoginPage;
