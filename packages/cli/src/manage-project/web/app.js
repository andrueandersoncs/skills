const STATUSES = [
  "Not started",
  "Ready",
  "In progress",
  "Blocked",
  "In review",
  "Done"
]

const app = document.getElementById("app")
const state = {
  project: null,
  selectedId: null,
  panel: null,
  error: "",
  missing: false,
  posting: false,
  litId: null,
  clock: ""
}

const field = (name, label, value = "", kind = "input") => {
  const control = kind === "textarea"
    ? `<textarea name="${name}" id="${name}">${escape(value)}</textarea>`
    : `<input name="${name}" id="${name}" value="${escape(value)}" />`
  return `<label>${escape(label)}${control}</label>`
}

const escape = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")

const tick = () => {
  const now = new Date()
  state.clock = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  const el = document.querySelector(".clock")
  if (el) el.textContent = state.clock
}

const paint = (fn) => {
  if (typeof document.startViewTransition === "function") {
    document.startViewTransition(fn)
  } else {
    fn()
  }
}

const post = async (action) => {
  state.error = ""
  state.posting = true
  try {
    const response = await fetch("/api/action", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(action)
    })
    const payload = await response.json()
    if (!response.ok) {
      state.error = payload.error ?? "request failed"
      render()
      return
    }
    state.project = payload
    state.missing = false
    if (action.id) state.litId = action.id
    if (action.op !== "add" && action.op !== "init") {
      state.selectedId = null
      state.panel = null
    }
    paint(render)
  } finally {
    state.posting = false
  }
}

const load = async () => {
  const response = await fetch("/api/project")
  if (response.status === 404) {
    state.project = null
    state.missing = true
    render()
    return
  }
  state.project = await response.json()
  state.missing = false
  render()
}

const selected = () => state.project?.tasks.find((task) => task.id === state.selectedId)

const actions = (status) => {
  if (status === "Not started") return "prepare"
  if (status === "Ready") return "start"
  if (status === "In progress") return "submit"
  if (status === "Blocked") return "prepare"
  if (status === "In review") return "review-task"
  return ""
}

const barcode = (id) => {
  let hash = 2166136261
  for (const char of id) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619)
  const bits = Math.abs(hash).toString(2).padStart(24, "0")
  return `<span class="barcode" aria-hidden="true">${[...bits].map((bit, i) => {
    const width = bit === "1" ? 3 : 1
    return `<i style="width:${width}px;opacity:${i % 5 === 0 ? 1 : 0.85}"></i>`
  }).join("")}</span>`
}

const actionForm = (task) => {
  const next = actions(task.status)
  if (next === "prepare") {
    return `
      <form>
        ${field("owner", "Owner", task.owner)}
        ${field("next", "Next action", task.nextAction)}
        ${field("blockedBy", "Blocked by")}
        ${field("followUp", "Follow-up")}
        <button class="primary" type="submit">Prepare</button>
      </form>`
  }
  if (next === "start") {
    return `
      <form>
        <button class="primary" type="submit">Start</button>
      </form>
      <form>
        ${field("dependency", "Dependency")}
        ${field("followUp", "Follow-up")}
        <button type="submit">Block</button>
      </form>`
  }
  if (next === "submit") {
    return `
      <form>
        ${field("evidence", "Evidence")}
        <button class="primary" type="submit">Submit for review</button>
      </form>
      <form>
        ${field("next", "Next action", task.nextAction)}
        <button type="submit">Pause</button>
      </form>`
  }
  if (next === "review-task") {
    return `
      <form>
        <button class="primary" type="submit">Pass review</button>
      </form>
      <form>
        ${field("action", "Corrective action")}
        ${field("blockedBy", "Blocked by")}
        ${field("followUp", "Follow-up")}
        <button type="submit">Return for correction</button>
      </form>`
  }
  return ""
}

const bindForms = (task) => {
  const forms = app.querySelectorAll(".pass form")
  if (!task || forms.length === 0) return
  const next = actions(task.status)
  if (next === "prepare") {
    forms[0].addEventListener("submit", (event) => {
      event.preventDefault()
      const data = Object.fromEntries(new FormData(event.currentTarget))
      post({
        op: "prepare",
        id: task.id,
        owner: data.owner,
        next: data.next,
        blockedBy: data.blockedBy,
        followUp: data.followUp
      })
    })
  }
  if (next === "start") {
    forms[0].addEventListener("submit", (event) => {
      event.preventDefault()
      post({ op: "start", id: task.id })
    })
    forms[1].addEventListener("submit", (event) => {
      event.preventDefault()
      const data = Object.fromEntries(new FormData(event.currentTarget))
      post({ op: "block", id: task.id, dependency: data.dependency, followUp: data.followUp })
    })
  }
  if (next === "submit") {
    forms[0].addEventListener("submit", (event) => {
      event.preventDefault()
      const data = Object.fromEntries(new FormData(event.currentTarget))
      post({ op: "submit", id: task.id, evidence: data.evidence })
    })
    forms[1].addEventListener("submit", (event) => {
      event.preventDefault()
      const data = Object.fromEntries(new FormData(event.currentTarget))
      post({ op: "pause", id: task.id, next: data.next })
    })
  }
  if (next === "review-task") {
    forms[0].addEventListener("submit", (event) => {
      event.preventDefault()
      post({ op: "review-task", id: task.id, verdict: "Passed" })
    })
    forms[1].addEventListener("submit", (event) => {
      event.preventDefault()
      const data = Object.fromEntries(new FormData(event.currentTarget))
      post({ op: "review-task", id: task.id, verdict: "Failed", action: data.action, blockedBy: data.blockedBy, followUp: data.followUp })
    })
  }
}

const pass = () => {
  if (state.panel === "add") {
    return `
      <aside class="pass open" aria-label="Add task">
        <div class="seq"><span>New task</span><span>Hold</span></div>
        <h2>Add to hold</h2>
        ${state.error ? `<p class="error">${escape(state.error)}</p>` : ""}
        <form id="add-form">
          ${field("id", "Id")}
          ${field("task", "Task")}
          ${field("outcome", "Outcome")}
          ${field("done", "Definition of done", "", "textarea")}
          <div class="row">
            <button type="button" id="close-panel">Close</button>
            <button class="primary" type="submit">Add</button>
          </div>
        </form>
      </aside>`
  }
  if (state.panel === "review") {
    return `
      <aside class="pass open" aria-label="Project review">
        <div class="seq"><span>Board review</span><span>Clearance</span></div>
        <h2>Review</h2>
        <p class="meta">Pass only when every task is Done.</p>
        ${state.error ? `<p class="error">${escape(state.error)}</p>` : ""}
        <form id="review-form">
          <label>Verdict
            <select name="verdict" id="verdict">
              <option>Incomplete</option>
              <option>Passed</option>
              <option>Failed</option>
            </select>
          </label>
          ${field("evidence", "Evidence")}
          ${field("action", "Corrective action", "None")}
          <div class="row">
            <button type="button" id="close-panel">Close</button>
            <button class="primary" type="submit">Record review</button>
          </div>
        </form>
      </aside>`
  }
  const task = selected()
  if (!task) return `<aside class="pass" hidden></aside>`
  return `
    <aside class="pass open" aria-label="Task">
      <div class="seq"><span>${escape(task.id)}</span><span>${escape(task.status)}</span></div>
      <h2>${escape(task.task)}</h2>
      ${barcode(task.id)}
      ${state.error ? `<p class="error">${escape(state.error)}</p>` : ""}
      <dl class="segments">
        <div><dt>Owner</dt><dd>${escape(task.owner) || "—"}</dd></div>
        <div><dt>Next</dt><dd>${escape(task.nextAction) || "—"}</dd></div>
        <div><dt>Outcome</dt><dd>${escape(task.outcome) || "—"}</dd></div>
        <div><dt>Done when</dt><dd>${escape(task.definitionOfDone) || "—"}</dd></div>
        <div><dt>Priority</dt><dd>${escape(task.priority) || "—"}</dd></div>
        <div><dt>Effort</dt><dd>${escape(task.effort) || "—"}</dd></div>
        <div><dt>Dependencies</dt><dd>${escape(task.dependencies.join(", ")) || "—"}</dd></div>
        <div><dt>Evidence</dt><dd>${escape(task.evidence) || "—"}</dd></div>
      </dl>
      ${actionForm(task)}
      <button type="button" id="close-panel">Close</button>
    </aside>`
}

const renderStart = () => {
  app.innerHTML = `
    <main class="start">
      <h1>Issue the record</h1>
      <p>The board is the file. Write the outcome and definition of done to open the lanes.</p>
      ${state.error ? `<p class="error">${escape(state.error)}</p>` : ""}
      <form id="init-form">
        ${field("outcome", "Outcome")}
        ${field("done", "Definition of done", "", "textarea")}
        <button class="primary" type="submit">Open board</button>
      </form>
    </main>`
  app.querySelector("#init-form").addEventListener("submit", (event) => {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget))
    post({ op: "init", outcome: data.outcome, done: data.done })
  })
}

const render = () => {
  tick()
  if (state.missing || !state.project) {
    renderStart()
    return
  }
  const project = state.project
  const verdict = project.reviewVerdict || "Unreviewed"
  app.innerHTML = `
    <header class="mast">
      <div class="mast-top">
        <div class="mast-mark">Live board</div>
        <time class="clock">${escape(state.clock)}</time>
        <div class="verdict ${verdict.toLowerCase()}">${escape(verdict)}</div>
        <div class="mast-actions">
          <button type="button" id="add-task">Add task</button>
          <button type="button" id="review-project">Review</button>
        </div>
      </div>
      <h1>${escape(project.outcome) || "Untitled"}</h1>
      <p>${escape(project.definitionOfDone)}</p>
    </header>
    <div class="board">
      ${STATUSES.map((status) => {
        const tasks = project.tasks.filter((task) => task.status === status)
        return `
          <section class="lane">
            <div class="lane-head">
              <span class="count">${tasks.length}</span>
              <h2>${escape(status)}</h2>
            </div>
            ${tasks.length === 0 ? `<p class="empty">—</p>` : ""}
            <ol>
              ${tasks.map((task) => {
                const lit = task.id === state.selectedId || task.id === state.litId
                const name = `task-${task.id.replace(/[^a-z0-9_-]/gi, "")}`
                return `
                <li>
                  <button class="strip ${lit ? "selected" : ""} ${task.id === state.litId ? "lit" : ""}" data-id="${escape(task.id)}" style="view-transition-name:${name}">
                    <span class="code">${escape(task.id)}</span>
                    <strong>${escape(task.task)}</strong>
                    <span class="meta">${escape(task.owner || "open")}${task.nextAction ? ` · ${escape(task.nextAction)}` : ""}</span>
                  </button>
                </li>`
              }).join("")}
            </ol>
          </section>`
      }).join("")}
    </div>
    ${pass()}`

  app.querySelectorAll(".strip").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedId = button.dataset.id
      state.panel = "task"
      if (state.litId === button.dataset.id) state.litId = null
      state.error = ""
      render()
    })
  })
  app.querySelector("#add-task")?.addEventListener("click", () => {
    state.panel = "add"
    state.selectedId = null
    render()
  })
  app.querySelector("#review-project")?.addEventListener("click", () => {
    state.panel = "review"
    state.selectedId = null
    render()
  })
  app.querySelector("#close-panel")?.addEventListener("click", () => {
    state.panel = null
    state.selectedId = null
    render()
  })
  app.querySelector("#add-form")?.addEventListener("submit", async (event) => {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget))
    await post({ op: "add", id: data.id, task: data.task, outcome: data.outcome, done: data.done })
    if (!state.error) {
      state.selectedId = data.id
      state.panel = "task"
      render()
    }
  })
  app.querySelector("#review-form")?.addEventListener("submit", (event) => {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget))
    post({
      op: "review",
      verdict: data.verdict,
      evidence: data.evidence,
      action: data.action
    })
  })
  bindForms(selected())
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    state.panel = null
    state.selectedId = null
    render()
  }
})

const events = new EventSource("/events")
events.onmessage = () => {
  if (state.posting) return
  load()
}

setInterval(tick, 1000)
load()
