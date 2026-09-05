import { describe, expect, it } from "vitest"
import { Box3 } from "three"
import { createCircuitTraces } from "../src/circuit-traces"

describe("circuit traces", () => {
  it("connects opposite corners around wider intervening components", () => {
    const components = Array.from({ length: 9 }, (_, index) => ({
      id: `node-${index}`,
      x: (index % 3) * 3 - 3,
      z: Math.floor(index / 3) * 2.5 - 2.5,
      width: index === 0 || index === 8 ? 1.25 : 2.02,
      depth: index === 0 || index === 8 ? 0.86 : 1.13,
    }))
    const circuit = createCircuitTraces({
      connections: [{ id: "diagonal", from: "node-0", to: "node-8", kind: "schema", label: "reference", change: "unchanged" }],
      components,
      boardWidth: 12.1,
      boardDepth: 10.6,
      comparison: false,
    })
    const bounds = new Box3().setFromObject(circuit.group)
    expect(bounds.min.x).toBeLessThan(-2)
    expect(bounds.min.z).toBeLessThan(-2)
    expect(bounds.max.x).toBeGreaterThan(2)
    expect(bounds.max.z).toBeGreaterThan(2)
    expect(bounds.min.x).toBeGreaterThan(-6.05)
    expect(bounds.max.x).toBeLessThan(6.05)
    expect(bounds.min.z).toBeGreaterThan(-5.3)
    expect(bounds.max.z).toBeLessThan(5.3)
  })

  it("keeps a self-reference beside its component instead of the board perimeter", () => {
    const circuit = createCircuitTraces({
      connections: [{ id: "recursive", from: "node", to: "node", kind: "schema", label: "children", change: "unchanged" }],
      components: [{ id: "node", x: 0, z: 0, width: 1.25, depth: 0.86 }],
      boardWidth: 6.8,
      boardDepth: 5.6,
      comparison: false,
    })
    const bounds = new Box3().setFromObject(circuit.group)
    expect(bounds.max.x).toBeGreaterThan(0.625)
    expect(bounds.max.z).toBeGreaterThan(0.43)
    expect(bounds.min.x).toBeGreaterThan(-1.25)
    expect(bounds.max.x).toBeLessThan(1.25)
    expect(bounds.min.z).toBeGreaterThan(-1.25)
    expect(bounds.max.z).toBeLessThan(1.25)
  })
})
