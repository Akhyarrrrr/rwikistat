import React from "react";

type PaginationButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  active: boolean;
  disabled: boolean;
};

const PaginationButton = ({
  children,
  onClick,
  active,
  disabled,
}: PaginationButtonProps) => {
  const classes = [
    "inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-semibold transition-colors",
    active ? "border-brand-700 bg-brand-700 text-white" : "border-ink-200 bg-white text-ink-700 hover:bg-brand-50 hover:text-brand-700",
    disabled ? "cursor-not-allowed opacity-45 hover:bg-white hover:text-ink-700" : "",
  ];

  return (
    <button type="button" className={classes.join(" ")} onClick={disabled ? undefined : onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default PaginationButton;
