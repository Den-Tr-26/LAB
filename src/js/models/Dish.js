export default class Dish {
  #id;
  static CURRENCY = "UAH";

  constructor({
    id,
    name,
    desc = "",
    weight = "",
    rating = "4.5",
    reviews = 0,
    price,
    category = "other",
    hit = false,
    img = "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80",
  }) {
    if (!name || !String(name).trim()) {
      throw new TypeError("Назва страви є обов’язковою");
    }
    this.#id = id;
    this.name = String(name).trim();
    this.desc = String(desc).trim();
    this.weight = String(weight).trim();
    this.rating = String(rating);
    this.reviews = Number(reviews) || 0;
    this.price = Number(price) || 0;
    this.category = category;
    this.hit = Boolean(hit);
    this.img = img;
  }

  get id() {
    return this.#id;
  }

  get formattedPrice() {
    return new Intl.NumberFormat("uk-UA", {
      style: "currency",
      currency: Dish.CURRENCY,
      maximumFractionDigits: 0,
    }).format(this.price);
  }

  matches({ q = "", category = "", maxPrice = Infinity }) {
    const query = q.trim().toLowerCase();
    const byQuery =
      !query ||
      this.name.toLowerCase().includes(query) ||
      this.desc.toLowerCase().includes(query);
    const byCategory = !category || this.category === category;
    const byPrice = Number.isNaN(maxPrice) || this.price <= maxPrice;
    return byQuery && byCategory && byPrice;
  }

  toString() {
    return `${this.name} — ${this.formattedPrice}`;
  }

  static fromApi(dto) {
    const categories = ["pizza", "pasta", "salads", "desserts"];
    return new Dish({
      id: dto.id,
      name: dto.title,
      desc: dto.body || "Свіжоприготована страва від шефа",
      weight: `${200 + ((dto.id * 35) % 300)} г`,
      rating: (4.4 + ((dto.id % 6) * 0.1)).toFixed(1),
      reviews: 50 + dto.id * 17,
      price: 110 + ((dto.id * 25) % 350),
      category: categories[dto.userId % categories.length],
      hit: dto.id === 1,
    });
  }
}

export class ComboDish extends Dish {
  constructor(data, itemsCount = 2) {
    super(data);
    this.itemsCount = itemsCount;
  }

  toString() {
    return `${super.toString()} (комбо з ${this.itemsCount} позицій)`;
  }
}