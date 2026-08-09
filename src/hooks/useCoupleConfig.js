import { useContext } from "react";
import { CoupleConfigContext } from "../context/CoupleConfigContext.js";
import staticConfig from "../config.js";

// Every place that used to `import config from "../config.js"` now calls
// this instead. Unwrapped (the "/" demo route), it returns the exact same
// static config.js as before. Wrapped in a <CoupleConfigContext.Provider>
// (the "/c/:slug" public route), it returns that couple's merged config.
export default function useCoupleConfig() {
  const ctx = useContext(CoupleConfigContext);
  return ctx || staticConfig;
}
