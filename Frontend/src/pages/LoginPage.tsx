import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import XenoLogo from "@/components/XenoLogo";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async (response: any) => {
    try {
      const { credential } = response;
      toast.loading("Logging in with Google...", { duration: 2000 });

      const res = await axios.post(
        `https://customer-relationship-management-pi.vercel.app/api/auth/google-login`,
        { tokenId: credential }
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);
        toast.success("Google login successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google login failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-xeno-secondary via-blue-100 to-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30" />
      <div className="absolute w-80 h-80 bg-blue-200/20 rounded-full -top-48 -left-48" />
      <div className="absolute w-96 h-96 bg-purple-200/20 rounded-full -bottom-64 -right-64" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 w-full max-w-md border border-white/20 hover:shadow-2xl transition-shadow duration-300"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="flex flex-col items-center"
        >
          <div className="mb-8 hover:scale-105 transition-transform duration-300">
            <XenoLogo className="w-32 h-32" />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-xeno-primary to-xeno-secondary bg-clip-text text-transparent mb-2">
              Welcome to Xeno CRM
            </h1>
            <p className="text-gray-600 font-medium">
              Streamline your customer management with AI-powered insights
            </p>
          </motion.div>

          <div className="w-full space-y-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/80 px-2 text-gray-500 font-medium">
                  Continue with
                </span>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex justify-center"
            >
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => toast.error("Google login failed")}
                useOneTap
                shape="circle"
                size="large"
                theme="filled_black"
                containerProps={{ 
                  className: "w-full hover:shadow-lg transition-shadow",
                  "data-testid": "google-login-button"
                }}
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center text-sm text-gray-600"
          >
            <p>
              By continuing, you agree to our{" "}
              <a
                href="/terms"
                className="text-xeno-primary hover:text-xeno-secondary font-semibold transition-colors"
              >
                Terms
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="text-xeno-primary hover:text-xeno-secondary font-semibold transition-colors"
              >
                Privacy
              </a>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;