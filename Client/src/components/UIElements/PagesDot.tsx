import React from "react";

interface PagesDotPropsType {
  currentPage: number;
  totalPages: number;
}

export const PagesDot = ({ currentPage, totalPages }: PagesDotPropsType) => {
  const [pagesDot, setPagesDot] = React.useState<Array<number>>([
    ...Array(totalPages),
  ]);
  React.useEffect(() => {
    setPagesDot([...Array(totalPages)]);
  }, [totalPages]);
  return (
    <div className="grid grid-flow-col gap-1 w-fit m-auto">
      {pagesDot.map((value, index) => {
        return (
          <div
            className={`w-3 h-3 rounded-full transition duration-300 ${
              currentPage === index ? "bg-white" : "bg-neutral-500"
            }`}
          />
        );
      })}
    </div>
  );
};
