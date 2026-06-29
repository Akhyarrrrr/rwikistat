import React from "react";

const Spinner = () => {
  return (
    <div className="flex min-h-[60dvh] w-full items-center justify-center">
      <div className="size-10 animate-spin rounded-full border-4 border-ink-200 border-t-brand-600" />
    </div>
  );
};

export default Spinner;
