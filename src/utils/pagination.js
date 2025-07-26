export const paginate = (items, currentPage, recordsPerPage) => {
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  return items.slice(indexOfFirst, indexOfLast);
};
