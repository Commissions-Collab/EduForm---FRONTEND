import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Handle previous page
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // Handle next page
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Show up to 5 page numbers at a time
    const halfWindow = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfWindow);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Adjust startPage if endPage is at the maximum
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Add ellipsis if there are more pages before or after
    if (startPage > 1) {
      pageNumbers.unshift("...");
      pageNumbers.unshift(1);
    }
    if (endPage < totalPages) {
      pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous Button */}
      <button
        className={`p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors ${
          currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          className={`px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium transition-colors ${
            page === currentPage
              ? "bg-indigo-600 text-white border-indigo-600"
              : page === "..."
              ? "text-gray-600 cursor-default"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          }`}
          onClick={() => page !== "..." && onPageChange(page)}
          disabled={page === "..."}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        className={`p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors ${
          currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;
