"use client";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { CandidatesProvider } from "./CandidatesContext";

export default function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <SessionProvider>
        <CandidatesProvider>
          {/* Wrap with CandidatesProvider */}
          {children}
        </CandidatesProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
