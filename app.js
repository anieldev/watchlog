import { CATEGORY_OPTIONS, COUNTRY_OPTIONS, WATCH_ITEMS } from "./data.js";

const KIND_OPTIONS = [
  { id: "all", label: "All" },
  { id: "movie", label: "Movies" },
  { id: "show", label: "Shows" },
  { id: "anime", label: "Anime" }
];

const years = WATCH_ITEMS.map(item => item.releaseYear);
const yearBounds = {
  min: Math.min(...years),
  max: Math.max(...years)
};

const RELEASE_PRESETS = [
  { id: "all", label: "All", min: yearBounds.min, max: yearBounds.max },
  { id: "2020s", label: "2020s", min: 2020, max: 2029 },
  { id: "2010s", label: "2010s", min: 2010, max: 2019 },
  { id: "2000s", label: "2000s", min: 2000, max: 2009 }
];

const state = {
  kind: "all",
  query: "",
  sort: "recent",
  categories: new Set(),
  countries: new Set(),
  minYear: yearBounds.min,
  maxYear: yearBounds.max
};

const els = {
  formatTabs: document.querySelector("#formatTabs"),
  activeFilters: document.querySelector("#activeFilters"),
  cardGrid: document.querySelector("#cardGrid"),
  emptyState: document.querySelector("#emptyState"),
  searchInput: document.querySelector("#searchInput"),
  sortSelect: document.querySelector("#sortSelect"),
  resultSummary: document.querySelector("#resultSummary"),
  libraryCount: document.querySelector("#libraryCount"),
  clearFilters: document.querySelector("#clearFilters"),
  categoryMenu: document.querySelector("#categoryMenu"),
  countryMenu: document.querySelector("#countryMenu"),
  categorySummary: document.querySelector("#categorySummary"),
  countrySummary: document.querySelector("#countrySummary"),
  releaseMenu: document.querySelector("#releaseMenu"),
  releasePresets: document.querySelector("#releasePresets"),
  fromYear: document.querySelector("#fromYear"),
  toYear: document.querySelector("#toYear"),
  releaseSummary: document.querySelector("#releaseSummary"),
  drawer: document.querySelector("#drawer"),
  backdrop: document.querySelector("#backdrop"),
  drawerContent: document.querySelector("#drawerContent"),
  drawerClose: document.querySelector("#drawerClose")
};

function countryByCode(code) {
  return COUNTRY_OPTIONS.find(country => country.code === code);
}

function countryLabel(code) {
  const country = countryByCode(code);
  return country ? `${country.flag} ${country.name}` : code;
}

function kindLabel(kind) {
  return KIND_OPTIONS.find(option => option.id === kind)?.label.replace(/s$/, "") || kind;
}

function totalMinutes(item) {
  if (item.runtime.minutes) return item.runtime.minutes;
  return (item.runtime.episodes || 0) * (item.runtime.minutesPerEpisode || 0);
}

function runtimeText(item) {
  const parts = [];
  if (item.runtime.seasons) parts.push(`${item.runtime.seasons} seasons`);
  if (item.runtime.episodes) parts.push(`${item.runtime.episodes} eps`);
  if (item.runtime.minutes) parts.push(`${item.runtime.minutes} min`);
  return parts.join(" / ") || `${totalMinutes(item)} min`;
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" })
    .format(new Date(`${date}T12:00:00`));
}

function matchesQuery(item) {
  const query = state.query.trim().toLowerCase();
  if (!query) return true;
  const credits = [
    ...item.credits.cast.map(person => `${person.name} ${person.role}`),
    ...item.credits.staff.map(person => `${person.job} ${person.name}`)
  ].join(" ");
  const countries = item.countries.map(countryLabel).join(" ");
  const haystack = [
    item.title,
    item.releaseYear,
    item.kind,
    item.synopsis,
    item.categories.join(" "),
    item.production.studios.join(" "),
    item.production.languages.join(" "),
    countries,
    credits
  ].join(" ").toLowerCase();
  return haystack.includes(query);
}

function matchesFilters(item) {
  const kindMatch = state.kind === "all" || item.kind === state.kind;
  const categoryMatch =
    state.categories.size === 0 || item.categories.some(category => state.categories.has(category));
  const countryMatch =
    state.countries.size === 0 || item.countries.some(country => state.countries.has(country));
  const yearMatch = item.releaseYear >= state.minYear && item.releaseYear <= state.maxYear;
  return kindMatch && categoryMatch && countryMatch && yearMatch && matchesQuery(item);
}

function visibleItems() {
  const items = WATCH_ITEMS.filter(matchesFilters);
  return items.sort((a, b) => {
    if (state.sort === "title") return a.title.localeCompare(b.title);
    if (state.sort === "year") return b.releaseYear - a.releaseYear;
    if (state.sort === "runtime") return totalMinutes(b) - totalMinutes(a);
    return new Date(b.watchedDate) - new Date(a.watchedDate);
  });
}

function renderFormatTabs() {
  els.formatTabs.innerHTML = KIND_OPTIONS.map(option => `
    <button class="chip ${state.kind === option.id ? "active" : ""}" data-kind="${option.id}">
      ${option.label}
    </button>
  `).join("");
}

function renderDropdownOptions() {
  els.categoryMenu.innerHTML = CATEGORY_OPTIONS.map(category => `
    <label class="check-row">
      <input type="checkbox" value="${category}" data-filter="category" ${state.categories.has(category) ? "checked" : ""} />
      <span>${category}</span>
    </label>
  `).join("");

  els.countryMenu.innerHTML = COUNTRY_OPTIONS.map(country => `
    <label class="check-row">
      <input type="checkbox" value="${country.code}" data-filter="country" ${state.countries.has(country.code) ? "checked" : ""} />
      <span>${country.flag} ${country.name}</span>
    </label>
  `).join("");

  els.releasePresets.innerHTML = RELEASE_PRESETS.map(preset => `
    <button class="preset-button ${state.minYear === preset.min && state.maxYear === Math.min(preset.max, yearBounds.max) ? "active" : ""}"
      type="button"
      data-release-min="${preset.min}"
      data-release-max="${Math.min(preset.max, yearBounds.max)}">
      ${preset.label}
    </button>
  `).join("");
}

function summarizeSelection(values, formatter = value => value) {
  if (!values.size) return "Any";
  const labels = [...values].map(formatter);
  if (labels.length <= 2) return labels.join(", ");
  return `${labels.slice(0, 2).join(", ")} +${labels.length - 2}`;
}

function renderFilterLabels() {
  els.categorySummary.textContent = summarizeSelection(state.categories);
  els.countrySummary.textContent = summarizeSelection(state.countries, countryLabel);
  els.releaseSummary.textContent =
    state.minYear === yearBounds.min && state.maxYear === yearBounds.max
      ? "All years"
      : `${state.minYear}-${state.maxYear}`;
  els.fromYear.value = String(state.minYear);
  els.toYear.value = String(state.maxYear);
}

function renderActiveFilters() {
  const tokens = [];
  if (state.kind !== "all") tokens.push({ label: kindLabel(state.kind), type: "kind", value: state.kind });
  for (const category of state.categories) {
    tokens.push({ label: category, type: "category", value: category });
  }
  for (const country of state.countries) {
    tokens.push({ label: countryLabel(country), type: "country", value: country });
  }
  if (state.minYear !== yearBounds.min || state.maxYear !== yearBounds.max) {
    tokens.push({ label: `${state.minYear}-${state.maxYear}`, type: "year", value: "year" });
  }

  els.activeFilters.innerHTML = tokens.map(token => `
    <button class="filter-token" data-token-type="${token.type}" data-token-value="${token.value}">
      ${token.label}
    </button>
  `).join("");
}

function renderCards() {
  const items = visibleItems();
  els.libraryCount.textContent = `${items.length} ${items.length === 1 ? "title" : "titles"}`;
  els.resultSummary.textContent = items.length
    ? `${items.length} matched from ${WATCH_ITEMS.length} entries.`
    : "No entries match the current filters.";

  els.cardGrid.innerHTML = items.map(item => `
    <button class="card" data-id="${item.id}">
      <div class="poster" style="--poster: ${item.assets.posterColor}">
        <span class="type-badge">${kindLabel(item.kind)}</span>
      </div>
      <div class="card-body">
        <h3>${item.title}</h3>
        <div class="card-meta">
          <span>${item.releaseYear}</span>
          <span>/</span>
          <span>${runtimeText(item)}</span>
        </div>
        <div class="card-tags">
          ${item.categories.slice(0, 3).map(category => `<span class="micro-tag">${category}</span>`).join("")}
        </div>
      </div>
    </button>
  `).join("");

  els.emptyState.classList.toggle("visible", items.length === 0);
}

function closeDropdowns() {
  document.querySelectorAll("[data-dropdown]").forEach(node => {
    node.classList.remove("open");
    node.querySelector(".filter-trigger")?.setAttribute("aria-expanded", "false");
  });
}

function render() {
  renderFormatTabs();
  renderDropdownOptions();
  renderFilterLabels();
  renderActiveFilters();
  renderCards();
}

function detailRows(object) {
  const humanLabel = value => value.replace(/([A-Z])/g, " $1").replace(/^./, char => char.toUpperCase());
  return Object.entries(object).map(([key, value]) => `
    <div class="kv"><span>${humanLabel(key)}</span><strong>${Array.isArray(value) ? value.join(", ") : value}</strong></div>
  `).join("");
}

function peopleRows(people, secondaryKey) {
  return people.map(person => `
    <div class="kv"><span>${person.name}</span><strong>${person[secondaryKey]}</strong></div>
  `).join("");
}

function openDrawer(id) {
  const item = WATCH_ITEMS.find(entry => entry.id === id);
  if (!item) return;
  closeDropdowns();
  els.drawerContent.innerHTML = `
    <div class="drawer-inner">
      <div class="drawer-title-row">
        <div class="drawer-poster" style="--poster: ${item.assets.posterColor}"></div>
        <div>
          <h2>${item.title}</h2>
          <div class="detail-meta">
            <span class="micro-tag">${kindLabel(item.kind)}</span>
            <span class="micro-tag">${item.releaseYear}</span>
            <span class="micro-tag">${runtimeText(item)}</span>
            <span class="micro-tag">${formatDate(item.watchedDate)}</span>
          </div>
        </div>
      </div>

      <p class="drawer-summary">${item.synopsis}</p>

      <section class="section-card">
        <h3>Overview</h3>
        ${detailRows({
          Categories: item.categories.join(", "),
          Countries: item.countries.map(countryLabel).join(", ")
        })}
      </section>

      <section class="section-card">
        <h3>Cast / Characters</h3>
        ${peopleRows(item.credits.cast, "role")}
      </section>

      <section class="section-card">
        <h3>Staff</h3>
        ${item.credits.staff.map(person => `
          <div class="kv"><span>${person.job}</span><strong>${person.name}</strong></div>
        `).join("")}
      </section>

      <section class="section-card">
        <h3>Production</h3>
        ${detailRows(item.production)}
      </section>
    </div>
  `;
  els.drawer.classList.add("open");
  els.backdrop.classList.add("open");
  els.drawer.setAttribute("aria-hidden", "false");
}

function closeDrawer() {
  els.drawer.classList.remove("open");
  els.backdrop.classList.remove("open");
  els.drawer.setAttribute("aria-hidden", "true");
}

function setYearRange(minYear, maxYear) {
  const low = Math.max(yearBounds.min, Math.min(minYear, maxYear));
  const high = Math.min(yearBounds.max, Math.max(minYear, maxYear));
  state.minYear = low;
  state.maxYear = high;
  els.fromYear.value = String(low);
  els.toYear.value = String(high);
}

function clearFilters() {
  state.kind = "all";
  state.categories.clear();
  state.countries.clear();
  state.query = "";
  state.minYear = yearBounds.min;
  state.maxYear = yearBounds.max;
  els.searchInput.value = "";
  setYearRange(yearBounds.min, yearBounds.max);
  render();
}

els.fromYear.min = String(yearBounds.min);
els.fromYear.max = String(yearBounds.max);
els.toYear.min = String(yearBounds.min);
els.toYear.max = String(yearBounds.max);
setYearRange(yearBounds.min, yearBounds.max);

els.formatTabs.addEventListener("click", event => {
  const button = event.target.closest("[data-kind]");
  if (!button) return;
  state.kind = button.dataset.kind;
  render();
});

document.addEventListener("click", event => {
  const dropdown = event.target.closest("[data-dropdown]");
  document.querySelectorAll("[data-dropdown]").forEach(node => {
    if (node !== dropdown) {
      node.classList.remove("open");
      node.querySelector(".filter-trigger")?.setAttribute("aria-expanded", "false");
    }
  });

  const trigger = event.target.closest(".filter-trigger");
  if (!trigger) return;
  const parent = trigger.closest("[data-dropdown]");
  parent.classList.toggle("open");
  trigger.setAttribute("aria-expanded", String(parent.classList.contains("open")));
});

document.addEventListener("change", event => {
  const input = event.target.closest("input[type='checkbox'][data-filter]");
  if (!input) return;
  const target = input.dataset.filter === "category" ? state.categories : state.countries;
  if (input.checked) {
    target.add(input.value);
  } else {
    target.delete(input.value);
  }
  render();
});

els.activeFilters.addEventListener("click", event => {
  const token = event.target.closest("[data-token-type]");
  if (!token) return;
  if (token.dataset.tokenType === "kind") state.kind = "all";
  if (token.dataset.tokenType === "category") state.categories.delete(token.dataset.tokenValue);
  if (token.dataset.tokenType === "country") state.countries.delete(token.dataset.tokenValue);
  if (token.dataset.tokenType === "year") setYearRange(yearBounds.min, yearBounds.max);
  render();
});

els.cardGrid.addEventListener("click", event => {
  const card = event.target.closest("[data-id]");
  if (!card) return;
  openDrawer(card.dataset.id);
});

els.searchInput.addEventListener("input", event => {
  state.query = event.target.value;
  renderCards();
});

els.sortSelect.addEventListener("change", event => {
  state.sort = event.target.value;
  renderCards();
});

els.releaseMenu.addEventListener("click", event => {
  const preset = event.target.closest("[data-release-min]");
  if (!preset) return;
  setYearRange(Number(preset.dataset.releaseMin), Number(preset.dataset.releaseMax));
  renderFilterLabels();
  renderDropdownOptions();
  renderActiveFilters();
  renderCards();
});

els.fromYear.addEventListener("change", event => {
  setYearRange(Number(event.target.value), state.maxYear);
  renderFilterLabels();
  renderDropdownOptions();
  renderActiveFilters();
  renderCards();
});

els.toYear.addEventListener("change", event => {
  setYearRange(state.minYear, Number(event.target.value));
  renderFilterLabels();
  renderDropdownOptions();
  renderActiveFilters();
  renderCards();
});

els.clearFilters.addEventListener("click", clearFilters);
els.drawerClose.addEventListener("click", closeDrawer);
els.backdrop.addEventListener("click", closeDrawer);
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeDrawer();
});

render();
