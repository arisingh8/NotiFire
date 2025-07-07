"use client";

import { useState } from "react";
import Link from "next/link";
import Input from "@/app/components/form/input";
import Button from "@/app/components/button";
import { login } from "./actions";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, _setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 overflow-hidden fixed inset-0">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#ffdbbb] mb-2 font-(family-name:--font-eb-garamond)">
            Welcome Back
          </h1>
          <p className="text-gray-400 font-(family-name:--font-eb-garamond)">
            Sign in to your account
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-800/50 text-red-100 rounded-lg text-center">
            {error}
          </div>
        )}

        <form
          className="bg-gray-800 rounded-lg shadow-xl p-8 space-y-6"
          action={login}
        >
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
            labelClassName="text-lg"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
            labelClassName="text-lg"
          />

          <Button
            type="submit"
            disabled={isLoading}
            className={`
              w-full
              px-6
              py-3
              bg-[#ffdbbb]
              text-gray-900
              rounded-lg
              font-bold
              transition-opacity
              ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}
            `}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>

          <div className="text-center mt-4">
            <p className="text-gray-400 font-(family-name:--font-eb-garamond)">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-[#ffdbbb] hover:underline font-(family-name:--font-eb-garamond)"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
