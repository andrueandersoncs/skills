type MetricRun = {
  caseId: string
  family: string
  pass: boolean
  execution: { usage: unknown[]; durationMs: number; toolCalls: number }
}

export function summarize(runs: MetricRun[]) {
  const passed = runs.filter(run => run.pass).length
  const usages = runs.flatMap(run => run.execution.usage) as { totalTokens?: number; input?: number; output?: number; cacheRead?: number; cacheWrite?: number; cost?: { total?: number } }[]
  const metered = runs.length > 0 && runs.every(run => run.execution.usage.length > 0) && usages.every(usage => typeof usage.totalTokens === "number" && usage.totalTokens > 0)
  const totalTokens = metered ? usages.reduce((sum, usage) => sum + usage.totalTokens!, 0) : null
  const priced = metered && usages.every(usage => typeof usage.cost?.total === "number" && usage.cost.total > 0)
  const reportedDollars = priced ? usages.reduce((sum, usage) => sum + usage.cost!.total!, 0) : null
  const durations = runs.map(run => run.execution.durationMs).sort((a, b) => a - b)
  const durationMs = durations.reduce((sum, duration) => sum + duration, 0)
  return {
    runs: runs.length, passed, totalTokens,
    inputTokens: usages.reduce((sum, usage) => sum + (usage.input ?? 0), 0),
    outputTokens: usages.reduce((sum, usage) => sum + (usage.output ?? 0), 0),
    cacheReadTokens: usages.reduce((sum, usage) => sum + (usage.cacheRead ?? 0), 0),
    cacheWriteTokens: usages.reduce((sum, usage) => sum + (usage.cacheWrite ?? 0), 0),
    tokensPerSuccess: passed && totalTokens !== null ? totalTokens / passed : null,
    // Subscription providers commonly report zero price; do not call that free.
    reportedDollars,
    dollarsPerSuccess: passed && reportedDollars !== null ? reportedDollars / passed : null,
    durationMs, msPerSuccess: passed ? durationMs / passed : null,
    p95Ms: durations.length ? durations[Math.ceil(durations.length * 0.95) - 1] : null,
    toolCalls: runs.reduce((sum, run) => sum + run.execution.toolCalls, 0),
    families: Object.fromEntries([...new Set(runs.map(run => run.family))].map(family => {
      const group = runs.filter(run => run.family === family)
      return [family, { runs: group.length, passed: group.filter(run => run.pass).length }]
    })),
  }
}

export function pairedChanges(pairs: { caseId: string; baseline: boolean; candidate: boolean }[]) {
  const wins = pairs.filter(pair => pair.candidate && !pair.baseline).length
  const losses = pairs.filter(pair => !pair.candidate && pair.baseline).length
  const delta = pairs.length ? (wins - losses) / pairs.length : null
  // Hoeffding bound for independent paired differences in [-1, 1].
  const radius = pairs.length ? Math.sqrt(2 * Math.log(40) / pairs.length) : 0
  return {
    pairs: pairs.length, wins, losses, ties: pairs.length - wins - losses,
    successRateDelta: delta,
    confidence95: delta === null ? null : [Math.max(-1, delta - radius), Math.min(1, delta + radius)],
    regressions: [...new Set(pairs.filter(pair => pair.baseline && !pair.candidate).map(pair => pair.caseId))],
    improvements: [...new Set(pairs.filter(pair => !pair.baseline && pair.candidate).map(pair => pair.caseId))],
  }
}
