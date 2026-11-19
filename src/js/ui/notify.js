export function showSpinner() {
  const counter = document.querySelector("#counter");
  if (counter) counter.textContent = "Завантаження меню...";
}

export function hideSpinner() {
  // Спінер оновлюється текстом лічильника або приховується при рендері
}

export function showError(message) {
  const empty = document.querySelector("#empty");
  if (empty) {
    empty.textContent = message;
    empty.classList.remove("d-none");
  }
}

export function clearError() {
  const empty = document.querySelector("#empty");
  if (empty) {
    empty.textContent = "Нічого не знайдено.";
    empty.classList.add("d-none");
  }
}