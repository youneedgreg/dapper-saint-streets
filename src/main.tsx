import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Log on every page load/refresh
try {
  const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
  const navType = navEntries && navEntries[0] ? navEntries[0].type : (document?.referrer ? "navigate" : "unknown");
  const isReload = navType === "reload";
  console.log("[AppRefresh] navigation", { isReload, navType, href: window.location.href, time: new Date().toISOString() });
} catch (e) {
  console.warn("[AppRefresh] navigation log failed", e);
}

window.addEventListener("pageshow", (event) => {
  // Fired on normal loads and bfcache restores
  console.log("[AppRefresh] pageshow", { persisted: (event as PageTransitionEvent).persisted, href: window.location.href });
});

createRoot(document.getElementById("root")!).render(<App />);
