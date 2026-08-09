import { createContext } from "react";

// null means "no couple-specific override" — useCoupleConfig() falls back
// to the static config.js demo content in that case.
export const CoupleConfigContext = createContext(null);
