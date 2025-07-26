export const getItem = (key, parse = true) => {
  try {
    const value = localStorage.getItem(key);
    return parse ? JSON.parse(value) : value;
  } catch {
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
