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
    "inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700",
    active ? "bg-blue-500 text-white" : "hover:bg-gray-100",
  ];

  return (
    <button type="button" className={classes.join(" ")} onClick={onClick}>
      {children}
    </button>
  );
};

export default PaginationButton;
