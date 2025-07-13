import React from "react";

const PaginationControls = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}) => (
  <div className="mt-4 flex justify-between items-center">
    <button
      onClick={onPrevious}
      disabled={currentPage === 1}
      className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
    >
      Previous
    </button>
    <span className="text-sm text-gray-700">
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={onNext}
      disabled={currentPage === totalPages}
      className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
    >
      Next
    </button>
  </div>
);

export default PaginationControls;
