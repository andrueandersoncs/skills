const STATUSES = [
  "Not started",
  "Ready",
  "In progress",
  "Blocked",
  "In review",
  "Done"
]

const ACTION_ORDER = [
  "In progress",
  "In review",
  "Ready",
  "Blocked",
  "Not started"
]

const app = document.getElementById("app")
const state = {
  project: null,
  selectedId: null,
  panel: null,
  error: "",
  loadError: "",
  missing: false,
  posting: false,
  litId: null,
  clock: ""
}

const field = (name, label, value = "", kind = "input", required = false) => {
  const requiredAttribute = required ? " required" : ""
  const control = kind === "textarea"
    ? `<textarea name="${name}" id="${name}"${requiredAttribute}>${escape(value)}</textarea>`
    : `<input name="${name}" id="${name}" value="${escape(value)}"${requiredAttribute} />`
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
    state.loadError = ""
    if (action.id) state.litId = action.id
    if (action.op !== "add" && action.op !== "init") {
      state.selectedId = null
      state.panel = null
    }
    paint(render)
  } catch (error) {
    state.error = error instanceof Error ? error.message : "The board request failed"
    render()
  } finally {
    state.posting = false
  }
}

const load = async () => {
  try {
    const response = await fetch("/api/project")
    if (response.status === 404) {
      state.project = null
      state.loadError = ""
      state.missing = true
      render()
      return
    }
    if (!response.ok) throw new Error(`The project record could not be loaded (${response.status})`)
    state.project = await response.json()
    state.missing = false
    state.loadError = ""
    render()
  } catch (error) {
    state.loadError = error instanceof Error ? error.message : "The project record could not be loaded"
    render()
  }
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

const activeTask = (project) => {
  for (const status of ACTION_ORDER) {
    const task = project.tasks.find((candidate) => candidate.status === status)
    if (task) return task
  }
  return null
}

const instruction = (task) => {
  if (!task) return ""
  if (task.status === "In review") return "Review the submitted evidence"
  if (task.status === "Blocked") return task.reviewOrFollowUp || "Resolve the recorded dependency"
  if (task.status === "Not started") return task.nextAction || "Prepare the Ready gate"
  return task.nextAction
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
        ${field("dependency", "Dependency", "", "input", true)}
        ${field("followUp", "Follow-up", "", "input", true)}
        <button type="submit">Block</button>
      </form>`
  }
  if (next === "submit") {
    return `
      <form>
        ${field("evidence", "Evidence", "", "input", true)}
        <button class="primary" type="submit">Submit for review</button>
      </form>
      <form>
        ${field("next", "Next action", task.nextAction, "input", true)}
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
      <aside class="pass open" role="dialog" aria-modal="true" aria-label="Add task">
        <div class="seq"><span>New task</span><span>Hold</span></div>
        <h2>Add to hold</h2>
        ${state.error ? `<p class="error">${escape(state.error)}</p>` : ""}
        <form id="add-form">
          ${field("id", "Id", "", "input", true)}
          ${field("task", "Task", "", "input", true)}
          ${field("outcome", "Outcome", "", "input", true)}
          ${field("done", "Definition of done", "", "textarea", true)}
          <div class="row">
            <button type="button" id="close-panel">Close</button>
            <button class="primary" type="submit">Add</button>
          </div>
        </form>
      </aside>`
  }
  if (state.panel === "review") {
    return `
      <aside class="pass open" role="dialog" aria-modal="true" aria-label="Project review">
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
    <aside class="pass open" role="dialog" aria-modal="true" aria-label="Task">
      <div class="seq"><span>${escape(task.id)}</span><span>${escape(task.status)}</span></div>
      <h2>${escape(task.task)}</h2>
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
        ${field("outcome", "Outcome", "", "input", true)}
        ${field("done", "Definition of done", "", "textarea", true)}
        <button class="primary" type="submit">Open board</button>
      </form>
    </main>`
  app.querySelector("#init-form").addEventListener("submit", (event) => {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget))
    post({ op: "init", outcome: data.outcome, done: data.done })
  })
}

const renderLoadError = () => {
  app.innerHTML = `
    <main class="start">
      <h1>Record unavailable</h1>
      <p>The board could not read the existing project record. Nothing has been changed.</p>
      <p class="error">${escape(state.loadError)}</p>
      <button class="primary" type="button" id="retry-load">Retry load</button>
    </main>`
  app.querySelector("#retry-load").addEventListener("click", load)
}

const render = () => {
  tick()
  if (state.loadError && !state.project) {
    renderLoadError()
    return
  }
  if (state.missing || !state.project) {
    renderStart()
    return
  }
  const project = state.project
  const verdict = project.reviewVerdict || "Unreviewed"
  const verdictClass = ["Passed", "Failed", "Incomplete"].includes(verdict)
    ? verdict.toLowerCase()
    : "unreviewed"
  const current = activeTask(project)
  const completed = project.tasks.filter((task) => task.status === "Done").length
  const currentAction = current
    ? instruction(current)
    : verdict === "Passed"
      ? "Every gate is clear"
      : "Record the independent project review"

  app.innerHTML = `
    <header class="docket-head">
      <div class="claim">
        <div class="record-line">
          <span>Project state register</span>
          <time class="clock">${escape(state.clock)}</time>
        </div>
        <h1>${escape(project.outcome) || "Untitled"}</h1>
        <p class="definition"><span>Acceptance test</span>${escape(project.definitionOfDone)}</p>
      </div>
      <div class="review-block">
        <div>
          <span class="review-label">Independent review</span>
          <strong class="verdict ${verdictClass}">${escape(verdict)}</strong>
        </div>
        <div class="mast-actions">
          <button type="button" id="add-task">Add task</button>
          <button type="button" id="review-project">Review project</button>
        </div>
      </div>
    </header>
    <main class="workspace">
      <section class="directive" aria-labelledby="directive-title">
        <div class="directive-head">
          <h2 id="directive-title">Next required action</h2>
          <span class="status-seal ${current ? current.status.toLowerCase().replaceAll(" ", "-") : verdictClass}">
            ${escape(current?.status || verdict)}
          </span>
        </div>
        <p class="directive-action">${escape(currentAction)}</p>
        ${current ? `
          <div class="directive-task">
            <strong>${escape(current.task)}</strong>
            <span>${escape(current.id)} · ${escape(current.owner || "Unassigned")}</span>
          </div>
          <button class="primary directive-open" type="button" data-task-id="${escape(current.id)}">Open task docket</button>
        ` : verdict === "Passed" ? `
          <p class="directive-note">The project outcome has independent approval and every task is Done.</p>
        ` : `
          <p class="directive-note">Every task is Done. The project still needs its final review.</p>
          <button class="primary" type="button" id="review-current">Open project review</button>
        `}
      </section>
      <section class="register" aria-labelledby="register-title">
        <header class="register-head">
          <h2 id="register-title">State register</h2>
          <p>${project.tasks.length} ${project.tasks.length === 1 ? "claim" : "claims"} · ${completed} approved</p>
        </header>
        <div class="board">
          ${STATUSES.map((status) => {
            const tasks = project.tasks.filter((task) => task.status === status)
            const slug = status.toLowerCase().replaceAll(" ", "-")
            return `
              <section class="lane lane-${slug}">
                <div class="lane-head">
                  <h3>${escape(status)}</h3>
                  <span class="count">${tasks.length}</span>
                </div>
                ${tasks.length === 0 ? `<p class="empty">No entries</p>` : ""}
                <ol>
                  ${tasks.map((task) => {
                    const lit = task.id === state.selectedId || task.id === state.litId
                    const name = `task-${task.id.replace(/[^a-z0-9_-]/gi, "")}`
                    return `
                    <li>
                      <button
                        class="strip ${lit ? "selected" : ""} ${task.id === state.litId ? "lit" : ""}"
                        type="button"
                        data-task-id="${escape(task.id)}"
                        aria-pressed="${task.id === state.selectedId}"
                        style="view-transition-name:${name}"
                      >
                        <span class="code">${escape(task.id)}</span>
                        <strong>${escape(task.task)}</strong>
                        <span class="meta">${escape(task.owner || "Unassigned")}</span>
                        <span class="next">${escape(task.nextAction || task.reviewOrFollowUp || "Awaiting action")}</span>
                      </button>
                    </li>`
                  }).join("")}
                </ol>
              </section>`
          }).join("")}
        </div>
      </section>
    </main>
    ${pass()}`

  app.querySelectorAll("[data-task-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedId = button.dataset.taskId
      state.panel = "task"
      if (state.litId === button.dataset.taskId) state.litId = null
      state.error = ""
      render()
    })
  })
  app.querySelector("#add-task")?.addEventListener("click", () => {
    state.panel = "add"
    state.selectedId = null
    render()
  })
  const openReview = () => {
    state.panel = "review"
    state.selectedId = null
    render()
  }
  app.querySelector("#review-project")?.addEventListener("click", openReview)
  app.querySelector("#review-current")?.addEventListener("click", openReview)
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
  const panel = app.querySelector(".pass.open")
  if (panel) {
    app.querySelector(".docket-head").inert = true
    app.querySelector(".workspace").inert = true
    panel.querySelector("input, textarea, select, button")?.focus()
  }
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
