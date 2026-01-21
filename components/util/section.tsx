import React from "react";

export const Section = ({ children, className = "" }) => {
  return (
    <section
      className={`relative flex-1 overflow-hidden py-16 sm:py-20 ${className}`}
    >
      {children}
    </section>
  );
};
