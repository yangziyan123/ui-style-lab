"use strict";

const baseProjectDetails = new Map([
  ["品牌资产库", { owner: "周宁", progress: 62 }],
  ["移动端改版", { owner: "林沐", progress: 84 }],
  ["用户研究", { owner: "陈晓", progress: 100 }],
]);
const additionalBaseProjects = [
  { name: "设计规范", status: "进行中", owner: "林沐", progress: 38 },
  { name: "发布页面", status: "待评审", owner: "陈晓", progress: 93 },
  { name: "素材归档", status: "已完成", owner: "周宁", progress: 100 },
  { name: "新人上手指引", status: "进行中", owner: "陈晓", progress: 27 },
];
const basePreferences = {
  projectName: "品牌资产库",
  priority: "normal",
  due: "",
  layout: "list",
  notes: "",
  includeSummary: true,
};

function mountBaseComponents(root, projects, serial) {
  const template = document.getElementById("base-components-template");
  const section = template.content.firstElementChild.cloneNode(true);
  section.setAttribute("aria-label", "组件样例");
  root.querySelector(".demo-main").appendChild(section);

  const button = document.createElement("button");
  button.type = "button";
  button.dataset.jump = "components";
  button.textContent = "组件";
  root.querySelector(".demo-nav").appendChild(button);

  bindBaseList(root, section, projects);
  bindBaseForm(section, serial);
  bindBasePageStates(section);
}

function populateBaseProjectRow(body, project) {
  const row = body.insertRow();
  const name = row.insertCell();
  name.className = "base-project-name";
  name.textContent = project.name;

  const chip = document.createElement("span");
  chip.className = "base-chip";
  chip.dataset.status = project.status;
  chip.textContent = project.status;
  row.insertCell().appendChild(chip);

  const owner = row.insertCell();
  owner.className = "base-owner";
  owner.textContent = project.owner;

  const meter = document.createElement("div");
  meter.className = "base-progress";
  const progress = document.createElement("progress");
  progress.max = 100;
  progress.value = project.progress;
  progress.setAttribute("aria-label", project.name + "进度");
  const label = document.createElement("span");
  label.textContent = project.progress + "%";
  label.setAttribute("aria-hidden", "true");
  meter.append(progress, label);
  row.insertCell().appendChild(meter);
}

function bindBaseList(root, section, projects) {
  const search = section.querySelector("[data-base-search]");
  const filters = section.querySelectorAll("[data-base-filter]");
  const body = section.querySelector("[data-base-rows]");
  const table = body.closest("table");
  const empty = section.querySelector("[data-base-empty]");
  const pager = section.querySelector("[data-base-pagination]");
  const countLabel = section.querySelector("[data-base-count]");
  const pageLabel = section.querySelector("[data-base-page]");
  const previous = section.querySelector('[data-base-page-by="-1"]');
  const next = section.querySelector('[data-base-page-by="1"]');
  const pageSize = 4;
  let page = 1;
  let status = "all";

  pageLabel.setAttribute("aria-live", "polite");

  function render() {
    const query = search.value.trim().toLowerCase();
    const allProjects = projects.map((project) => ({
      ...project,
      ...(baseProjectDetails.get(project.name) ?? { owner: "你", progress: 0 }),
    })).concat(additionalBaseProjects);
    const matching = allProjects.filter((project) =>
      (status === "all" || project.status === status) && project.name.toLowerCase().includes(query)
    );
    const pageCount = Math.max(1, Math.ceil(matching.length / pageSize));
    page = Math.min(page, pageCount);
    const start = (page - 1) * pageSize;

    body.replaceChildren();
    matching.slice(start, start + pageSize).forEach((project) => populateBaseProjectRow(body, project));
    countLabel.textContent = matching.length + " 个项目";
    pageLabel.textContent = "第 " + page + " / " + pageCount + " 页";
    previous.disabled = page <= 1;
    next.disabled = page >= pageCount;
    table.hidden = matching.length === 0;
    empty.hidden = matching.length !== 0;
    pager.hidden = matching.length === 0;
    filters.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.baseFilter === status)));
  }

  filters.forEach((button) => button.addEventListener("click", () => {
    status = button.dataset.baseFilter;
    page = 1;
    render();
  }));
  search.addEventListener("input", () => {
    page = 1;
    render();
  });
  previous.addEventListener("click", () => {
    page -= 1;
    render();
    if (previous.disabled) next.focus();
  });
  next.addEventListener("click", () => {
    page += 1;
    render();
    if (next.disabled) previous.focus();
  });
  section.querySelector("[data-base-reset-list]").addEventListener("click", () => {
    search.value = "";
    status = "all";
    page = 1;
    render();
    search.focus();
  });
  root.addEventListener("base-projects-changed", render);
}

function bindBaseForm(section, serial) {
  const form = section.querySelector(".base-form");
  const fields = form.elements;
  const projectName = fields.projectName;
  const error = form.querySelector(".base-field-error");
  const feedback = form.querySelector(".base-form-feedback");
  error.id = "base-preferences-error-" + serial;

  function clearError() {
    error.hidden = true;
    projectName.removeAttribute("aria-invalid");
    projectName.removeAttribute("aria-describedby");
  }

  function loadPreferences() {
    fields.projectName.value = basePreferences.projectName;
    fields.priority.value = basePreferences.priority;
    fields.due.value = basePreferences.due;
    fields.layout.value = basePreferences.layout;
    fields.notes.value = basePreferences.notes;
    fields.includeSummary.checked = basePreferences.includeSummary;
    clearError();
  }

  loadPreferences();
  form.addEventListener("input", () => { feedback.textContent = ""; });
  projectName.addEventListener("input", clearError);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = projectName.value.trim();
    if (!name) {
      error.hidden = false;
      projectName.setAttribute("aria-invalid", "true");
      projectName.setAttribute("aria-describedby", error.id);
      feedback.textContent = "";
      projectName.focus();
      return;
    }
    Object.assign(basePreferences, {
      projectName: name,
      priority: fields.priority.value,
      due: fields.due.value,
      layout: fields.layout.value,
      notes: fields.notes.value.trim(),
      includeSummary: fields.includeSummary.checked,
    });
    loadPreferences();
    feedback.textContent = "已保存到此预览。";
  });
  form.querySelector("[data-base-restore]").addEventListener("click", () => {
    loadPreferences();
    feedback.textContent = "已恢复上次保存的偏好。";
    projectName.focus();
  });
}

function bindBasePageStates(section) {
  const buttons = section.querySelectorAll("[data-base-state]");
  const samples = section.querySelectorAll("[data-base-state-sample]");
  buttons.forEach((button) => button.addEventListener("click", () => {
    const state = button.dataset.baseState;
    buttons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    samples.forEach((sample) => { sample.hidden = sample.dataset.baseStateSample !== state; });
  }));
}
