import React from "react";

export default function NoopPlugin() {
  return (
    <div className="p-6 text-center text-muted-foreground">
      No plugin active. Configure one in `src/plugins/active.ts`.
    </div>
  );
}


