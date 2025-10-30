import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  BookOpen,
  Trash2,
  Edit,
  Eye,
  Filter,
  AlertTriangle,
  Loader,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useTextbookStore from "../../stores/superAdmin/useTextbookStore";
import TextbookModal from "../../components/superadmin/TextbookModal";

const Textbook = () => {
  const {
    textbooks,
    loading,
    isDeleting,
    deleteConfirmId,
    isModalOpen,
    modalMode,
    selectedBook,
    searchTerm,
    filterCategory,
    filterStatus,
    currentPage,
    fetchTextbooks,
    deleteTextbook,
    openModal,
    closeModal,
    setDeleteConfirmId,
    setSearchTerm,
    setFilterCategory,
    setFilterStatus,
    setCurrentPage,
    getFilteredTextbooks,
    getPaginatedTextbooks,
    getTotalPages,
  } = useTextbookStore();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchTextbooks();
  }, [fetchTextbooks]);

  const filteredTextbooks = getFilteredTextbooks();
  const paginatedTextbooks = getPaginatedTextbooks();
  const totalPages = getTotalPages();

  // Calculate statistics
  const totalBooks = textbooks.length;
  const totalCopies = textbooks.reduce(
    (sum, book) => sum + (book.total_copies || 0),
    0
  );
  const totalIssued = textbooks.reduce(
    (sum, book) =>
      sum + ((book.total_copies || 0) - (book.available_quantity || 0)),
    0
  );
  const totalAvailable = textbooks.reduce(
    (sum, book) => sum + (book.available_quantity || 0),
    0
  );
  const totalOverdue = textbooks.reduce(
    (sum, book) => sum + (book.overdue_count || 0),
    0
  );

  // Get unique categories
  const categories = [
    ...new Set(textbooks.map((book) => book.category).filter(Boolean)),
  ];

  const statsCards = [
    {
      title: "Total Books",
      value: totalBooks,
      icon: BookOpen,
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Copies",
      value: totalCopies,
      icon: BookOpen,
      color: "purple",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Issued",
      value: totalIssued,
      icon: BookOpen,
      color: "amber",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Available",
      value: totalAvailable,
      icon: BookOpen,
      color: "green",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
  ];

  const handleDeleteConfirm = async () => {
    if (deleteConfirmId) {
      await deleteTextbook(deleteConfirmId);
      setShowDeleteConfirm(false);
      setDeleteConfirmId(null);
    }
  };

  const handleEditClick = (book) => {
    openModal("edit", book);
  };

  const handleViewClick = (book) => {
    openModal("view", book);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Textbook Management
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                SF3 - Manage school textbook inventory
              </p>
            </div>
            <button
              onClick={() => openModal("add")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <Plus size={20} />
              Add Textbook
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsCards.map((stat, index) => (
              <div
                key={index}
                className={`${stat.bgColor} rounded-lg p-4 border border-gray-200 shadow-sm`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.iconColor}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overdue Alert */}
        {totalOverdue > 0 && (
          <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-900">Overdue Books Alert</h3>
              <p className="text-sm text-red-800">
                {totalOverdue} textbook{totalOverdue !== 1 ? "s are" : " is"}{" "}
                currently overdue.
              </p>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="mb-8 bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, author, category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="">All Books</option>
              <option value="available">Available Only</option>
            </select>
          </div>

          {/* Filter Status */}
          {(searchTerm || filterCategory || filterStatus) && (
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  Search: {searchTerm}
                  <button
                    onClick={() => setSearchTerm("")}
                    className="hover:text-blue-900"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
              {filterCategory && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  {filterCategory}
                  <button
                    onClick={() => setFilterCategory("")}
                    className="hover:text-green-900"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
              {filterStatus && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  Available
                  <button
                    onClick={() => setFilterStatus("")}
                    className="hover:text-purple-900"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Textbooks Table */}
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 flex items-center justify-center gap-3">
            <Loader className="w-6 h-6 text-blue-600 animate-spin" />
            <span className="text-gray-600 font-medium">
              Loading textbooks...
            </span>
          </div>
        ) : paginatedTextbooks.length > 0 ? (
          <>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Title
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Author
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Category
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                        Total
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                        Available
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                        Issued
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedTextbooks.map((book) => {
                      const issued =
                        (book.total_copies || 0) -
                        (book.available_quantity || 0);
                      return (
                        <tr
                          key={book.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">
                              {book.title}
                            </p>
                            {book.isbn && (
                              <p className="text-xs text-gray-500">
                                ISBN: {book.isbn}
                              </p>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {book.author}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {book.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                            {book.total_copies}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`text-sm font-medium ${
                                book.available_quantity > 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {book.available_quantity}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center text-sm font-medium text-amber-600">
                            {issued}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditClick(book)}
                                className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600 hover:text-blue-900"
                                title="Edit"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteConfirmId(book.id);
                                  setShowDeleteConfirm(true);
                                }}
                                className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600 hover:text-red-900"
                                title="Delete"
                                disabled={isDeleting}
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {paginatedTextbooks.length} of{" "}
                  {filteredTextbooks.length} textbooks
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="px-4 py-2 text-sm font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No textbooks found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterCategory || filterStatus
                ? "No results match your filters. Try adjusting your search."
                : "Start by adding your first textbook."}
            </p>
            {!searchTerm && !filterCategory && !filterStatus && (
              <button
                onClick={() => openModal("add")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                <Plus size={20} />
                Add Textbook
              </button>
            )}
          </div>
        )}

        {/* Textbook Modal */}
        {isModalOpen && <TextbookModal />}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-sm w-full p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Delete Textbook
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this textbook? This action
                cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmId(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting && <Loader className="w-4 h-4 animate-spin" />}
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Textbook;
