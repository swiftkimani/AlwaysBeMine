import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient.js";
import { useAuth } from "../hooks/useAuth.js";
import { slugify } from "../utils/slugify.js";

export default function Signup() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [partnerAName, setPartnerAName] = useState("");
  const [partnerBName, setPartnerBName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  if (session) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!supabase) {
      setError("Sign-up isn't configured yet — the site's Supabase connection is missing.");
      return;
    }
    setSubmitting(true);

    // Partner names + a slug guess ride along as user metadata — the
    // couples row itself gets created on first Dashboard visit (see
    // Dashboard.jsx), since if the project requires email confirmation
    // there's no active session yet to satisfy the owner-write RLS policy.
    const slugGuess = slugify(`${partnerAName}-and-${partnerBName}`) || slugify(email.split("@")[0]);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { partner_a_name: partnerAName, partner_b_name: partnerBName, slug: slugGuess } },
    });

    setSubmitting(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    if (data.session) {
      navigate("/dashboard");
    } else {
      setCheckEmail(true);
    }
  };

  if (checkEmail) {
    return (
      <div className="min-h-dvh flex items-center justify-center px-4">
        <div className="liquid card-pad-md w-full max-w-sm rounded-3xl text-center space-y-2">
          <h1 className="text-2xl font-bold text-zinc-800">Check your email</h1>
          <p className="text-sm text-zinc-600">
            We sent a confirmation link to <strong>{email}</strong>. Confirm it, then sign in.
          </p>
          <Link to="/login" className="text-love font-semibold text-sm inline-block mt-2">
            Go to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="liquid card-pad-md w-full max-w-sm rounded-3xl space-y-4">
        <h1 className="text-2xl font-bold text-zinc-800">Create your page</h1>

        <label className="block text-sm font-medium text-zinc-700">
          Your name
          <input
            required
            value={partnerAName}
            onChange={(e) => setPartnerAName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-love"
          />
        </label>

        <label className="block text-sm font-medium text-zinc-700">
          Partner's name
          <input
            required
            value={partnerBName}
            onChange={(e) => setPartnerBName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-love"
          />
        </label>

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
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-love"
          />
        </label>

        {error && <p className="text-sm text-love">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
          {submitting ? "Creating..." : "Create account"}
        </button>

        <p className="text-sm text-zinc-600 text-center">
          Already have an account? <Link to="/login" className="text-love font-semibold">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
