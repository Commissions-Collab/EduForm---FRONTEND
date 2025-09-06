export const getStatusButtonStyle = (current, button) => {
  const styles = {
    present: "bg-green-100 text-green-800",
    absent: "bg-red-100 text-red-800",
    late: "bg-yellow-100 text-yellow-800",
  };
  return current === button
    ? styles[button]
    : "bg-gray-100 text-gray-600 hover:opacity-80";
};
