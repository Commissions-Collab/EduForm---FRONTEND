import toast from "react-hot-toast";

// Type definitions for better type safety
/** @typedef {typeof localStorage | typeof sessionStorage} StorageType */
/** @typedef {any[] | Object} PaginableItems */

/**
 * Paginates an array of items
 * @param {PaginableItems} items - Array of items to paginate
 * @param {number} currentPage - Current page number (1-based)
 * @param {number} recordsPerPage - Number of records per page
 * @returns {PaginableItems} Paginated items
 */
export const paginate = (items, currentPage, recordsPerPage) => {
  try {
    if (!Array.isArray(items)) {
      console.warn("Paginate: Input is not an array", { items });
      return [];
    }
    if (!Number.isInteger(currentPage) || currentPage < 1) {
      console.warn("Paginate: Invalid currentPage", { currentPage });
      return [];
    }
    if (!Number.isInteger(recordsPerPage) || recordsPerPage < 1) {
      console.warn("Paginate: Invalid recordsPerPage", { recordsPerPage });
      return [];
    }

    const indexOfLast = currentPage * recordsPerPage;
    const indexOfFirst = indexOfLast - recordsPerPage;
    return items.slice(indexOfFirst, indexOfLast);
  } catch (error) {
    console.error("Paginate failed:", {
      error,
      items,
      currentPage,
      recordsPerPage,
    });
    return [];
  }
};

/**
 * Validates storage object
 * @param {StorageType} storage - Storage object to validate
 * @returns {boolean} Whether storage is valid
 */
const isValidStorage = (storage) =>
  storage === localStorage || storage === sessionStorage;

/**
 * Retrieves an item from storage
 * @param {string} key - Storage key
 * @param {boolean} [parse=true] - Whether to parse JSON
 * @param {StorageType} [storage=localStorage] - Storage type
 * @returns {any|null} Retrieved value or null
 */
export const getItem = (key, parse = true, storage = localStorage) => {
  try {
    if (typeof key !== "string" || !key.trim()) {
      throw new Error("Invalid or empty storage key");
    }
    if (!isValidStorage(storage)) {
      throw new Error("Invalid storage object");
    }

    const value = storage.getItem(key);
    if (value === null) return null;

    return parse ? JSON.parse(value) : value;
  } catch (error) {
    console.error("Failed to get item from storage:", {
      key,
      storageType: storage === localStorage ? "localStorage" : "sessionStorage",
      error: error.message,
    });
    return null;
  }
};

/**
 * Sets an item in storage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @param {StorageType} [storage=localStorage] - Storage type
 * @returns {void}
 */
export const setItem = (key, value, storage = localStorage) => {
  try {
    if (typeof key !== "string" || !key.trim()) {
      throw new Error("Invalid or empty storage key");
    }
    if (!isValidStorage(storage)) {
      throw new Error("Invalid storage object");
    }
    if (value === undefined || value === null) {
      throw new Error("Cannot store undefined or null value");
    }

    const data = typeof value === "string" ? value : JSON.stringify(value);
    storage.setItem(key, data);
  } catch (error) {
    console.error("Failed to set item in storage:", {
      key,
      storageType: storage === localStorage ? "localStorage" : "sessionStorage",
      error: error.message,
    });
    toast.error("Failed to save data to storage.");
  }
};

/**
 * Removes an item from storage
 * @param {string} key - Storage key
 * @param {StorageType} [storage=localStorage] - Storage type
 * @returns {void}
 */
export const removeItem = (key, storage = localStorage) => {
  try {
    if (typeof key !== "string" || !key.trim()) {
      throw new Error("Invalid or empty storage key");
    }
    if (!isValidStorage(storage)) {
      throw new Error("Invalid storage object");
    }

    storage.removeItem(key);
  } catch (error) {
    console.error("Failed to remove item from storage:", {
      key,
      storageType: storage === localStorage ? "localStorage" : "sessionStorage",
      error: error.message,
    });
    toast.error("Failed to remove data from storage.");
  }
};

/**
 * Clears storage while preserving allowed keys
 * @returns {void}
 */
export const clearStorage = () => {
  try {
    const allowedKeys = ["theme", "language"];

    // Clear localStorage
    const localKeys = Object.keys(localStorage);
    localKeys.forEach((key) => {
      if (!allowedKeys.includes(key)) {
        localStorage.removeItem(key);
      }
    });

    // Clear sessionStorage
    sessionStorage.clear();
  } catch (error) {
    console.error("Failed to clear storage:", {
      error: error.message,
    });
    toast.error("Failed to clear session data.");
  }
};

/**
 * Downloads a PDF blob
 * @param {Blob} blob - Blob object to download
 * @param {string} filename - Name of the file
 * @returns {void}
 */
export const downloadPDF = (blob, filename) => {
  try {
    if (!(blob instanceof Blob)) {
      throw new Error("Invalid blob object");
    }
    if (typeof filename !== "string" || !filename.trim()) {
      throw new Error("Invalid or empty filename");
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 0);
  } catch (error) {
    console.error("Failed to download PDF:", {
      error: error.message,
      filename,
    });
    toast.error("Failed to download PDF. Please try again.");
  }
};
