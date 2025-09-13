import React from "react";
import ActivePlugin from "@/plugins/active";

function CalculatorPage() {
  return (
    <div className="container mx-auto px-6 max-w-6xl py-12 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Surplus Calculator</h1>
      <ActivePlugin />
    </div>
  );
}

export default CalculatorPage;


