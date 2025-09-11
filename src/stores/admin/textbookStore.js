import { create } from "zustand";
import useFilterStore from "./filterStore";
import { axiosInstance, fetchCsrfToken } from "../../lib/axios";
import { paginate } from "../../lib/utils";
import toast from "react-hot-toast";

// Configuration constants
const RECORDS_PER_PAGE = 10;

const handleError = (err, defaultMessage, set) => {
  let errorMessage = defaultMessage;

  if (err.response) {
    errorMessage =
      err.response.data?.message ||
      err.response.data?.error ||
      `Server Error: ${err.response.status}`;
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

/** @type {import('zustand').StoreApi<TextbooksState & TextbooksActions>} */
const useTextbooksStore = create((set, get) => ({
  textbooks: [],
  currentPage: 1,
  bookFilters: {
    sections: [],
    students: [],
    books: [],
  },
  loading: false,
  error: null,

  fetchTextbooks: async () => {
    set({ loading: true, error: null });

    try {
      const { data, status } = await axiosInstance.get(
        "/teacher/book-management",
        { timeout: 10000 }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      const textbooks = Array.isArray(data?.books?.data || data?.data || data)
        ? data.books?.data || data.data || data
        : [];

      set({
        textbooks,
        loading: false,
      });
    } catch (err) {
      handleError(err, "Failed to fetch textbooks", set);
    }
  },

  fetchBookFilters: async () => {
    set({ loading: true, error: null });

    try {
      const filters = useFilterStore.getState().globalFilters;
      const params = filters.sectionId
        ? { section_id: Number(filters.sectionId) }
        : {};

      const { data, status } = await axiosInstance.get(
        "/teacher/book-management/filter-options",
        { params, timeout: 10000 }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      set({
        bookFilters: {
          sections: Array.isArray(data.sections) ? data.sections : [],
          students: Array.isArray(data.students) ? data.students : [],
          books: Array.isArray(data.books) ? data.books : [],
        },
        loading: false,
      });
    } catch (err) {
      handleError(err, "Failed to fetch book filters", set);
    }
  },

  distributeBook: async (bookData) => {
    set({ loading: true, error: null });

    try {
      if (!bookData || typeof bookData !== "object") {
        throw new Error("Invalid book data");
      }

      await fetchCsrfToken();
      const { status } = await axiosInstance.post(
        "/teacher/book-management/distribute-books",
        bookData,
        { timeout: 10000 }
      );

      if (status !== 200 && status !== 201) {
        throw new Error("Invalid response from server");
      }

      set({ loading: false });
      toast.success("Book distributed successfully!");
      await get().fetchTextbooks();
    } catch (err) {
      const message = handleError(err, "Failed to distribute book", set);
      throw new Error(message);
    }
  },

  returnBook: async (borrowId) => {
    set({ loading: true, error: null });

    try {
      if (
        !borrowId ||
        (typeof borrowId !== "string" && typeof borrowId !== "number")
      ) {
        throw new Error("Invalid borrow ID");
      }

      await fetchCsrfToken();
      const { status } = await axiosInstance.put(
        `/teacher/book-management/return-book/${borrowId}`,
        {},
        { timeout: 10000 }
      );

      if (status !== 200) {
        throw new Error("Invalid response from server");
      }

      set({ loading: false });
      toast.success("Book returned successfully!");
      await get().fetchTextbooks();
    } catch (err) {
      const message = handleError(err, "Failed to return book", set);
      throw new Error(message);
    }
  },

  setCurrentPage: (page) => {
    try {
      if (!Number.isInteger(page) || page < 1) {
        throw new Error("Invalid page number");
      }
      set({ currentPage: page });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to set current page:", {
          error: error.message,
          page,
        });
      }
      toast.error("Invalid page number");
    }
  },

  totalPages: () => {
    try {
      return Math.ceil(get().textbooks.length / RECORDS_PER_PAGE);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to calculate total pages:", {
          error: error.message,
        });
      }
      return 0;
    }
  },

  paginatedRecords: () => {
    try {
      return paginate(get().textbooks, get().currentPage, RECORDS_PER_PAGE);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to get paginated records:", {
          error: error.message,
        });
      }
      return [];
    }
  },

  resetTextbooksStore: () => {
    try {
      set({
        textbooks: [],
        currentPage: 1,
        bookFilters: {
          sections: [],
          students: [],
          books: [],
        },
        loading: false,
        error: null,
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to reset textbooks store:", {
          error: error.message,
        });
      }
      toast.error("Failed to reset textbooks data");
    }
  },
}));

// Centralized unauthorized event handler
const handleUnauthorized = () => {
  useTextbooksStore.getState().resetTextbooksStore();
};

// Register event listener with proper cleanup
window.addEventListener("unauthorized", handleUnauthorized);

// Cleanup on module unload (for hot-reloading scenarios)
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    window.removeEventListener("unauthorized", handleUnauthorized);
  });
}

export default useTextbooksStore;
