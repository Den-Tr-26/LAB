function createDishCard(dish) {
  const col = document.createElement("div");
  col.className = "col-12 col-md-6 col-xl-4";
  col.dataset.id = dish.id;

  const card = document.createElement("div");
  card.className = "dish-card h-100";

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

  const footer = document.createElement("div");
  footer.className = "dish-footer";

  const price = document.createElement("span");
  price.className = "price";
  price.textContent = dish.formattedPrice;

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

export function renderList(dishes, activeCategory = "") {
  const list = document.querySelector("#list");
  const counter = document.querySelector("#counter");
  const empty = document.querySelector("#empty");
  if (!list) return;

  list.textContent = "";
  const fragment = document.createDocumentFragment();
  dishes.forEach((dish) => fragment.append(createDishCard(dish)));
  list.append(fragment);

  if (counter) {
    counter.textContent = `Знайдено ${dishes.length} страв`;
  }
  if (empty) {
    empty.textContent = "Нічого не знайдено.";
    empty.classList.toggle("d-none", dishes.length > 0);
  }

  document.querySelectorAll(".menu-sidebar .cat-link").forEach((link) => {
    link.classList.toggle("active", (link.dataset.category || "") === activeCategory);
  });
}