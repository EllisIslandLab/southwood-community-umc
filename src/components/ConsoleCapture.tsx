"use client";

import { useEffect } from "react";

/**
 * Forwards console output and fetch/network activity to the parent window
 * when this site is embedded in an iframe (e.g. the Mission Control portal
 * preview). Does nothing when the site is viewed normally (not in an
 * iframe). Wrapped defensively so it can never break the site itself.
 */
export function ConsoleCapture() {
  useEffect(() => {
    try {
      if (typeof window === "undefined" || window.self === window.top) {
        return;
      }

      const post = (payload: Record<string, unknown>) => {
        try {
          window.parent.postMessage(payload, "*");
        } catch {
          // ignore
        }
      };

      const levels: Array<"log" | "warn" | "error"> = ["log", "warn", "error"];
      const originalConsole: Partial<Record<string, (...args: unknown[]) => void>> = {};

      levels.forEach((level) => {
        originalConsole[level] = console[level].bind(console);
        console[level] = (...args: unknown[]) => {
          try {
            post({
              type: "console",
              level,
              message: args
                .map((a) => (typeof a === "string" ? a : safeStringify(a)))
                .join(" "),
              timestamp: Date.now(),
            });
          } catch {
            // ignore
          }
          originalConsole[level]?.(...args);
        };
      });

      const originalFetch = window.fetch.bind(window);
      window.fetch = async (...args: Parameters<typeof fetch>) => {
        const start = Date.now();
        const input = args[0];
        const method = (args[1]?.method || "GET").toUpperCase();
        const url =
          typeof input === "string"
            ? input
            : input instanceof URL
              ? input.toString()
              : (input as Request).url;

        try {
          const response = await originalFetch(...args);
          try {
            post({
              type: "network",
              level: response.ok ? "log" : "warn",
              message: `${method} ${url} → ${response.status} (${Date.now() - start}ms)`,
              timestamp: Date.now(),
            });
          } catch {
            // ignore
          }
          return response;
        } catch (err) {
          try {
            post({
              type: "network",
              level: "error",
              message: `${method} ${url} → failed (${Date.now() - start}ms)`,
              timestamp: Date.now(),
            });
          } catch {
            // ignore
          }
          throw err;
        }
      };

      return () => {
        levels.forEach((level) => {
          if (originalConsole[level]) {
            console[level] = originalConsole[level]!;
          }
        });
        window.fetch = originalFetch;
      };
    } catch {
      // ignore — never let this break the site
    }
  }, []);

  return null;
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}
