import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient.js";
import { useAuth } from "../hooks/useAuth.js";

export default function Login() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (session) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!supabase) {
      setError("Sign-in isn't configured yet — the site's Supabase connection is missing.");
      return;
    }
    setSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    navigate("/dashboard");
  };

  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="liquid card-pad-md w-full max-w-sm rounded-3xl space-y-4">
        <h1 className="text-2xl font-bold text-zinc-800">Sign in</h1>

        <label className="block text-sm font-medium text-zinc-700">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-love"
          />
        </label>

        <label className="block text-sm font-medium text-zinc-700">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-love"
          />
        </label>

        {error && <p className="text-sm text-love">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
          {submitting ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-sm text-zinc-600 text-center">
          No account yet? <Link to="/signup" className="text-love font-semibold">Create one</Link>
        </p>
      </form>
    </div>
  );
}
