import React from "react";
import PaginationButton from "./PaginationButton";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  active?: false;
  disabled?: true;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps): JSX.Element => {
  const previousPage = currentPage - 1;
  const nextPage = currentPage + 1;

  return (
    <div className="mt-6 flex flex-wrap justify-center gap-2">
      {previousPage > 0 ? (
        <PaginationButton
          onClick={() => onPageChange(previousPage)}
          active={false}
          disabled={false}
        >
          Previous
        </PaginationButton>
      ) : (
        <PaginationButton
          disabled={true}
          onClick={function (): void {
            throw new Error("Function not implemented.");
          }}
          active={false}
        >
          Previous
        </PaginationButton>
      )}

      {Array.from({ length: totalPages }).map((_, i) => (
        <PaginationButton
          key={i + 1}
          active={i + 1 === currentPage}
          onClick={() => onPageChange(i + 1)}
          disabled={false}
        >
          {i + 1}
        </PaginationButton>
      ))}

      {nextPage <= totalPages ? (
        <PaginationButton
          onClick={() => onPageChange(nextPage)}
          active={false}
          disabled={false}
        >
          Next
        </PaginationButton>
      ) : (
        <PaginationButton
          disabled={true}
          onClick={function (): void {
            throw new Error("Function not implemented.");
          }}
          active={false}
        >
          Next
        </PaginationButton>
      )}
    </div>
  );
};

export default Pagination;
