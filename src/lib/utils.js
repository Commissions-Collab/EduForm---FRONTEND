import toast from "react-hot-toast";

export const paginate = (items, currentPage, recordsPerPage) => {
  if (!Array.isArray(items)) return [];
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  return items.slice(indexOfFirst, indexOfLast);
};

const isValidStorage = (storage) =>
  storage === localStorage || storage === sessionStorage;

export const getItem = (key, parse = true, storage = localStorage) => {
  try {
    if (typeof key !== "string" || !key) {
      throw new Error("Invalid storage key");
    }
    if (!isValidStorage(storage)) {
      throw new Error("Invalid storage object");
    }
    const value = storage.getItem(key);
    if (value === null) return null;
    return parse ? JSON.parse(value) : value;
  } catch (error) {
    console.error(
      `Failed to get or parse '${key}' from ${
        storage === localStorage ? "localStorage" : "sessionStorage"
      }:`,
      error
    );
    return null;
  }
};

export const setItem = (key, value, storage = localStorage) => {
  try {
    if (typeof key !== "string" || !key) {
      throw new Error("Invalid storage key");
    }
    if (value === undefined || value === null) {
      throw new Error("Cannot store undefined or null value");
    }
    const data = typeof value === "string" ? value : JSON.stringify(value);
    storage.setItem(key, data);
  } catch (error) {
    console.error(
      `Failed to save '${key}' to ${
        storage === localStorage ? "localStorage" : "sessionStorage"
      }:`,
      error
    );
  }
};

export const removeItem = (key, storage = localStorage) => {
  try {
    if (typeof key !== "string" || !key) {
      throw new Error("Invalid storage key");
    }
    storage.removeItem(key);
  } catch (error) {
    console.error(
      `Failed to remove '${key}' from ${
        storage === localStorage ? "localStorage" : "sessionStorage"
      }:`,
      error
    );
  }
};

export const clearStorage = () => {
  try {
    // Preserve non-sensitive keys
    const allowedKeys = ["theme", "language"];
    const localKeys = Object.keys(localStorage);
    const sessionKeys = Object.keys(sessionStorage);
    localKeys.forEach((key) => {
      if (!allowedKeys.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    sessionKeys.forEach((key) => {
      sessionStorage.removeItem(key);
    });
  } catch (error) {
    console.error("Failed to clear storage:", error);
    toast.error("Failed to clear session data.");
  }
};

export const downloadPDF = (blob, filename) => {
  try {
    if (!(blob instanceof Blob)) {
      throw new Error("Invalid blob object");
    }
    if (typeof filename !== "string" || !filename) {
      throw new Error("Invalid filename");
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to download PDF:", error);
    toast.error("Failed to download PDF. Please try again.");
  }
};
