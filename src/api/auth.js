import axios from "axios";

export const login = async (email, password) => {
  const response = await axios.post("http://127.0.0.1:8000/api/login", {
    email,
    password,
  });

  return response.data;
};
