import React from "react";

export const Section = ({ children, className = "" }) => {
  return (
    <section
      className={`relative flex-1 overflow-hidden py-16 sm:py-20 transition-all duration-200 ease-out ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-white/90 via-white/75 to-slate-100"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-20 left-10 h-56 w-56 rounded-full bg-amber-300/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 right-6 h-64 w-64 rounded-full bg-emerald-200/20 blur-3xl"
        aria-hidden="true"
      />
      {children}
    </section>
  );
};
