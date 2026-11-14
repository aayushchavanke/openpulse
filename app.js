const DATA_URL = "./data/latest.json";
const list = document.querySelector("#repo-list");
const search = document.querySelector("#search");
const languageFilter = document.querySelector("#language-filter");
const sort = document.querySelector("#sort");
let repositories = [];
const compact = value => new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value || 0);
function render() {
  const term = search.value.trim().toLowerCase();
  const language = languageFilter.value;
  const mode = sort.value;
  const rows = repositories.filter(repo => {
    const matchesText = (repo.name + " " + (repo.description || "")).toLowerCase().includes(term);
    return matchesText && (!language || repo.language === language);
  }).sort((a,b) => mode === "name" ? a.name.localeCompare(b.name) : (b[mode] || 0) - (a[mode] || 0));
  list.innerHTML = "";
  if (!rows.length) {
    document.querySelector("#empty-state").hidden = false;
    return;
  }
  document.querySelector("#empty-state").hidden = true;
  const fragment = document.createDocumentFragment();
  rows.forEach(repo => {
    const card = document.createElement("article");
    card.className = "repo-card";
    const top = document.createElement("div"); top.className = "repo-top";
    const heading = document.createElement("div"); heading.className = "repo-name";
    const link = document.createElement("a"); link.href = repo.url; link.target = "_blank"; link.rel = "noopener noreferrer"; link.textContent = repo.name;
    heading.append(link); top.append(heading);
    const lang = document.createElement("span"); lang.className = "language"; lang.textContent = repo.language || "Other"; top.append(lang);
    const description = document.createElement("p"); description.className = "repo-description"; description.textContent = repo.description || "No description provided.";
    const metrics = document.createElement("div"); metrics.className = "repo-metrics";
    [["★",compact(repo.stars)+" stars"],["⑂",compact(repo.forks)+" forks"]].forEach(([symbol,label]) => {const item=document.createElement("span");item.textContent=symbol+" "+label;metrics.append(item);});
    const footer = document.createElement("div"); footer.className = "repo-footer";
    const date = document.createElement("span"); date.textContent = "Updated " + new Date(repo.updated_at).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"});
    const view = document.createElement("a"); view.href=repo.url;view.target="_blank";view.rel="noopener noreferrer";view.textContent="View project ↗";
    footer.append(date,view);card.append(top,description,metrics,footer);fragment.append(card);
  });
  list.append(fragment);
}
async function init() {
  try {
    const response = await fetch(DATA_URL, {cache:"no-store"});
    if (!response.ok) throw new Error("Could not load the repository dataset.");
    const data = await response.json();
    repositories = Array.isArray(data.repositories) ? data.repositories : [];
    document.querySelector("#project-count").textContent = repositories.length;
    document.querySelector("#language-count").textContent = new Set(repositories.map(r=>r.language).filter(Boolean)).size;
    document.querySelector("#star-count").textContent = compact(repositories.reduce((sum,r)=>sum+(r.stars||0),0));
    document.querySelector("#updated").textContent = "Data collected " + new Date(data.collected_at).toLocaleString();
    [...new Set(repositories.map(r=>r.language).filter(Boolean))].sort().forEach(language => {
      const option=document.createElement("option");option.value=language;option.textContent=language;languageFilter.append(option);
    });
    render();
  } catch(error) {
    list.innerHTML = '<div class="loading-card">We could not load the dataset. Please try again later.</div>';
    document.querySelector("#updated").textContent = "Dataset temporarily unavailable";
    console.error(error);
  }
}
search.addEventListener("input",render);
languageFilter.addEventListener("change",render);
sort.addEventListener("change",render);
init();