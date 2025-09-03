import { create } from "zustand";
import useFilterStore from "./filterStore";
import { axiosInstance, fetchCsrfToken } from "../../lib/axios";
import { paginate } from "../../lib/utils";
import toast from "react-hot-toast";

const RECORDS_PER_PAGE = 10;

const handleError = (err, defaultMessage, set) => {
  const message = err?.response?.data?.message || defaultMessage;
  set({ error: message, loading: false });
  console.error(defaultMessage, err);
  toast.error(message);
  return message;
};

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
      const { data } = await axiosInstance.get("/teacher/book-management");
      set({
        textbooks: data?.books?.data || data?.data || data || [],
        loading: false,
      });
    } catch (err) {
      handleError(err, "Failed to fetch textbooks", set);
    }
  },

  fetchBookFilters: async () => {
    set({ loading: true, error: null });
    const filters = useFilterStore.getState().globalFilters;

    try {
      const params = filters.sectionId ? { section_id: filters.sectionId } : {};
      const { data } = await axiosInstance.get(
        "/teacher/book-management/filter-options",
        { params }
      );

      set({
        bookFilters: {
          sections: data.sections || [],
          students: data.students || [],
          books: data.books || [],
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
      await fetchCsrfToken();
      await axiosInstance.post(
        "/teacher/book-management/distribute-books",
        bookData
      );
      set({ loading: false });
      toast.success("Book distributed successfully!");
      get().fetchTextbooks();
    } catch (err) {
      handleError(err, "Failed to distribute book", set);
    }
  },

  returnBook: async (borrowId) => {
    set({ loading: true, error: null });

    try {
      await fetchCsrfToken();
      await axiosInstance.put(
        `/teacher/book-management/return-book/${borrowId}`
      );
      set({ loading: false });
      toast.success("Book returned successfully!");
      get().fetchTextbooks();
    } catch (err) {
      handleError(err, "Failed to return book", set);
    }
  },

  setCurrentPage: (page) => set({ currentPage: page }),

  totalPages: () => Math.ceil(get().textbooks.length / RECORDS_PER_PAGE),

  paginatedRecords: () =>
    paginate(get().textbooks, get().currentPage, RECORDS_PER_PAGE),

  resetTextbooksStore: () => {
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
  },
}));

// Listen for unauthorized event to reset store
window.addEventListener("unauthorized", () => {
  useTextbooksStore.getState().resetTextbooksStore();
});

export default useTextbooksStore;
