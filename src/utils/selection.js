export const toggleId = (list, id) =>
  list.includes(id) ? list.filter((item) => item !== id) : [...list, id];

export const addUniqueBy = (list, item, getKey) => {
  const key = getKey(item);
  return list.some((entry) => getKey(entry) === key) ? list : [...list, item];
};

export const removeById = (list, id, getKey) =>
  list.filter((entry) => getKey(entry) !== id);

export const getSelectedFromAvailable = (selectedIds, available, getId) =>
  selectedIds.map((id) => available.find((item) => getId(item) === id)).filter(Boolean);
