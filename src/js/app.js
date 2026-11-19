"use strict";

const dishes = [
  {
    id: 1,
    name: "Піца Маргарита",
    desc: "Томати, моцарела, базилік",
    weight: "450 г",
    rating: "4.8",
    reviews: 342,
    price: 195,
    category: "pizza",
    hit: true,
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 2,
    name: "Паста Карбонара",
    desc: "Паста, бекон, вершковий соус",
    weight: "350 г",
    rating: "4.7",
    reviews: 281,
    price: 210,
    category: "pasta",
    hit: false,
    img: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 3,
    name: "Цезар з куркою",
    desc: "Курка, салат, пармезан, соус",
    weight: "300 г",
    rating: "4.6",
    reviews: 197,
    price: 180,
    category: "salads",
    hit: false,
    img: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 4,
    name: "Тірамісу",
    desc: "Класичний італійський десерт",
    weight: "150 г",
    rating: "4.9",
    reviews: 423,
    price: 120,
    category: "desserts",
    hit: false,
    img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=300&q=80",
  },
];

const STORAGE_KEY = "foodly:menu:filters";
const $ = (selector) => document.querySelector(selector);
const money = (n) =>
  new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    maximumFractionDigits: 0,
  }).format(n);

const state = {
  q: "",
  category: "",
  maxPrice: 600,
  sort: "popularity",
};

function createDishCard(dish) {
  const col = document.createElement("div");
  col.className = "col-12 col-md-6 col-xl-4";
  col.dataset.id = dish.id;

  const card = document.createElement("div");
  card.className = "dish-card h-100";

  // Верхня частина з фото
  const imgWrap = document.createElement("div");
  imgWrap.className = "dish-img-wrap";

  if (dish.hit) {
    const badge = document.createElement("span");
    badge.className = "tag-hit";
    badge.textContent = "Хіт";
    imgWrap.append(badge);
  }

  const favBtn = document.createElement("button");
  favBtn.type = "button";
  favBtn.className = "fav-btn";
  favBtn.setAttribute("aria-label", "Обране");
  favBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';

  const img = document.createElement("img");
  img.src = dish.img;
  img.alt = dish.name;

  imgWrap.append(favBtn, img);

  // Тіло картки
  const body = document.createElement("div");
  body.className = "dish-body";

  const title = document.createElement("h3");
  title.textContent = dish.name;

  const desc = document.createElement("p");
  desc.className = "dish-desc";
  desc.textContent = dish.desc;

  const weight = document.createElement("div");
  weight.className = "dish-weight";
  weight.textContent = dish.weight;

  const rating = document.createElement("div");
  rating.className = "dish-rating";
  rating.innerHTML = `<i class="fa-solid fa-star"></i> `;
  rating.append(
    document.createTextNode(`${dish.rating} `),
    Object.assign(document.createElement("small"), {
      textContent: `(${dish.reviews})`,
    })
  );

  // Футер з ціною та кнопками
  const footer = document.createElement("div");
  footer.className = "dish-footer";

  const price = document.createElement("span");
  price.className = "price";
  price.textContent = money(dish.price);

  const actions = document.createElement("div");
  actions.className = "d-flex gap-2";

  const delBtn = document.createElement("button");
  delBtn.type = "button";
  delBtn.className = "btn btn-outline-danger btn-sm btn-delete";
  delBtn.textContent = "Видалити";

  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className = "btn-add";
  addBtn.dataset.bsToggle = "modal";
  addBtn.dataset.bsTarget = "#itemModal";
  addBtn.textContent = "Додати";

  actions.append(delBtn, addBtn);
  footer.append(price, actions);
  body.append(title, desc, weight, rating, footer);
  card.append(imgWrap, body);
  col.append(card);

  return col;
}

function applyFilters(source, { q, category, maxPrice, sort }) {
  const filtered = source.filter((item) => {
    const byName =
      item.name.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q);
    const byCat = !category || item.category === category;
    const byPrice = Number.isNaN(maxPrice) || item.price <= maxPrice;
    return byName && byCat && byPrice;
  });

  const comparators = {
    popularity: (a, b) => b.reviews - a.reviews,
    price_asc: (a, b) => a.price - b.price,
    price_desc: (a, b) => b.price - a.price,
    name: (a, b) => a.name.localeCompare(b.name, "uk"),
  };

  return filtered.sort(comparators[sort] || comparators.popularity);
}

function syncActiveCategoryLink() {
  document.querySelectorAll(".menu-sidebar .cat-link").forEach((link) => {
    link.classList.toggle("active", (link.dataset.category || "") === state.category);
  });
}

function render() {
  const visible = applyFilters(dishes, state);
  const list = $("#list");
  list.textContent = "";

  const fragment = document.createDocumentFragment();
  visible.forEach((dish) => fragment.append(createDishCard(dish)));
  list.append(fragment);

  $("#counter").textContent = `Знайдено ${visible.length} страв`;
  $("#empty").classList.toggle("d-none", visible.length > 0);
  syncActiveCategoryLink();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function restoreFilters() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (typeof saved.q === "string") state.q = saved.q;
    if (typeof saved.category === "string") state.category = saved.category;
    if (typeof saved.maxPrice === "number") state.maxPrice = saved.maxPrice;
    if (typeof saved.sort === "string") state.sort = saved.sort;
  } catch (e) {
    console.warn("Не вдалося відновити фільтри:", e.message);
  }

  if ($("#search")) $("#search").value = state.q;
  if ($("#sort")) $("#sort").value = state.sort;
  if ($("#priceRange")) $("#priceRange").value = state.maxPrice;
  if ($("#priceValue")) $("#priceValue").textContent = `${state.maxPrice} ₴`;
}

// Події
$("#search")?.addEventListener("input", (e) => {
  state.q = e.target.value.trim().toLowerCase();
  render();
});

$("#sort")?.addEventListener("change", (e) => {
  state.sort = e.target.value;
  render();
});

document.querySelector(".menu-sidebar")?.addEventListener("click", (e) => {
  const link = e.target.closest(".cat-link");
  if (!link) return;
  e.preventDefault();
  state.category = link.dataset.category || "";
  render();
});

$("#priceRange")?.addEventListener("input", (e) => {
  if ($("#priceValue")) $("#priceValue").textContent = `${e.target.value} ₴`;
});

$("#applyPrice")?.addEventListener("click", () => {
  state.maxPrice = Number($("#priceRange")?.value || 600);
  render();
});

$("#list")?.addEventListener("click", (e) => {
  const delBtn = e.target.closest(".btn-delete");
  if (!delBtn) return;

  const col = delBtn.closest("[data-id]");
  const id = Number(col.dataset.id);
  const idx = dishes.findIndex((d) => d.id === id);
  if (idx !== -1) dishes.splice(idx, 1);
  render();
});

restoreFilters();
render();