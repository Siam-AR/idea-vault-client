import React from "react";

interface LoaderProps {
  message?: string;
}

export default function Loader({ message = "Loading..." }: LoaderProps) {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-theme-muted">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-purple-500 dark:border-slate-700" />
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}
