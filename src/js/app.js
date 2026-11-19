import Dish from "./models/Dish.js";
import { loadDishesFeed, loadSuppliers, loadOneDish, timeout } from "./services/api.js";
import { saveFilters, loadFilters } from "./services/storage.js";
import { renderList } from "./ui/render.js";
import { showSpinner, hideSpinner, showError, clearError } from "./ui/notify.js";

const initialDishes = [
  new Dish({
    id: 101,
    name: "Піца Маргарита",
    desc: "Томати, моцарела, базилік",
    weight: "450 г",
    rating: "4.8",
    reviews: 342,
    price: 195,
    category: "pizza",
    hit: true,
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80",
  }),
  new Dish({
    id: 102,
    name: "Паста Карбонара",
    desc: "Паста, бекон, вершковий соус",
    weight: "350 г",
    rating: "4.7",
    reviews: 281,
    price: 210,
    category: "pasta",
    img: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=300&q=80",
  }),
  new Dish({
    id: 103,
    name: "Цезар з куркою",
    desc: "Курка, салат, пармезан, соус",
    weight: "300 г",
    rating: "4.6",
    reviews: 197,
    price: 180,
    category: "salads",
    img: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=300&q=80",
  }),
  new Dish({
    id: 104,
    name: "Тірамісу",
    desc: "Класичний італійський десерт",
    weight: "150 г",
    rating: "4.9",
    reviews: 423,
    price: 120,
    category: "desserts",
    img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=300&q=80",
  }),
];

let dishes = [...initialDishes];

const state = {
  q: "",
  category: "",
  maxPrice: 600,
  sort: "popularity",
};

function sortDishes(list, sortBy) {
  const comparators = {
    popularity: (a, b) => b.reviews - a.reviews,
    price_asc: (a, b) => a.price - b.price,
    price_desc: (a, b) => b.price - a.price,
    name: (a, b) => a.name.localeCompare(b.name, "uk"),
  };
  return [...list].sort(comparators[sortBy] || comparators.popularity);
}

function updateView() {
  clearError();
  const filtered = dishes.filter((dish) => dish.matches(state));
  const sorted = sortDishes(filtered, state.sort);
  renderList(sorted, state.category);
  saveFilters(state);
}

function restoreStateFromStorage() {
  const saved = loadFilters();
  if (typeof saved.q === "string") state.q = saved.q;
  if (typeof saved.category === "string") state.category = saved.category;
  if (typeof saved.maxPrice === "number") state.maxPrice = saved.maxPrice;
  if (typeof saved.sort === "string") state.sort = saved.sort;

  const searchInput = document.querySelector("#search");
  const sortSelect = document.querySelector("#sort");
  const priceRange = document.querySelector("#priceRange");
  const priceValue = document.querySelector("#priceValue");

  if (searchInput) searchInput.value = state.q;
  if (sortSelect) sortSelect.value = state.sort;
  if (priceRange) priceRange.value = state.maxPrice;
  if (priceValue) priceValue.textContent = `${state.maxPrice} ₴`;
}

function bindEvents() {
  document.querySelector("#search")?.addEventListener("input", (e) => {
    state.q = e.target.value;
    updateView();
  });

  document.querySelector("#sort")?.addEventListener("change", (e) => {
    state.sort = e.target.value;
    updateView();
  });

  document.querySelector(".menu-sidebar")?.addEventListener("click", (e) => {
    const link = e.target.closest(".cat-link");
    if (!link) return;
    e.preventDefault();
    state.category = link.dataset.category || "";
    updateView();
  });

  document.querySelector("#priceRange")?.addEventListener("input", (e) => {
    const priceValue = document.querySelector("#priceValue");
    if (priceValue) priceValue.textContent = `${e.target.value} ₴`;
  });

  document.querySelector("#applyPrice")?.addEventListener("click", () => {
    const priceRange = document.querySelector("#priceRange");
    state.maxPrice = Number(priceRange?.value || 600);
    updateView();
  });

  document.querySelector("#list")?.addEventListener("click", (e) => {
    const delBtn = e.target.closest(".btn-delete");
    if (!delBtn) return;

    const col = delBtn.closest("[data-id]");
    const id = Number(col?.dataset.id);
    dishes = dishes.filter((d) => d.id !== id);
    updateView();
  });
}

async function init() {
  restoreStateFromStorage();
  bindEvents();
  showSpinner();

  try {
    const [rawApiDishes, suppliers] = await Promise.all([
      timeout(loadDishesFeed(4)),
      timeout(loadSuppliers()),
    ]);
    const apiDishes = rawApiDishes.map(Dish.fromApi);
    dishes = [...initialDishes, ...apiDishes];
    console.log("Постачальників:", suppliers.length);
    updateView();
  } catch (err) {
    console.error(err);
    updateView();
    showError(`Не вдалося завантажити додаткові дані з API: ${err.message}`);
  } finally {
    hideSpinner();
  }
}

export async function loadDishDetails(ids) {
  const results = await Promise.allSettled(ids.map(loadOneDish));
  const ok = results.filter((r) => r.status === "fulfilled").map((r) => r.value);
  const fail = results.filter((r) => r.status === "rejected");
  console.log(`Завантажено ${ok.length}, помилок ${fail.length}`);
  return ok;
}

document.addEventListener("DOMContentLoaded", init);