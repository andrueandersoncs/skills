type RuntimeCheck = {
  module: string
  exportName: string
  calls: { args: unknown[]; expected: unknown }[]
}

type Probe = {
  prompt: string
  reads?: string[]
  forbiddenReads?: string[]
  json?: { path: string; value: unknown }
}

export type SkillEvaluationCase = {
  id: string
  prompt: string
  files: Record<string, string>
  allowedChanges: string[]
  requiredChanges: string[]
  routes: string[]
  forbiddenRoutes?: string[]
  runtime?: RuntimeCheck
  audit?: { path: string; missingPath?: string }
  probes?: Probe[]
}

const craft = "skills/help/references/software-craft/references"
const routers = "skills/help/references/skill-routers/references"
// Opaque filenames prevent consumers from guessing ownership without the router.
const leaves = Object.fromEntries([
  ["amber", "Define the release contract when the intended release behavior is not yet agreed."],
  ["birch", "Implement an already agreed release contract."],
  ["cobalt", "Independently assess an existing release implementation without modifying it."],
].map(([name, description]) => [
  `leaves/${name}/SKILL.md`,
  `---\nname: ${name}\ndescription: ${description}\n---\n\n${description}\n`,
]))

const routerRequest = "Create a minimal agent-skill router at `router/SKILL.md` for the supplied release leaves. Their responsibilities are already agreed. Gather distinguishing context, match the situation to the appropriate leaf, and hand off the request and relevant evidence. Link to the existing leaves without changing them."
const routerProbes: Probe[] = [
  {
    prompt: "Read router/SKILL.md and use it to handle this request: we need to define what our new release should do; no release contract has been agreed. Load only the selected leaf, then stop before executing it. Do not change files.",
    reads: ["router/SKILL.md", "leaves/amber/SKILL.md"],
    forbiddenReads: ["leaves/birch/SKILL.md", "leaves/cobalt/SKILL.md"],
  },
  {
    prompt: "Read router/SKILL.md and use it to handle this request: implement the already approved release contract. Its behavior and acceptance criteria are settled. Load only the selected leaf, then stop before executing it. Do not change files.",
    reads: ["router/SKILL.md", "leaves/birch/SKILL.md"],
    forbiddenReads: ["leaves/amber/SKILL.md", "leaves/cobalt/SKILL.md"],
  },
  {
    prompt: "Read router/SKILL.md and use it to handle this request: independently assess the existing release implementation; report findings, do not repair it. Load only the selected leaf, then stop before executing it. Do not change files.",
    reads: ["router/SKILL.md", "leaves/cobalt/SKILL.md"],
    forbiddenReads: ["leaves/amber/SKILL.md", "leaves/birch/SKILL.md"],
  },
]

export const skillEvaluationCases: SkillEvaluationCase[] = [
  {
    id: "unlazy-incomplete-deliverables",
    prompt: "The last agent claimed our migration was complete, but it omitted two required consumers and their integration checks. Recover the original requirements and finish all omitted work. Select and load the responsible specialist, then stop before executing its workflow. Do not change files.",
    files: {},
    allowedChanges: [],
    requiredChanges: [],
    routes: ["skills/help/references/unlazy/SKILL.md"],
    forbiddenRoutes: [`${craft}/manage-work-queue/SKILL.md`],
  },
  {
    id: "unlazy-explicit-request",
    prompt: "Use unlazy completion discipline for the substantial multi-part report I am about to provide. Select and load the responsible specialist, then stop before executing its workflow. Do not change files.",
    files: {},
    allowedChanges: [],
    requiredChanges: [],
    routes: ["skills/help/references/unlazy/SKILL.md"],
  },
  {
    id: "typesafe-jev-jaggedness",
    prompt: "Review a TypeSafe design for jev-1.13 that asks the model to count overdue invoices, compare their dates, and generate reminder copy. Use the current model-jaggedness guidance to redesign it. Select and load the responsible specialist, then stop before executing its workflow. Do not change files.",
    files: {},
    allowedChanges: [],
    requiredChanges: [],
    routes: ["skills/help/references/typesafe-ai/SKILL.md"],
    forbiddenRoutes: ["skills/help/references/software-craft/SKILL.md"],
  },
  {
    id: "verification-without-unlazy",
    prompt: "Be thorough: verify that the candidate CLI release meets its documented behavior. I want a report only, with fresh evidence; no implementation changes or recovery of omitted deliverables. Select and load the responsible specialist, then stop before executing its workflow. Do not change files.",
    files: {},
    allowedChanges: [],
    requiredChanges: [],
    routes: ["skills/help/references/software-craft/SKILL.md", `${craft}/verify-change/SKILL.md`],
    forbiddenRoutes: ["skills/help/references/unlazy/SKILL.md"],
  },
  {
    id: "compilation-owner-no-training",
    prompt: "Our existing prose-editing skill passes its required behavior cases, but profiling shows loading its instructions dominates token cost. Compile a cheaper instruction representation and evaluate retained behavior. We have not chosen model training. Select and load the responsible specialist, then stop before executing its workflow. Do not change files.",
    files: {},
    allowedChanges: [],
    requiredChanges: [],
    routes: [
      "skills/help/references/agent-systems/SKILL.md",
      "skills/help/references/agent-systems/references/compile-agent-skill/SKILL.md",
    ],
    forbiddenRoutes: ["skills/help/references/distill-skill-to-model/SKILL.md"],
  },
  {
    id: "one-file-fix-no-map",
    prompt: "Fix this scale-by-two function: `scale(7)` currently returns 8 instead of 14. The defect is isolated to `src/scale.ts`; there are no other callers or dependencies. Make the smallest complete change without creating planning or mapping artifacts.",
    files: { "src/scale.ts": "export const scale = (value: number) => value + 1\n" },
    allowedChanges: ["src/scale.ts"],
    requiredChanges: ["src/scale.ts"],
    routes: [`${craft}/implement-change/SKILL.md`],
    forbiddenRoutes: [`${craft}/map-codebase/SKILL.md`, "skills/help/references/unlazy/SKILL.md"],
    runtime: {
      module: "src/scale.ts",
      exportName: "scale",
      calls: [{ args: [7], expected: 14 }, { args: [-3], expected: -6 }],
    },
  },
  {
    id: "mapped-change-no-remapping",
    prompt: "Implement this accepted change. A completed selective inspection established the full path: src/report.ts calls parseQuantity in lib/parse.ts and formatQuantity in lib/format.ts. Diagnosis is complete: formatQuantity omits the required ` units` suffix. Update that formatter so report('order:12') returns 'Quantity: 12 units'. Use the supplied inspection and diagnosis; no durable map was requested or is needed. Change only lib/format.ts.",
    files: {
      "lib/parse.ts": "export const parseQuantity = (input: string) => input.split(\":\")[1] ?? \"\"\n",
      "lib/format.ts": "export const formatQuantity = (quantity: string) => `Quantity: ${quantity}`\n",
      "src/report.ts": "import { formatQuantity } from \"../lib/format.ts\"\nimport { parseQuantity } from \"../lib/parse.ts\"\n\nexport const report = (input: string) => formatQuantity(parseQuantity(input))\n",
    },
    allowedChanges: ["lib/format.ts"],
    requiredChanges: ["lib/format.ts"],
    routes: [`${craft}/implement-change/SKILL.md`],
    forbiddenRoutes: [`${craft}/map-codebase/SKILL.md`],
    runtime: {
      module: "src/report.ts",
      exportName: "report",
      calls: [{ args: ["order:12"], expected: "Quantity: 12 units" }],
    },
  },
  {
    id: "router-audit-no-mutation",
    prompt: "Independently audit the existing agent-skill router and its incomplete, unproven contracts. Do not modify the router or its leaves. Write audit.json as {\"findings\":[{\"path\":\"workspace-relative affected path\",\"problem\":\"concrete defect\"}]}. Include broken local references; for each one, also include a `target` field containing its resolved, workspace-relative missing path.",
    files: {
      "router/SKILL.md": "---\nname: release-router\ndescription: Routes release work.\n---\n\n| Situation | Skill |\n| --- | --- |\n| Build a release | [build](references/build/SKILL.md) |\n| Review a release | [review](references/review/SKILL.md) |\n",
      "router/references/build/SKILL.md": "# Build Release\n\nBuild a release.\n",
    },
    allowedChanges: ["audit.json"],
    requiredChanges: ["audit.json"],
    routes: [`${routers}/review-skill-router/SKILL.md`],
    forbiddenRoutes: [`${routers}/design-skill-router/SKILL.md`, `${routers}/implement-skill-router/SKILL.md`],
    audit: { path: "audit.json", missingPath: "router/references/review/SKILL.md" },
  },
  {
    id: "direct-skill-creation",
    prompt: "Create one reusable direct-workflow agent skill at new-skill/SKILL.md. It converts newline-separated `product,quantity` records into JSON. Prescribe an ordered parse → normalize → validate → emit process, not only an input/output description. Valid input becomes an array of objects with a trimmed string `name` and positive integer `quantity`, preserving record order. On the first invalid record, emit only {\"error\":{\"line\":N,\"reason\":\"quantity must be a positive integer\"}}. Keep the skill self-contained and discoverable. Do not create a router or supporting files.",
    files: {},
    allowedChanges: ["new-skill/SKILL.md"],
    requiredChanges: ["new-skill/SKILL.md"],
    routes: [`${craft}/author-agent-skill/SKILL.md`],
    forbiddenRoutes: [`${routers}/implement-skill-router/SKILL.md`],
    probes: [
      {
        prompt: "Read new-skill/SKILL.md, follow its process for this input, and write its result to result.json without changing the skill:\n\n Pears ,3\nOats,12",
        reads: ["new-skill/SKILL.md"],
        json: { path: "result.json", value: [{ name: "Pears", quantity: 3 }, { name: "Oats", quantity: 12 }] },
      },
      {
        prompt: "Read new-skill/SKILL.md, follow its process for this input, and write its single result to result.json without changing the skill:\n\nPears,3\nOats,nope\nRice,2",
        reads: ["new-skill/SKILL.md"],
        json: { path: "result.json", value: { error: { line: 2, reason: "quantity must be a positive integer" } } },
      },
    ],
  },
  {
    id: "router-creation-owner",
    prompt: routerRequest,
    files: leaves,
    allowedChanges: ["router/SKILL.md"],
    requiredChanges: ["router/SKILL.md"],
    routes: [`${routers}/implement-skill-router/SKILL.md`],
    forbiddenRoutes: [`${craft}/author-agent-skill/SKILL.md`],
    probes: routerProbes,
  },
  {
    id: "implement-then-audit-router",
    prompt: `${routerRequest} Then audit the completed router and write audit.json as {"findings":[{"path":"workspace-relative affected path","problem":"concrete defect"}]}. Construction and assessment are both requested; do not stop at a design or an audit of the still-missing router. The evaluator will also assess the result in fresh contexts.`,
    files: leaves,
    allowedChanges: ["router/SKILL.md", "audit.json"],
    requiredChanges: ["router/SKILL.md", "audit.json"],
    routes: [`${routers}/implement-skill-router/SKILL.md`],
    audit: { path: "audit.json" },
    probes: routerProbes,
  },
  {
    id: "already-satisfied",
    prompt: "Inspect this workspace and make any necessary change so answer doubles its numeric input. If it already does, leave every file unchanged.",
    files: { "src/answer.ts": "export const answer = (value: number) => value * 2\n" },
    allowedChanges: [],
    requiredChanges: [],
    routes: [],
    runtime: { module: "src/answer.ts", exportName: "answer", calls: [{ args: [9], expected: 18 }] },
  },
]
