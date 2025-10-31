import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usePasswordStore from '../../stores/usePasswordStore';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');
  const navigate = useNavigate();

  const { resetPassword, loading, error, successMessage } = usePasswordStore();

  useEffect(() => {
    // Parse token and email from URL query params, then remove token from URL
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token') || '';
    const e = params.get('email') || '';
    // decode token/email in case they were encoded
    const decodedToken = t ? decodeURIComponent(t) : '';
    const decodedEmail = e ? decodeURIComponent(e) : '';
    setToken(decodedToken);
    setEmail(decodedEmail);

    // also set token into the global store so resetPassword() sends it
    try {
      // import from store and set token for automatic inclusion
      // note: usePasswordStore is imported above
      if (decodedToken) {
        // use the store's setField helper
        const { setField } = usePasswordStore.getState();
        setField('token', decodedToken);
        // persist temporarily so refresh/navigation won't lose it
        localStorage.setItem('password_reset_token', decodedToken);
      }
    } catch (err) {
      // ignore if store not available
    }

    // Remove token from URL for security (keep email optional)
    if (t) {
      params.delete('token');
      const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  useEffect(() => {
    // Redirect to sign-in when successMessage appears
    if (successMessage) {
      setTimeout(() => navigate('/sign-in'), 1200);
    }
  }, [successMessage, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    // Use token stored in the global store if component token is empty.
    const storeToken = usePasswordStore.getState().token;
    const tokenToUse = token || storeToken;
    console.debug('Reset submit token:', { tokenFromUrl: token, tokenFromStore: storeToken });
    // don't block client-side if token is missing; server will validate and return any token errors

    // Call resetPassword and pass the token explicitly to guarantee it's included
    await resetPassword({ email, token: tokenToUse, password, password_confirmation });
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-white rounded-xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold mb-1">Reset Password</h2>
        <p className="text-sm text-gray-500 mb-5">Choose a new secure password for your account.</p>

        {successMessage && <div className="p-3 bg-green-50 text-green-700 rounded mb-4">{successMessage}</div>}
        {error && <div className="p-3 bg-yellow-50 text-yellow-800 rounded mb-4">{error}</div>}

        <form onSubmit={submit} className="space-y-4">
          {/* keep token hidden; it's managed by the app/store */}
          <input type="hidden" name="token" value={token} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              className="w-full p-3 border border-gray-200 rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-200 rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-200 rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              value={password_confirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
          </div>

          <div>
            <button
              className={`w-full py-3 rounded-full text-white font-semibold ${loading ? 'bg-gray-400' : 'bg-gradient-to-br from-[#5B3EE6] to-[#3A2CB8]'}`}
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
