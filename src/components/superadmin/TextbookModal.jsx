import React, { useState, useEffect } from "react";
import { X, Save, Loader } from "lucide-react";
import useTextbookStore from "../../stores/superAdmin/useTextbookStore";

const TextbookModal = () => {
  const {
    isModalOpen,
    modalMode,
    selectedBook,
    loading,
    closeModal,
    createTextbook,
    updateTextbook,
  } = useTextbookStore();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    total_copies: "",
    available_quantity: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (modalMode === "edit" && selectedBook) {
      setFormData({
        title: selectedBook.title || "",
        author: selectedBook.author || "",
        category: selectedBook.category || "",
        total_copies: selectedBook.total_copies?.toString() || "",
        available_quantity: selectedBook.available_quantity?.toString() || "",
      });
    } else if (modalMode === "add") {
      setFormData({
        title: "",
        author: "",
        category: "",
        total_copies: "",
        available_quantity: "",
      });
    }
    setFormErrors({});
  }, [modalMode, selectedBook]);

  const validateForm = () => {
    const errors = {};

    if (!formData.title?.trim()) errors.title = "Title is required";

    const totalCopies = parseInt(formData.total_copies, 10);
    const availableQty = parseInt(formData.available_quantity, 10);

    if (!formData.total_copies || isNaN(totalCopies) || totalCopies < 1) {
      errors.total_copies = "Total copies must be at least 1";
    }

    if (isNaN(availableQty) || availableQty < 0) {
      errors.available_quantity = "Available quantity cannot be negative";
    }

    if (availableQty > totalCopies) {
      errors.available_quantity = "Cannot exceed total copies";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (modalMode === "add") {
        await createTextbook(formData);
      } else if (modalMode === "edit" && selectedBook) {
        await updateTextbook(selectedBook.id, formData);
      }
      closeModal();
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isModalOpen) return null;

  const isViewMode = modalMode === "view";
  const isEditMode = modalMode === "edit";
  const isAddMode = modalMode === "add";

  return (
    <div
      className="fixed inset-0  flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
    >
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {isViewMode && "View Textbook"}
            {isEditMode && "Edit Textbook"}
            {isAddMode && "Add New Textbook"}
          </h2>
          <button
            onClick={closeModal}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter textbook title"
                disabled={isViewMode || loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-50 disabled:text-gray-500"
              />
              {formErrors.title && (
                <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
              )}
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Enter author name"
                disabled={isViewMode || loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g., Mathematics, English"
                disabled={isViewMode || loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            {/* Total Copies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Copies <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="total_copies"
                value={formData.total_copies}
                onChange={handleInputChange}
                placeholder="0"
                min="1"
                disabled={isViewMode || loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-50 disabled:text-gray-500"
              />
              {formErrors.total_copies && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.total_copies}
                </p>
              )}
            </div>

            {/* Available Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="available_quantity"
                value={formData.available_quantity}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                disabled={isViewMode || loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-50 disabled:text-gray-500"
              />
              {formErrors.available_quantity && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.available_quantity}
                </p>
              )}
            </div>
          </div>

          {/* Info Box */}
          {!isViewMode && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Title is required. Author and Category
                are optional.
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="mt-8 flex gap-3 justify-end">
            <button
              type="button"
              onClick={closeModal}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {isViewMode ? "Close" : "Cancel"}
            </button>

            {!isViewMode && (
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting && <Loader className="w-4 h-4 animate-spin" />}
                <Save size={18} />
                {isAddMode ? "Add Textbook" : "Save Changes"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TextbookModal;
