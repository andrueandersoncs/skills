import * as THREE from "three"
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js"
import type { ScopeConnection } from "./scope-types"

type Footprint = {
  readonly id: string
  readonly x: number
  readonly z: number
  readonly width: number
  readonly depth: number
}

type CircuitTraceOptions = {
  readonly connections: ReadonlyArray<ScopeConnection>
  readonly components: ReadonlyArray<Footprint>
  readonly boardWidth: number
  readonly boardDepth: number
  readonly comparison: boolean
}

type Point = { readonly x: number; readonly z: number }
type Side = "left" | "right" | "top" | "bottom"
type Obstacle = Footprint & { readonly left: number; readonly right: number; readonly top: number; readonly bottom: number }
type Segment = { readonly from: Point; readonly to: Point }
type Endpoint = { readonly pad: Point; readonly exit: Point }
type TraceVisual = {
  readonly connection: ScopeConnection
  readonly material: THREE.MeshStandardMaterial
  readonly baseColor: THREE.Color
}

const trackWidth = 0.145
const clearanceWidth = 0.235
const padRadius = 0.055
const routeClearance = 0.24 // Includes solder leads and the track's mask clearance.
const boardMargin = 0.2
const traceY = 0.102
const layerStep = 0.032
const componentLeadTop = 0.345
const traceHeight = 0.018
const selectedCopper = new THREE.Color(0xf6c565)

const distance = (from: Point, to: Point) => Math.abs(from.x - to.x) + Math.abs(from.z - to.z)
const pointEquals = (left: Point, right: Point) => Math.abs(left.x - right.x) < 0.0001 && Math.abs(left.z - right.z) < 0.0001

const simplify = (points: ReadonlyArray<Point>) => points.reduce<Point[]>((result, point) => {
  if (result.length === 0 || !pointEquals(result[result.length - 1], point)) result.push(point)
  if (result.length < 3) return result
  const first = result[result.length - 3]
  const middle = result[result.length - 2]
  const last = result[result.length - 1]
  if ((first.x === middle.x && middle.x === last.x) || (first.z === middle.z && middle.z === last.z)) result.splice(result.length - 2, 1)
  return result
}, [])

const segmentsOf = (points: ReadonlyArray<Point>) => points.slice(1).map((to, index) => ({ from: points[index], to }))

const intersects = (segment: Segment, obstacle: Obstacle) => {
  if (segment.from.x === segment.to.x) {
    const low = Math.min(segment.from.z, segment.to.z)
    const high = Math.max(segment.from.z, segment.to.z)
    return segment.from.x > obstacle.left && segment.from.x < obstacle.right && high > obstacle.top && low < obstacle.bottom
  }
  const low = Math.min(segment.from.x, segment.to.x)
  const high = Math.max(segment.from.x, segment.to.x)
  return segment.from.z > obstacle.top && segment.from.z < obstacle.bottom && high > obstacle.left && low < obstacle.right
}

const routeIsClear = (points: ReadonlyArray<Point>, obstacles: ReadonlyArray<Obstacle>) =>
  segmentsOf(points).every((segment) => obstacles.every((obstacle) => !intersects(segment, obstacle)))

const endpointFor = (component: Footprint, side: Side, index: number, total: number): Endpoint => {
  if (side === "left" || side === "right") {
    const offsetLimit = Math.max(0, component.depth / 2 - 0.11)
    const offset = total <= 1 ? 0 : -offsetLimit + index / (total - 1) * offsetLimit * 2
    const x = component.x + (side === "left" ? -1 : 1) * (component.width / 2 + 0.045)
    const z = component.z + offset
    return { pad: { x, z }, exit: { x: x + (side === "left" ? -1 : 1) * routeClearance, z } }
  }
  const offsetLimit = Math.max(0, component.width / 2 - 0.11)
  const offset = total <= 1 ? 0 : -offsetLimit + index / (total - 1) * offsetLimit * 2
  const z = component.z + (side === "top" ? -1 : 1) * (component.depth / 2 + 0.045)
  const x = component.x + offset
  return { pad: { x, z }, exit: { x, z: z + (side === "top" ? -1 : 1) * routeClearance } }
}

const sidesToward = (from: Footprint, to: Footprint): ReadonlyArray<Side> => {
  const dx = to.x - from.x
  const dz = to.z - from.z
  const horizontal: Side = dx < 0 ? "left" : "right"
  const vertical: Side = dz < 0 ? "top" : "bottom"
  return Math.abs(dx) >= Math.abs(dz)
    ? [horizontal, vertical, horizontal === "left" ? "right" : "left", vertical === "top" ? "bottom" : "top"]
    : [vertical, horizontal, vertical === "top" ? "bottom" : "top", horizontal === "left" ? "right" : "left"]
}

const routeCandidates = (from: Point, to: Point, xLanes: ReadonlyArray<number>, zLanes: ReadonlyArray<number>) => {
  const candidates: Point[][] = [
    [from, { x: to.x, z: from.z }, to],
    [from, { x: from.x, z: to.z }, to],
  ]
  xLanes.forEach((x) => candidates.push([from, { x, z: from.z }, { x, z: to.z }, to]))
  zLanes.forEach((z) => candidates.push([from, { x: from.x, z }, { x: to.x, z }, to]))
  return candidates.map(simplify)
}

const detourCandidates = (from: Point, to: Point, xLanes: ReadonlyArray<number>, zLanes: ReadonlyArray<number>) => {
  const candidates: Point[][] = []
  xLanes.forEach((x) => zLanes.forEach((z) => {
    candidates.push([from, { x, z: from.z }, { x, z }, { x: to.x, z }, to])
    candidates.push([from, { x: from.x, z }, { x, z }, { x, z: to.z }, to])
  }))
  return candidates.map(simplify)
}

const segmentsConflict = (left: Segment, right: Segment) => {
  const leftVertical = left.from.x === left.to.x
  const rightVertical = right.from.x === right.to.x
  const margin = clearanceWidth / 2
  if (leftVertical === rightVertical) {
    if (leftVertical) {
      if (Math.abs(left.from.x - right.from.x) >= clearanceWidth) return false
      return Math.min(Math.max(left.from.z, left.to.z), Math.max(right.from.z, right.to.z)) + margin >= Math.max(Math.min(left.from.z, left.to.z), Math.min(right.from.z, right.to.z)) - margin
    }
    if (Math.abs(left.from.z - right.from.z) >= clearanceWidth) return false
    return Math.min(Math.max(left.from.x, left.to.x), Math.max(right.from.x, right.to.x)) + margin >= Math.max(Math.min(left.from.x, left.to.x), Math.min(right.from.x, right.to.x)) - margin
  }
  const vertical = leftVertical ? left : right
  const horizontal = leftVertical ? right : left
  return vertical.from.x >= Math.min(horizontal.from.x, horizontal.to.x) - margin && vertical.from.x <= Math.max(horizontal.from.x, horizontal.to.x) + margin
    && horizontal.from.z >= Math.min(vertical.from.z, vertical.to.z) - margin && horizontal.from.z <= Math.max(vertical.from.z, vertical.to.z) + margin
}

const pathsConflict = (left: ReadonlyArray<Point>, right: ReadonlyArray<Point>) => segmentsOf(left).some((segment) => segmentsOf(right).some((other) => segmentsConflict(segment, other)))

const segmentGeometries = (from: Point, to: Point, y: number, width: number, height: number, broken: boolean) => {
  const length = distance(from, to)
  if (length < 0.001) return []
  const pieces = broken && length > 0.52
    ? [[0, 0.43], [0.57, 1]] as const
    : [[0, 1]] as const
  return pieces.map(([start, end]) => {
    const startPoint = { x: from.x + (to.x - from.x) * start, z: from.z + (to.z - from.z) * start }
    const endPoint = { x: from.x + (to.x - from.x) * end, z: from.z + (to.z - from.z) * end }
    const geometry = new THREE.BoxGeometry(Math.abs(endPoint.x - startPoint.x) || width, height, Math.abs(endPoint.z - startPoint.z) || width)
    geometry.translate((startPoint.x + endPoint.x) / 2, y, (startPoint.z + endPoint.z) / 2)
    return geometry
  })
}

const cornerGeometry = (point: Point, y: number, radius: number, height: number) => {
  const geometry = new THREE.CylinderGeometry(radius, radius, height, 8)
  geometry.translate(point.x, y, point.z)
  return geometry
}

const leadGeometry = (point: Point, y: number) => {
  const bottom = y + traceHeight / 2
  const height = Math.max(0.012, componentLeadTop - bottom)
  const geometry = new THREE.CylinderGeometry(0.042, 0.055, height, 8)
  geometry.translate(point.x, bottom + height / 2, point.z)
  return geometry
}
const merge = (geometries: THREE.BufferGeometry[]) => {
  const merged = mergeGeometries(geometries)
  geometries.forEach((geometry) => geometry.dispose())
  return merged
}

const colorsFor = (connection: ScopeConnection, comparison: boolean) => {
  if (!comparison || connection.change === "unchanged") return 0xdfab62
  if (connection.change === "added") return 0xf0cb81
  if (connection.change === "modified") return 0xdba169
  return 0xc49179
}

export const createCircuitTraces = (options: CircuitTraceOptions) => {
  const group = new THREE.Group()
  group.name = "Circuit traces"
  const components = new Map(options.components.map((component) => [component.id, component]))
  const obstacles = options.components.map((component) => ({
    ...component,
    left: component.x - component.width / 2 - routeClearance,
    right: component.x + component.width / 2 + routeClearance,
    top: component.z - component.depth / 2 - routeClearance,
    bottom: component.z + component.depth / 2 + routeClearance,
  }))
  const halfWidth = options.boardWidth / 2 - boardMargin
  const halfDepth = options.boardDepth / 2 - boardMargin
  const xLanes = [...new Set([
    -halfWidth,
    halfWidth,
    ...obstacles.flatMap((obstacle) => [obstacle.left - 0.12, obstacle.right + 0.12]),
  ])].filter((lane) => lane >= -halfWidth && lane <= halfWidth)
  const zLanes = [...new Set([
    -halfDepth,
    halfDepth,
    ...obstacles.flatMap((obstacle) => [obstacle.top - 0.12, obstacle.bottom + 0.12]),
  ])].filter((lane) => lane >= -halfDepth && lane <= halfDepth)
  const endpointTotals = new Map<string, number>()
  options.connections.forEach((connection) => {
    endpointTotals.set(connection.from, (endpointTotals.get(connection.from) ?? 0) + 1)
    endpointTotals.set(connection.to, (endpointTotals.get(connection.to) ?? 0) + 1)
  })
  const endpointSeen = new Map<string, number>()
  const endpointOrders = new Map<string, readonly [number, number]>()
  options.connections.forEach((connection) => {
    const fromOrder = endpointSeen.get(connection.from) ?? 0
    endpointSeen.set(connection.from, fromOrder + 1)
    const toOrder = endpointSeen.get(connection.to) ?? 0
    endpointSeen.set(connection.to, toOrder + 1)
    endpointOrders.set(connection.id, [fromOrder, toOrder])
  })

  const clearanceMaterial = new THREE.MeshStandardMaterial({ color: 0x123d32, roughness: 0.78, metalness: 0.05 })
  const traces: TraceVisual[] = []
  const placedPaths: Array<{ readonly points: ReadonlyArray<Point>; readonly layer: number }> = []

  options.connections.forEach((connection) => {
    const from = components.get(connection.from)
    const to = components.get(connection.to)
    if (!from || !to) return
    const [fromOrder, toOrder] = endpointOrders.get(connection.id) ?? [0, 0]
    const fromTotal = endpointTotals.get(from.id) ?? 1
    const toTotal = endpointTotals.get(to.id) ?? 1
    let route: Point[] | undefined
    let fromEndpoint: Endpoint | undefined
    let toEndpoint: Endpoint | undefined

    const fromSides: ReadonlyArray<Side> = from.id === to.id ? ["right"] : sidesToward(from, to)
    const toSides: ReadonlyArray<Side> = from.id === to.id ? ["bottom"] : sidesToward(to, from)
    let shortest = Infinity
    for (const candidates of [routeCandidates, detourCandidates]) {
      for (const fromSide of fromSides) for (const toSide of toSides) {
        const source = endpointFor(from, fromSide, fromOrder, fromTotal)
        const target = endpointFor(to, toSide, toOrder, toTotal)
        for (const candidate of candidates(source.exit, target.exit, xLanes, zLanes)) {
          const length = candidate.reduce((total, point, index) => index === 0 ? total : total + distance(candidate[index - 1], point), 0)
          if (length >= shortest || !routeIsClear(candidate, obstacles)) continue
          shortest = length
          route = candidate
          fromEndpoint = source
          toEndpoint = target
        }
      }
      if (route) break
    }
    if (!route || !fromEndpoint || !toEndpoint) return

    const path = simplify([fromEndpoint.pad, ...route, toEndpoint.pad])
    const occupiedLayers = new Set(placedPaths.filter((placed) => pathsConflict(path, placed.points)).map((placed) => placed.layer))
    let layer = 0
    while (occupiedLayers.has(layer)) layer += 1
    placedPaths.push({ points: path, layer })
    const y = traceY + layer * layerStep
    const color = new THREE.Color(colorsFor(connection, options.comparison))
    const material = new THREE.MeshStandardMaterial({ color, emissive: 0x623414, emissiveIntensity: 0.26, roughness: 0.5, metalness: 0.35 })
    const trace = new THREE.Group()
    trace.name = `Circuit trace ${connection.id}`
    trace.userData.connectionId = connection.id
    trace.userData.scopeConnection = connection
    const broken = options.comparison && connection.change === "removed"
    const maskGeometries: THREE.BufferGeometry[] = []
    const copperGeometries: THREE.BufferGeometry[] = []
    segmentsOf(path).forEach((segment) => {
      maskGeometries.push(...segmentGeometries(segment.from, segment.to, y - 0.012, clearanceWidth, 0.014, broken))
      copperGeometries.push(...segmentGeometries(segment.from, segment.to, y, trackWidth, traceHeight, broken))
    })
    path.forEach((point, index) => {
      const endpoint = index === 0 || index === path.length - 1
      maskGeometries.push(cornerGeometry(point, y - 0.012, endpoint ? padRadius + 0.04 : clearanceWidth / 2, 0.014))
      copperGeometries.push(cornerGeometry(point, y, endpoint ? padRadius : trackWidth / 2, endpoint ? 0.026 : traceHeight))
    })
    copperGeometries.push(leadGeometry(fromEndpoint.pad, y), leadGeometry(toEndpoint.pad, y))
    const maskGeometry = merge(maskGeometries)
    const copperGeometry = merge(copperGeometries)
    if (maskGeometry) trace.add(new THREE.Mesh(maskGeometry, clearanceMaterial))
    if (copperGeometry) trace.add(new THREE.Mesh(copperGeometry, material))
    group.add(trace)
    traces.push({ connection, material, baseColor: color })
  })

  const select = (id: string) => {
    traces.forEach((trace) => {
      const incident = !id || trace.connection.from === id || trace.connection.to === id
      trace.material.color.copy(incident && id ? selectedCopper : trace.baseColor)
      trace.material.emissive.setHex(incident && id ? 0x70400c : 0x623414)
      trace.material.emissiveIntensity = incident && id ? 0.52 : 0.26
    })
  }

  return { group, select }
}
