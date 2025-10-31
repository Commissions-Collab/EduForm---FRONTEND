import { create } from "zustand";
import { axiosInstance, fetchCsrfToken } from "../../lib/axios";
import { paginate } from "../../lib/utils";
import toast from "react-hot-toast";

const RECORDS_PER_PAGE = 10;

const handleError = (err, defaultMessage, set) => {
  let errorMessage = defaultMessage;

  if (err.response) {
    if (err.response.status === 403) {
      errorMessage = "You don't have permission to perform this action";
    } else if (err.response.status === 422) {
      const errors = err.response.data.errors;
      errorMessage = Array.isArray(errors)
        ? errors.map((e) => e.message || e.error).join(", ")
        : Object.values(errors).flat().join(", ");
    } else {
      errorMessage =
        err.response.data?.message ||
        err.response.data?.error ||
        `Server Error: ${err.response.status}`;
    }
  } else if (err.request) {
    errorMessage = "Network error - please check your connection";
  } else {
    errorMessage = err.message || defaultMessage;
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(defaultMessage, {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message,
    });
  }

  set({ error: errorMessage, loading: false });
  toast.error(errorMessage);
  return errorMessage;
};

const useTextbookStore = create((set, get) => ({
  // ==================== State ====================
  textbooks: [],
  currentPage: 1,
  loading: false,
  error: null,
  selectedBook: null,
  isModalOpen: false,
  modalMode: "view", // 'view', 'add', 'edit'
  isDeleting: false,
  deleteConfirmId: null,

  // Filter & Search
  searchTerm: "",
  filterCategory: "",
  filterStatus: "", // 'available', 'all'

  // ==================== Fetch Textbooks ====================
  fetchTextbooks: async () => {
    set({ loading: true, error: null });

    try {
      const { data, status } = await axiosInstance.get("/admin/textbooks", {
        timeout: 10000,
      });

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      // Handle both array and object responses
      const textbooks = Array.isArray(data?.books)
        ? data.books
        : Array.isArray(data?.data)
        ? data.data
        : [];

      set({
        textbooks,
        loading: false,
      });
    } catch (err) {
      handleError(err, "Failed to fetch textbooks", set);
    }
  },

  // ==================== Create Textbook ====================
  createTextbook: async (formData) => {
    set({ loading: true, error: null });

    try {
      const validated = {
        title: formData.title?.trim(),
        author: formData.author?.trim() || null,
        category: formData.category?.trim() || null,
        total_copies: parseInt(formData.total_copies, 10),
        available_quantity: parseInt(formData.available_quantity, 10),
      };

      // Validation
      if (!validated.title) throw new Error("Title is required");
      if (validated.total_copies < 1)
        throw new Error("Total copies must be at least 1");
      if (validated.available_quantity < 0)
        throw new Error("Available quantity cannot be negative");
      if (validated.available_quantity > validated.total_copies)
        throw new Error("Available quantity cannot exceed total copies");

      await fetchCsrfToken();
      const { data, status } = await axiosInstance.post(
        "/admin/textbooks",
        validated,
        { timeout: 10000 }
      );

      if (status !== 200 && status !== 201) {
        throw new Error(data?.message || "Invalid response from server");
      }

      // Add new textbook to list
      set((state) => ({
        textbooks: [data.book || data.data || data, ...state.textbooks],
        loading: false,
        isModalOpen: false,
        selectedBook: null,
        modalMode: "view",
      }));

      toast.success("Textbook added successfully!");
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to create textbook", set);
      throw new Error(message);
    }
  },

  // ==================== Update Textbook ====================
  updateTextbook: async (id, formData) => {
    set({ loading: true, error: null });

    try {
      const validated = {
        title: formData.title?.trim(),
        author: formData.author?.trim() || null,
        category: formData.category?.trim() || null,
        total_copies: parseInt(formData.total_copies, 10),
        available_quantity: parseInt(formData.available_quantity, 10),
      };

      // Validation
      if (!validated.title) throw new Error("Title is required");
      if (validated.total_copies < 1)
        throw new Error("Total copies must be at least 1");
      if (validated.available_quantity < 0)
        throw new Error("Available quantity cannot be negative");
      if (validated.available_quantity > validated.total_copies)
        throw new Error("Available quantity cannot exceed total copies");

      await fetchCsrfToken();
      const { data, status } = await axiosInstance.put(
        `/admin/textbooks/${id}`,
        validated,
        { timeout: 10000 }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      // Update textbook in list
      set((state) => ({
        textbooks: state.textbooks.map((book) =>
          book.id === id ? data.book || data.data || data : book
        ),
        selectedBook: data.book || data.data || data,
        loading: false,
        modalMode: "view",
      }));

      toast.success("Textbook updated successfully!");
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to update textbook", set);
      throw new Error(message);
    }
  },

  // ==================== Delete Textbook ====================
  deleteTextbook: async (id) => {
    set({ isDeleting: true, error: null });

    try {
      await fetchCsrfToken();
      const { status } = await axiosInstance.delete(`/admin/textbooks/${id}`, {
        timeout: 10000,
      });

      if (status !== 200) {
        throw new Error("Invalid response from server");
      }

      set((state) => ({
        textbooks: state.textbooks.filter((book) => book.id !== id),
        isDeleting: false,
        deleteConfirmId: null,
        selectedBook: null,
        isModalOpen: false,
      }));

      toast.success("Textbook deleted successfully!");
    } catch (err) {
      handleError(err, "Failed to delete textbook", (state) => {
        set({ isDeleting: false, error: state.error });
      });
    }
  },

  // ==================== Fetch Single Textbook Details ====================
  fetchTextbookDetails: async (id) => {
    set({ loading: true, error: null });

    try {
      const { data, status } = await axiosInstance.get(
        `/admin/textbooks/${id}`,
        { timeout: 10000 }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      set({
        selectedBook: data.book || data.data,
        loading: false,
      });

      return data.book || data.data;
    } catch (err) {
      handleError(err, "Failed to fetch textbook details", set);
    }
  },

  // ==================== Distribute Book to Student ====================
  distributeBook: async (distributionData) => {
    set({ loading: true, error: null });

    try {
      const payload = {
        student_id: parseInt(distributionData.student_id, 10),
        book_id: parseInt(distributionData.book_id, 10),
        borrow_date: distributionData.borrow_date,
        due_date: distributionData.due_date,
        return_date: distributionData.return_date || null,
        status: distributionData.status || "issued",
      };

      await fetchCsrfToken();
      const { data, status } = await axiosInstance.post(
        "/admin/textbooks/distribute",
        payload,
        { timeout: 10000 }
      );

      if (status !== 200 && status !== 201) {
        throw new Error(data?.message || "Invalid response from server");
      }

      set({ loading: false });
      toast.success("Textbook distributed successfully!");
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to distribute textbook", set);
      throw new Error(message);
    }
  },

  // ==================== Return Book ====================
  returnBook: async (borrowId) => {
    set({ loading: true, error: null });

    try {
      await fetchCsrfToken();
      const { data, status } = await axiosInstance.put(
        `/admin/textbooks/return/${borrowId}`,
        {},
        { timeout: 10000 }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      set({ loading: false });
      toast.success("Book returned successfully!");
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to return book", set);
      throw new Error(message);
    }
  },

  // ==================== Search & Filter ====================
  setSearchTerm: (term) => {
    set({ searchTerm: term, currentPage: 1 });
  },

  setFilterCategory: (category) => {
    set({ filterCategory: category, currentPage: 1 });
  },

  setFilterStatus: (status) => {
    set({ filterStatus: status, currentPage: 1 });
  },

  // ==================== Modal Control ====================
  openModal: (mode = "add", book = null) => {
    set({
      isModalOpen: true,
      modalMode: mode,
      selectedBook: book,
    });
  },

  closeModal: () => {
    set({
      isModalOpen: false,
      modalMode: "view",
      selectedBook: null,
    });
  },

  // ==================== Delete Confirmation ====================
  setDeleteConfirmId: (id) => {
    set({ deleteConfirmId: id });
  },

  // ==================== Pagination ====================
  setCurrentPage: (page) => {
    try {
      if (!Number.isInteger(page) || page < 1) {
        throw new Error("Invalid page number");
      }
      set({ currentPage: page });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to set page:", { error: error.message, page });
      }
      toast.error("Invalid page number");
    }
  },

  // ==================== Computed ====================
  getFilteredTextbooks: () => {
    const state = get();
    let filtered = [...state.textbooks];

    // Search filter
    if (state.searchTerm) {
      const term = state.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title?.toLowerCase().includes(term) ||
          book.author?.toLowerCase().includes(term) ||
          book.category?.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (state.filterCategory) {
      filtered = filtered.filter(
        (book) =>
          book.category?.toLowerCase() === state.filterCategory.toLowerCase()
      );
    }

    // Status filter
    if (state.filterStatus === "available") {
      filtered = filtered.filter((book) => book.available_quantity > 0);
    }

    return filtered;
  },

  getPaginatedTextbooks: () => {
    const filtered = get().getFilteredTextbooks();
    return paginate(filtered, get().currentPage, RECORDS_PER_PAGE);
  },

  getTotalPages: () => {
    const filtered = get().getFilteredTextbooks();
    return Math.ceil(filtered.length / RECORDS_PER_PAGE);
  },

  // ==================== Reset ====================
  resetTextbookStore: () => {
    try {
      set({
        textbooks: [],
        currentPage: 1,
        loading: false,
        error: null,
        selectedBook: null,
        isModalOpen: false,
        modalMode: "view",
        isDeleting: false,
        deleteConfirmId: null,
        searchTerm: "",
        filterCategory: "",
        filterStatus: "",
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to reset textbook store:", {
          error: error.message,
        });
      }
      toast.error("Failed to reset textbook data");
    }
  },

  clearErrors: () => {
    set({ error: null });
  },
}));

// Centralized unauthorized event handler
const handleUnauthorized = () => {
  useTextbookStore.getState().resetTextbookStore();
};

// Register event listener
window.addEventListener("unauthorized", handleUnauthorized);

// Cleanup on module unload
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    window.removeEventListener("unauthorized", handleUnauthorized);
  });
}

export default useTextbookStore;
