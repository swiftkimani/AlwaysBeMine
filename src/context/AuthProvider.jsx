import useAuthSession from "../hooks/useAuthSession.js";
import { AuthContext } from "./AuthContext.js";

// One session subscription shared by the whole app via context, instead of
// every consumer (ProtectedRoute, Dashboard, Nav, ...) opening its own
// supabase.auth.onAuthStateChange listener.
export function AuthProvider({ children }) {
  const { session, loading } = useAuthSession();
  return <AuthContext.Provider value={{ session, loading }}>{children}</AuthContext.Provider>;
}
