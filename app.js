const DATA_URL = "./data/latest.json";
const list = document.querySelector("#repo-list");
const search = document.querySelector("#search");
const languageFilter = document.querySelector("#language-filter");
const sort = document.querySelector("#sort");
let repositories = [];
const compact = value => new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value || 0);

const stories = {
  thinking: {
    category: "TECHNOLOGY / PERSPECTIVE",
    title: "Software is becoming a place to think",
    lead: "The most interesting tools do more than help us finish tasks. They change how we explore a problem in the first place.",
    paragraphs: [
      "We often judge software by speed: how quickly it opens, how many clicks it removes, how much work it automates. Those measures matter, but they miss another kind of value. Some tools give shape to thoughts that were previously scattered.",
      "A notebook, a visual map, a code editor or a research archive can become an environment for reasoning. The interface is not merely a container for work. It influences what we notice, how we connect ideas and which questions become possible.",
      "This is a useful way to think about the next generation of digital products. The goal should not always be to automate the human out of the process. Sometimes the better goal is to give the human a clearer view of the problem."
    ]
  },
  cosmos: {
    category: "SCIENCE & SPACE / REFLECTION",
    title: "The value of looking up",
    lead: "Space exploration is not only about distant worlds. It gives us new perspectives on the one we inhabit.",
    paragraphs: [
      "A view of Earth from space changes the scale of familiar things. Borders disappear from the picture. Weather systems, oceans and land become parts of one connected system.",
      "That perspective is one reason exploration matters even when its practical benefits are not immediately obvious. It expands the questions we can ask, the instruments we build and the ways we understand our place in nature.",
      "Curiosity has no requirement to produce an instant application. Sometimes its first contribution is simply to make the world feel larger, stranger and more worth understanding."
    ]
  },
  curiosity: {
    category: "IDEAS & CULTURE / ESSAY",
    title: "In an automated world, curiosity is a skill",
    lead: "When answers become easier to retrieve, the ability to ask good questions becomes even more valuable.",
    paragraphs: [
      "Information is abundant, but useful understanding is not automatic. A search result can point toward an answer without telling us whether the question was well formed, whether the source is reliable or what important context is missing.",
      "Curiosity is more than collecting facts. It includes noticing contradictions, following an unexpected connection and being willing to revise an opinion when better evidence appears.",
      "Automation can accelerate parts of this process. It cannot remove the need for judgement. The curious person still has to decide what deserves attention and what to do with what they learn."
    ]
  }
};

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
    const card = document.createElement("article"); card.className = "repo-card";
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

function openStory(key) {
  const story = stories[key];
  if (!story) return;
  document.querySelector("#dialog-category").textContent = story.category;
  document.querySelector("#dialog-title").textContent = story.title;
  document.querySelector("#dialog-lead").textContent = story.lead;
  const body = document.querySelector("#dialog-body");
  body.replaceChildren(...story.paragraphs.map(paragraph => {
    const p = document.createElement("p"); p.textContent = paragraph; return p;
  }));
  document.querySelector("#story-dialog").showModal();
}

document.querySelectorAll("[data-story]").forEach(button => button.addEventListener("click", () => openStory(button.dataset.story)));
document.querySelector(".dialog-close").addEventListener("click", () => document.querySelector("#story-dialog").close());
document.querySelector("#story-dialog").addEventListener("click", event => {
  if (event.target === event.currentTarget) event.currentTarget.close();
});
document.querySelector("#today-date").textContent = new Date().toLocaleDateString(undefined,{weekday:"long",day:"numeric",month:"long",year:"numeric"});

async function init() {
  try {
    const response = await fetch(DATA_URL, {cache:"no-store"});
    if (!response.ok) throw new Error("Could not load the repository dataset.");
    const data = await response.json();
    repositories = Array.isArray(data.repositories) ? data.repositories : [];
    document.querySelector("#project-count").textContent = repositories.length;
    document.querySelector("#language-count").textContent = new Set(repositories.map(r=>r.language).filter(Boolean)).size;
    document.querySelector("#star-count").textContent = compact(repositories.reduce((sum,r)=>sum+(r.stars||0),0));
    document.querySelector("#updated").textContent = "Snapshot: " + new Date(data.collected_at).toLocaleString();
    [...new Set(repositories.map(r=>r.language).filter(Boolean))].sort().forEach(language => {
      const option=document.createElement("option");option.value=language;option.textContent=language;languageFilter.append(option);
    });
    render();
  } catch(error) {
    list.innerHTML = '<div class="loading-card">Repository data is temporarily unavailable.</div>';
    document.querySelector("#updated").textContent = "Snapshot unavailable";
    console.error(error);
  }
}
search.addEventListener("input",render);
languageFilter.addEventListener("change",render);
sort.addEventListener("change",render);
init();