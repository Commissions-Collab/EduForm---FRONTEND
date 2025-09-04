import { create } from "zustand";
import toast from "react-hot-toast";

const useFormsManagementStore = create((set) => ({
  formData: {
    academicYear: {},
    calendarEvent: {},
    student: {},
    enrollment: {},
    yearLevel: {},
    section: {},
    teacher: {},
    schedule: {},
  },
  formErrors: {
    academicYear: null,
    calendarEvent: null,
    student: null,
    enrollment: null,
    yearLevel: null,
    section: null,
    teacher: null,
    schedule: null,
  },
  isSubmitting: false,

  // Update form data
  updateFormData: (formType, data) => {
    set((state) => ({
      formData: {
        ...state.formData,
        [formType]: { ...state.formData[formType], ...data },
      },
    }));
  },

  // Set form errors
  setFormErrors: (formType, errors) => {
    set((state) => ({
      formErrors: {
        ...state.formErrors,
        [formType]: errors,
      },
    }));
  },

  // Clear form data and errors for a specific form
  clearForm: (formType) => {
    set((state) => ({
      formData: {
        ...state.formData,
        [formType]: {},
      },
      formErrors: {
        ...state.formErrors,
        [formType]: null,
      },
    }));
  },

  // Reset entire store
  resetFormsManagementStore: () => {
    set({
      formData: {
        academicYear: {},
        calendarEvent: {},
        student: {},
        enrollment: {},
        yearLevel: {},
        section: {},
        teacher: {},
        schedule: {},
      },
      formErrors: {
        academicYear: null,
        calendarEvent: null,
        student: null,
        enrollment: null,
        yearLevel: null,
        section: null,
        teacher: null,
        schedule: null,
      },
      isSubmitting: false,
    });
  },
}));

// Reset store on unauthorized event
window.addEventListener("unauthorized", () => {
  useFormsManagementStore.getState().resetFormsManagementStore();
});

export default useFormsManagementStore;
