const FILTERS_KEY = "foodly:menu:filters";

export function saveFilters(filters) {
  localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
}

export function loadFilters() {
  try {
    return JSON.parse(localStorage.getItem(FILTERS_KEY) || "{}");
  } catch (err) {
    console.warn("Не вдалося прочитати фільтри з localStorage:", err.message);
    return {};
  }
}