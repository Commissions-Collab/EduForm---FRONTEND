import React, { useState } from "react";
import { Link } from "react-router-dom";
import usePasswordStore from "../../stores/usePasswordStore";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const { sendResetLink, loading, error, successMessage } = usePasswordStore();

  const submit = async (e) => {
    e.preventDefault();
    await sendResetLink(email);
  };

  return (
    <div className="w-full max-w-lg p-6 sm:p-8 md:p-10">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 md:p-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Forgot Password</h2>
          <p className="text-sm text-gray-500 mb-6">
            Enter your account email and we'll send a secure link to reset your password.
          </p>

          {successMessage ? (
            <div className="p-4 bg-green-50 border border-green-100 rounded mb-4">
              <p className="text-green-700">{successMessage}</p>
              <p className="text-sm text-gray-600 mt-2">Check your email for the reset link. If you don't see it, check your spam folder.</p>
              <div className="mt-4">
                <Link to="/sign-in" className="text-sm text-[#3730A3] hover:underline">Back to sign in</Link>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4" noValidate>
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="flex items-center bg-white rounded-full shadow-[0_6px_18px_rgba(45,35,60,0.06)] px-4 py-2 border border-transparent hover:border-gray-100 transition">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-500 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="M2.94 6.94A2 2 0 014 6h12a2 2 0 011.06.94L10 11 2.94 6.94z" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M18 8.1V14a2 2 0 01-2 2H4a2 2 0 01-2-2V8.1l8 4.9 8-4.9z" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    aria-required="true"
                    aria-describedby="email-help"
                    placeholder="you@school.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`flex-1 bg-transparent outline-none text-sm placeholder-gray-400 ${/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'text-gray-900' : 'text-gray-700'}`}
                  />
                  <div className="ml-3">
                    {/* validation indicator */}
                    {email.length > 0 && (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? (
                      <span className="text-green-500">✓</span>
                    ) : (
                      <span className="text-red-500">✕</span>
                    ))}
                  </div>
                </div>
                <p id="email-help" className="mt-2 text-xs text-gray-500">We'll send a password reset link to this email if it's registered. Check spam if you don't see it.</p>
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-full text-white font-semibold shadow-lg transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-br from-[#5B3EE6] to-[#3A2CB8] hover:scale-[0.995]'}`}
                  disabled={loading}
                >
                  <span className="text-sm">{loading ? 'Sending...' : 'Send Reset Link'}</span>
                </button>
                <div className="mt-3 text-center">
                  <Link to="/sign-in" className="text-sm text-gray-600 hover:underline">Back to sign in</Link>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
