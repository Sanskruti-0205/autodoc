"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: "http://localhost:3000/reset-password",
      }
    );

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password reset link sent to email");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-lg">

        <h1 className="text-2xl font-bold text-emerald-600 text-center mb-2">
          Reset Password
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Enter your email to receive a reset link
        </p>

        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-4"
        />

        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2 rounded-lg"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </div>
    </div>
  );
}
