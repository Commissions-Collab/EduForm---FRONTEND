export const paginate = (items, currentPage, recordsPerPage) => {
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  return items.slice(indexOfFirst, indexOfLast);
};

export const getItem = (key, parse = true) => {
  try {
    const value = localStorage.getItem(key);
    return parse ? JSON.parse(value) : value;
  } catch (err) {
    console.error(`Failed to get or parse ${key}:`, err);
    return null;
  }
};

export const setItem = (key, value) => {
  try {
    const data = typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, data);
  } catch {
    console.error(`Failed to save ${key} to storage.`);
  }
};

export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    console.error(`Failed to remove ${key} from storage.`);
  }
};

export const clearStorage = () => {
  localStorage.clear();
};
