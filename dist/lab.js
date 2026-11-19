"use strict";

const base = {
  id: "base",
  name: "基础模板",
  english: "Base specimen",
  note: "共用的项目工作台，包含导航、主视觉、按钮、指标卡、图表、表格、开关和新建项目表单。",
};
const themes = [base, ...styles];
const themeById = new Map(themes.map((theme) => [theme.id, theme]));
const parameters = new URLSearchParams(location.search);
const viewNames = new Set(["preview", "compare", "gallery"]);
const display = document.getElementById("display-area");
const template = document.getElementById("preview-template");
const search = document.getElementById("style-search");
const category = document.getElementById("style-category");
const list = document.getElementById("style-list");

let view = viewNames.has(parameters.get("view")) ? parameters.get("view") : "preview";
let selectedId = themeById.has(parameters.get("style")) ? parameters.get("style") : defaultStyle;
let otherId = themeById.has(parameters.get("other")) ? parameters.get("other") : "neubrutalism";
let range = "week";
let reminders = true;
let previewCount = 0;
const projects = [
  { name: "品牌资产库", status: "进行中" },
  { name: "移动端改版", status: "待评审" },
  { name: "用户研究", status: "已完成" },
];
const bars = {
  week: [33, 56, 43, 70, 56, 89, 73],
  month: [34, 43, 65, 50, 41, 68, 62, 76, 66, 79, 73, 89],
};

document.querySelectorAll("[data-catalog-total]").forEach((count) => {
  count.textContent = styles.length;
});
for (const group of groups) {
  category.append(new Option(group, group));
}

function matchingStyles() {
  const query = search.value.trim().toLocaleLowerCase();
  return styles.filter((theme) =>
    (category.value === "all" || category.value === theme.group) &&
    [theme.name, theme.english, theme.id, ...theme.aliases.split("|")].some((name) =>
      name.toLocaleLowerCase().includes(query)
    )
  );
}

function renderLibrary() {
  const available = matchingStyles();
  const resultCount = document.getElementById("style-count");
  resultCount.textContent = available.length + " 种风格";
  list.innerHTML = [base, ...available].map((theme) =>
    '<button class="style-row' + (theme === base ? " base-row" : "") + '" type="button" data-pick="' + theme.id + '" aria-pressed="false">' +
    '<span class="style-swatch" data-theme="' + theme.id + '" aria-hidden="true"></span>' +
    '<span><strong>' + theme.name + '</strong><small lang="en">' + theme.english + '</small></span></button>'
  ).join("") + (available.length ? "" : '<p class="empty">没有匹配的风格。</p>');
  list.scrollTop = 0;
  markSelection();
}

function markSelection() {
  document.querySelectorAll("[data-view]").forEach((button) =>
    button.setAttribute("aria-pressed", String(button.dataset.view === view))
  );
  list.querySelectorAll("[data-pick]").forEach((button) =>
    button.setAttribute("aria-pressed", String(button.dataset.pick === selectedId && view !== "gallery"))
  );
}

function rememberSelection() {
  const url = new URL(location.href);
  url.searchParams.set("style", selectedId);
  if (view === "preview") url.searchParams.delete("view");
  else url.searchParams.set("view", view);
  if (view === "compare") url.searchParams.set("other", otherId);
  else url.searchParams.delete("other");
  history.replaceState(null, "", url);
}

function colorPalette(theme) {
  return '<div class="preview-palettes" data-theme="' + theme.id + '" aria-hidden="true">' +
    '<span class="palette-dot"></span><span class="palette-dot"></span><span class="palette-dot"></span></div>';
}

function singleView() {
  const theme = themeById.get(selectedId);
  display.innerHTML =
    '<div class="preview-toolbar"><div><h2 class="preview-title" tabindex="-1">' + theme.name + '</h2>' +
    '<p class="preview-name-en" lang="en">' + theme.english + '</p></div>' +
    '<div class="preview-tools">' + colorPalette(theme) + '</div></div>' +
    '<div class="preview-frame"><div data-mount="' + theme.id + '"></div><p class="preview-description">' +
    theme.note + '</p></div>';
}

function compareCard(id, side) {
  const theme = themeById.get(id);
  const option = (item) => '<option value="' + item.id + '"' +
    (item.id === id ? " selected" : "") + ">" + item.name + "</option>";
  const options = option(base) + groups.map((group) =>
    '<optgroup label="' + group + '">' + styles.filter((item) => item.group === group).map(option).join("") + '</optgroup>'
  ).join("");
  return '<article><div class="preview-toolbar compare-head"><label>风格 ' + side + '<select data-side="' + side + '">' +
    options + '</select></label>' + colorPalette(theme) + '</div><div class="preview-frame">' +
    '<div data-mount="' + id + '"></div><p class="preview-description">' + theme.note + '</p></div></article>';
}

function compareView() {
  display.innerHTML = '<div class="compare-grid">' + compareCard(selectedId, "A") + compareCard(otherId, "B") + '</div>';
}

function thumbnail(theme) {
  return '<span class="mini-specimen demo" data-theme="' + theme.id + '" aria-hidden="true">' +
    '<span class="mini-nav">NORTHSTAR</span><span class="demo-hero"><span class="demo-hero-copy"><strong class="mini-title">Make room for<br>good work.</strong><span class="mini-button"></span></span>' +
    '<span class="demo-art"><span class="art-grid"></span><span class="art-shape shape-one"></span><span class="art-shape shape-two"></span><span class="art-shape shape-three"></span><span class="art-dot"></span></span></span>' +
    '<span class="stats"><span class="demo-card stat">12</span><span class="demo-card stat">08</span><span class="demo-card stat">05</span></span></span>';
}

function galleryView() {
  const available = matchingStyles();
  display.innerHTML =
    '<div class="gallery-heading"><h2>风格图鉴</h2><span>' + available.length + ' 种风格</span></div>' +
    '<div class="gallery-grid">' + [base, ...available].map((theme) =>
      '<button class="gallery-item" type="button" data-pick="' + theme.id + '">' + thumbnail(theme) +
      '<span class="gallery-label"><strong>' + theme.name + '</strong><small lang="en">' + theme.english + '</small></span></button>'
    ).join("") + '</div>';
}

function renderDisplay() {
  if (view === "gallery") galleryView();
  else if (view === "compare") compareView();
  else singleView();
  display.querySelectorAll("[data-mount]").forEach((host) => {
    const fragment = template.content.cloneNode(true);
    const root = fragment.querySelector(".specimen");
    root.dataset.theme = host.dataset.mount;
    const heading = root.querySelector(".demo-dialog h3");
    heading.id = "new-project-title-" + (++previewCount);
    root.querySelector(".demo-dialog").setAttribute("aria-labelledby", heading.id);
    root.querySelector(".demo-switch").checked = reminders;
    host.appendChild(fragment);
  });
  renderActivity();
  renderProjects();
  markSelection();
}

function renderActivity() {
  display.querySelectorAll("[data-chart]").forEach((chart) => {
    chart.innerHTML = bars[range].map((height) => '<span class="bar" style="--bar:' + height + 'px"></span>').join("");
    chart.setAttribute("aria-label", "最近 " + (range === "week" ? "7" : "30") + " 天的示例项目活动");
  });
  display.querySelectorAll("[data-range]").forEach((button) =>
    button.setAttribute("aria-pressed", String(button.dataset.range === range))
  );
}

function renderProjects() {
  const activeProjects = 11 + projects.filter((project) => project.status === "进行中").length;
  display.querySelectorAll("[data-active-count]").forEach((count) => {
    count.textContent = activeProjects;
  });
  display.querySelectorAll("[data-project-rows]").forEach((body) => {
    body.replaceChildren();
    for (const project of projects.slice(0, 5)) {
      const row = body.insertRow();
      row.insertCell().textContent = project.name;
      const chip = document.createElement("span");
      chip.className = "demo-chip";
      chip.textContent = project.status;
      row.insertCell().appendChild(chip);
    }
  });
}

function setSelection(id, fromGallery) {
  selectedId = id;
  if (view === "gallery") view = "preview";
  renderDisplay();
  rememberSelection();
  if (fromGallery) {
    display.querySelector(".preview-title")?.focus();
  } else if (matchMedia("(max-width: 784px)").matches) {
    display.scrollIntoView({ behavior: "auto", block: "start" });
  }
}

function setView(mode) {
  if (view === mode) return;
  view = mode;
  if (view === "compare" && otherId === selectedId) {
    otherId = styles.find((theme) => theme.id !== selectedId).id;
  }
  renderDisplay();
  rememberSelection();
}

function jumpTo(root, section) {
  const target = root.querySelector('[data-section="' + section + '"]');
  root.querySelectorAll(".demo-nav button").forEach((button) => {
    if (button.dataset.jump === section) button.setAttribute("aria-current", "true");
    else button.removeAttribute("aria-current");
  });
  if (target instanceof HTMLDetailsElement) {
    target.open = true;
    target.querySelector("summary").focus();
  } else {
    target.focus();
  }
  target.scrollIntoView({ behavior: "auto", block: "nearest" });
}

function openProjectDialog(root) {
  const dialog = root.querySelector(".demo-dialog");
  const form = dialog.querySelector("form");
  form.reset();
  form.querySelector(".demo-error").hidden = true;
  form.elements.project.removeAttribute("aria-invalid");
  dialog.showModal();
  form.elements.project.focus();
}

document.querySelector(".view-modes").addEventListener("click", (event) => {
  const button = event.target.closest("[data-view]");
  if (button) setView(button.dataset.view);
});

list.addEventListener("click", (event) => {
  const button = event.target.closest("[data-pick]");
  if (button) setSelection(button.dataset.pick, false);
});

function filterStyles() {
  renderLibrary();
  if (view === "gallery") galleryView();
}

search.addEventListener("input", filterStyles);
category.addEventListener("change", filterStyles);

display.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.pick) {
    setSelection(button.dataset.pick, true);
    return;
  }
  const root = button.closest(".specimen");
  if (!root) return;
  if (button.dataset.jump) jumpTo(root, button.dataset.jump);
  if (button.dataset.range) {
    range = button.dataset.range;
    renderActivity();
  }
  if (button.dataset.demo === "new") openProjectDialog(root);
  if (button.dataset.demo === "close") root.querySelector(".demo-dialog").close();
});

display.addEventListener("change", (event) => {
  const control = event.target;
  if (control.dataset.side) {
    const side = control.dataset.side;
    if (side === "A") selectedId = control.value;
    else otherId = control.value;
    renderDisplay();
    rememberSelection();
    display.querySelector('[data-side="' + side + '"]').focus();
  }
  if (control.matches(".demo-switch")) {
    reminders = control.checked;
    display.querySelectorAll(".demo-switch").forEach((toggle) => { toggle.checked = reminders; });
  }
});

display.addEventListener("submit", (event) => {
  const form = event.target;
  if (!form.matches(".demo-form")) return;
  event.preventDefault();
  const input = form.elements.project;
  const name = input.value.trim();
  const error = form.querySelector(".demo-error");
  if (!name) {
    error.hidden = false;
    input.setAttribute("aria-invalid", "true");
    input.focus();
    return;
  }
  const root = form.closest(".specimen");
  projects.unshift({ name, status: form.elements.visibility.value === "仅自己" ? "私人草稿" : "进行中" });
  form.closest("dialog").close();
  renderProjects();
  const text = "已创建项目「" + name + "」。";
  const message = root.querySelector(".demo-message");
  message.textContent = text;
  message.hidden = false;
  document.getElementById("app-message").textContent = text;
  jumpTo(root, "projects");
});

display.addEventListener("input", (event) => {
  if (event.target.name !== "project") return;
  event.target.removeAttribute("aria-invalid");
  event.target.form.querySelector(".demo-error").hidden = true;
});

renderLibrary();
renderDisplay();
