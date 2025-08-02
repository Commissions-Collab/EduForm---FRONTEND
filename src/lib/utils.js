export const paginate = (items, currentPage, recordsPerPage) => {
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  return items.slice(indexOfFirst, indexOfLast);
};

export const getItem = (key, parse = true) => {
  try {
    const value = localStorage.getItem(key);
    return parse ? JSON.parse(value) : value;
  } catch (error) {
    console.error(
      `Failed to get or parse item '${key}' from localStorage:`,
      error
    );
    return null;
  }
};

export const setItem = (key, value) => {
  try {
    const data = typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, data);
  } catch (error) {
    console.error(`Failed to save item '${key}' to localStorage:`, error);
  }
};

export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove item '${key}' from localStorage:`, error);
  }
};

export const clearStorage = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Failed to clear localStorage:", error);
  }
};
