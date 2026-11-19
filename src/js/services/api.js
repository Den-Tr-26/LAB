const BASE = "https://jsonplaceholder.typicode.com";

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function timeout(promise, ms = 8000) {
  return Promise.race([
    promise,
    delay(ms).then(() => {
      throw new Error("Перевищено час очікування відповіді сервера");
    }),
  ]);
}

async function getJson(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} для ${path}`);
  }
  return res.json();
}

export const loadDishesFeed = (limit = 6) => getJson(`/posts?_limit=${limit}`);
export const loadSuppliers = () => getJson("/users");
export const loadOneDish = (id) => getJson(`/posts/${id}`);