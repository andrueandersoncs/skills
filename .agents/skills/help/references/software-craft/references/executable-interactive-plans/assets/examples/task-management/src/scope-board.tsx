import { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { createCircuitTraces } from "./circuit-traces"
import type { ScopeChange, ScopeConnection, ScopeGraph, ScopeNode, ScopeVersion, SchemaView } from "./scope-types"
import "./scope-board.css"

type ScopeBoardProps = {
  readonly graph: ScopeGraph
  readonly selectedId: string
  readonly onSelect: (id: string) => void
  readonly disabled?: boolean
}

type Point = { readonly x: number; readonly z: number }
type ComponentFootprint = { readonly width: number; readonly depth: number; readonly shape: "union" | "array" | "codec" | "plain" }
type NodeVisual = { readonly materials: THREE.MeshStandardMaterial[]; readonly halo: THREE.Mesh }
type CameraOrientation = { azimuth: number; polar: number }
type BoardRuntime = {
  readonly select: (id: string) => void
  readonly reset: () => void
  readonly setInteractionDisabled: (disabled: boolean) => void
  readonly dispose: () => void
}

type ComparisonMode = "comparison" | "current" | "proposed"

const changeNames: Record<ScopeChange, string> = {
  added: "Added · proposed",
  modified: "Modified · current → proposed",
  removed: "Removed · current",
  unchanged: "Unchanged",
}

const connectionNames: Record<ScopeConnection["kind"], string> = {
  schema: "Schema composition",
  dependency: "Declared dependency",
  input: "Function input",
  success: "Function success",
  error: "Function error",
  service: "Function service",
}

const changeColors: Record<ScopeChange, number> = {
  added: 0x5fa77a,
  modified: 0xc38345,
  removed: 0x9a625b,
  unchanged: 0x6f877a,
}


const clamp = (value: number, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, value))
const defaultCameraOrientation: CameraOrientation = {
  azimuth: Math.atan2(16, 19),
  polar: Math.acos(18 / Math.hypot(16, 18, 19)),
}
const versionFor = (node: ScopeNode, mode: ComparisonMode): ScopeVersion | undefined => mode === "current"
  ? node.current
  : mode === "proposed"
    ? node.proposed
    : node.proposed ?? node.current
const labelFor = (node: ScopeNode, mode: ComparisonMode) => versionFor(node, mode)?.label ?? node.label
const nodeStatus = (node: ScopeNode, mode: ComparisonMode) => mode === "comparison"
  ? changeNames[node.change]
  : versionFor(node, mode)
    ? mode === "current" ? "Current definition" : "Proposed definition"
    : mode === "current" ? "Absent from current" : "Absent from proposed"

const schemaShape = (schema: SchemaView | undefined) => {
  const kind = schema?.kind.toLowerCase() ?? ""
  if (kind.includes("union")) return "union"
  if (kind.includes("array")) return "array"
  if (kind.includes("codec") || schema?.encoded) return "codec"
  return "plain"
}

const componentFootprint = (schema: SchemaView | undefined): ComponentFootprint => {
  const fields = schema?.fields.length ?? 0
  return {
    width: 1.25 + clamp(fields, 0, 7) * 0.11,
    depth: 0.86 + clamp(fields, 0, 6) * 0.045,
    shape: schemaShape(schema),
  }
}


const disposeObject = (root: THREE.Object3D) => {
  root.traverse((object) => {
    const mesh = object as THREE.Mesh
    mesh.geometry?.dispose()
    const material = mesh.material
    if (Array.isArray(material)) material.forEach((item) => item.dispose())
    else material?.dispose()
  })
}

const addComponent = (
  scene: THREE.Scene,
  node: ScopeNode,
  position: Point,
  footprint: ComponentFootprint,
  mode: ComparisonMode,
  nodeVisuals: Map<string, NodeVisual>,
  pickables: THREE.Object3D[],
) => {
  const version = versionFor(node, mode)
  const group = new THREE.Group()
  group.position.set(position.x, 0.34, position.z)
  group.userData.scopeNodeId = node.id

  const category = version?.category ?? node.category
  const color = mode === "comparison" ? changeColors[node.change] : mode === "current" ? 0x637b71 : 0x5fa77a
  const bodyMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.64, metalness: 0.24 })
  const capMaterial = new THREE.MeshStandardMaterial({ color: category === "Interface" ? 0x7ca6bd : category === "Type" ? 0xa28bbb : 0xe8bf76, roughness: 0.42, metalness: 0.58 })
  const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x274e42, roughness: 0.7, metalness: 0.15 })
  const body = new THREE.Mesh(new THREE.BoxGeometry(footprint.width, 0.34, footprint.depth), bodyMaterial)
  body.position.y = 0.16
  group.add(body)

  const cap = new THREE.Mesh(new THREE.BoxGeometry(footprint.width * 0.7, 0.08, footprint.depth * 0.56), capMaterial)
  cap.position.y = 0.37
  group.add(cap)

  if (footprint.shape === "union") {
    const marker = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.055, 6, 12), darkMaterial)
    marker.rotation.x = Math.PI / 2
    marker.position.set(0, 0.44, 0)
    group.add(marker)
  } else if (footprint.shape === "array") {
    for (let index = -1; index <= 1; index += 1) {
      const lane = new THREE.Mesh(new THREE.BoxGeometry(footprint.width * 0.48, 0.035, 0.055), darkMaterial)
      lane.position.set(0, 0.43, index * 0.13)
      group.add(lane)
    }
  } else if (footprint.shape === "codec") {
    const lower = new THREE.Mesh(new THREE.BoxGeometry(footprint.width * 0.46, 0.04, footprint.depth * 0.4), darkMaterial)
    lower.position.set(-footprint.width * 0.14, 0.43, 0)
    const upper = lower.clone()
    upper.position.x = footprint.width * 0.14
    group.add(lower, upper)
  } else if (category === "Interface") {
    for (let index = -1; index <= 1; index += 1) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(footprint.width * 0.42, 0.035, 0.05), darkMaterial)
      rail.position.set(0, 0.43, index * 0.13)
      group.add(rail)
    }
  } else if (category === "Type") {
    const marker = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.045, 6), darkMaterial)
    marker.position.y = 0.43
    group.add(marker)
  }


  if (mode === "comparison" && node.change === "modified" && node.current?.schema) {
    const before = componentFootprint(node.current.schema)
    const currentOutline = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(before.width, 0.38, before.depth)),
      new THREE.LineBasicMaterial({ color: 0xf4e0ba, transparent: true, opacity: 0.72 }),
    )
    currentOutline.position.set(0, 0.17, 0)
    group.add(currentOutline)
  }

  if (mode === "comparison" && node.change === "removed") {
    const outline = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(footprint.width + 0.12, 0.46, footprint.depth + 0.12)),
      new THREE.LineBasicMaterial({ color: 0xe0a5a0, transparent: true, opacity: 0.95 }),
    )
    outline.position.y = 0.19
    group.add(outline)
    bodyMaterial.transparent = true
    bodyMaterial.opacity = 0.3
    capMaterial.transparent = true
    capMaterial.opacity = 0.35
  } else if (!version) {
    const unavailableOutline = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(footprint.width + 0.12, 0.42, footprint.depth + 0.12)),
      new THREE.LineBasicMaterial({ color: 0xc7d2c9, transparent: true, opacity: 0.82 }),
    )
    unavailableOutline.position.y = 0.18
    group.add(unavailableOutline)
    bodyMaterial.transparent = true
    bodyMaterial.opacity = 0.12
    capMaterial.transparent = true
    capMaterial.opacity = 0.16
  }

  group.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.userData.scopeNodeId = node.id
      pickables.push(object)
    }
  })

  const halo = new THREE.Mesh(
    new THREE.BoxGeometry(footprint.width + 0.25, 0.028, footprint.depth + 0.25),
    new THREE.MeshBasicMaterial({ color: 0xffe5a8, transparent: true, opacity: 0.82 }),
  )
  halo.position.y = 0.015
  halo.visible = false
  group.add(halo)

  scene.add(group)
  nodeVisuals.set(node.id, { materials: [bodyMaterial, capMaterial], halo })
}

const boardLayout = (nodes: ReadonlyArray<ScopeNode>, mode: ComparisonMode) => {
  const byScope = new Map<string, ScopeNode[]>()
  nodes.forEach((node) => {
    const key = versionFor(node, mode)?.scope ?? node.scope
    const nodesForScope = byScope.get(key) ?? []
    nodesForScope.push(node)
    byScope.set(key, nodesForScope)
  })
  const groups = [...byScope.entries()].map(([scope, groupNodes]) => ({ scope, nodes: groupNodes }))
  const maximumGroupSize = Math.max(1, ...groups.map((group) => group.nodes.length))
  const localColumns = Math.min(4, Math.max(1, Math.ceil(Math.sqrt(maximumGroupSize))))
  const localRows = Math.ceil(maximumGroupSize / localColumns)
  const regionWidth = Math.max(5.5, localColumns * 3 + 1.8)
  const regionDepth = Math.max(4.3, localRows * 2.5 + 1.8)
  const groupColumns = Math.max(1, Math.ceil(Math.sqrt(groups.length)))
  const groupRows = Math.ceil(groups.length / groupColumns)
  const boardWidth = groupColumns * (regionWidth + 0.55) + 0.75
  const boardDepth = groupRows * (regionDepth + 0.55) + 0.75
  const positions = new Map<string, Point>()
  const regions: Array<{ readonly scope: string; readonly x: number; readonly z: number }> = []

  groups.forEach((group, groupIndex) => {
    const gx = groupIndex % groupColumns
    const gz = Math.floor(groupIndex / groupColumns)
    const centerX = (gx - (groupColumns - 1) / 2) * (regionWidth + 0.55)
    const centerZ = (gz - (groupRows - 1) / 2) * (regionDepth + 0.55)
    regions.push({ scope: group.scope, x: centerX, z: centerZ })
    group.nodes.forEach((node, index) => {
      const column = index % localColumns
      const row = Math.floor(index / localColumns)
      positions.set(node.id, {
        x: centerX + (column - (localColumns - 1) / 2) * 3,
        z: centerZ + (row - (localRows - 1) / 2) * 2.5,
      })
    })
  })

  return { positions, regions, regionWidth, regionDepth, boardWidth, boardDepth }
}

export const ScopeBoard = ({ graph, selectedId, onSelect, disabled = false }: ScopeBoardProps) => {
  const stageRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const nodeLabelRefs = useRef(new Map<string, HTMLButtonElement>())
  const regionLabelRefs = useRef(new Map<string, HTMLSpanElement>())
  const runtimeRef = useRef<BoardRuntime | undefined>(undefined)
  const selectRef = useRef(onSelect)
  const disabledRef = useRef(disabled)
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>("comparison")
  const [hoveredId, setHoveredId] = useState("")
  const selectedIdRef = useRef(selectedId)
  const cameraOrientationRef = useRef<CameraOrientation | null>(null)
  if (cameraOrientationRef.current === null) cameraOrientationRef.current = { ...defaultCameraOrientation }
  const cameraOrientation = cameraOrientationRef.current
  const [rendererStatus, setRendererStatus] = useState<"checking" | "ready" | "fallback">("checking")
  selectRef.current = onSelect
  disabledRef.current = disabled
  selectedIdRef.current = selectedId

  const visibleConnections = useMemo(() => graph.connections.filter((connection) =>
    comparisonMode === "current" ? connection.change !== "added" : comparisonMode === "proposed" ? connection.change !== "removed" : true
  ), [graph.connections, comparisonMode])
  const selectedConnections = useMemo(
    () => selectedId ? visibleConnections.filter((connection) => connection.from === selectedId || connection.to === selectedId) : [],
    [visibleConnections, selectedId],
  )
  const layout = useMemo(() => boardLayout(graph.nodes, comparisonMode), [graph.nodes, comparisonMode])
  const nodeById = useMemo(() => new Map(graph.nodes.map((node) => [node.id, node])), [graph.nodes])
  const selectedNode = nodeById.get(selectedId)

  useEffect(() => {
    const stage = stageRef.current
    const overlay = overlayRef.current
    if (!stage || !overlay) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" })
    } catch {
      setRendererStatus("fallback")
      return
    }

    setRendererStatus("ready")
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setClearColor(0xf6f7f2, 0)
    renderer.domElement.className = "scope-board-canvas"
    renderer.domElement.setAttribute("aria-hidden", "true")
    stage.prepend(renderer.domElement)

    const scene = new THREE.Scene()
    const cameraRadius = Math.hypot(layout.boardWidth, layout.boardDepth) + 2
    const camera = new THREE.OrthographicCamera(-8, 8, 8, -8, 0.1, cameraRadius * 2)
    camera.position.setFromSphericalCoords(cameraRadius, cameraOrientation.polar, cameraOrientation.azimuth)
    camera.lookAt(0, 0, 0)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0, 0)
    controls.enableDamping = false
    controls.enablePan = false
    controls.enableZoom = false
    controls.autoRotate = false
    controls.minPolarAngle = 0.34
    controls.maxPolarAngle = Math.PI / 2 - 0.18
    controls.enabled = !disabledRef.current
    controls.update()
    scene.add(new THREE.HemisphereLight(0xfff4d6, 0x173b31, 2.25))
    const keyLight = new THREE.DirectionalLight(0xffdf9d, 2.5)
    keyLight.position.set(-7, 14, 9)
    scene.add(keyLight)

    const board = new THREE.Mesh(
      new THREE.BoxGeometry(layout.boardWidth, 0.26, layout.boardDepth),
      new THREE.MeshStandardMaterial({ color: 0x245f4d, roughness: 0.77, metalness: 0.13 }),
    )
    board.position.y = -0.14
    scene.add(board)

    layout.regions.forEach((region) => {
      const regionPlate = new THREE.Mesh(
        new THREE.BoxGeometry(layout.regionWidth, 0.045, layout.regionDepth),
        new THREE.MeshStandardMaterial({ color: 0x397762, roughness: 0.82, metalness: 0.08, transparent: true, opacity: 0.68 }),
      )
      regionPlate.position.set(region.x, 0.01, region.z)
      scene.add(regionPlate)
      const perimeter = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(layout.regionWidth, 0.06, layout.regionDepth)),
        new THREE.LineBasicMaterial({ color: 0x9bc8ac, transparent: true, opacity: 0.42 }),
      )
      perimeter.position.set(region.x, 0.04, region.z)
      scene.add(perimeter)
    })

    const nodeVisuals = new Map<string, NodeVisual>()
    const pickables: THREE.Object3D[] = []
    const components = graph.nodes.map((node) => {
      const position = layout.positions.get(node.id) ?? { x: 0, z: 0 }
      const footprint = componentFootprint(versionFor(node, comparisonMode)?.schema)
      addComponent(scene, node, position, footprint, comparisonMode, nodeVisuals, pickables)
      return { id: node.id, x: position.x, z: position.z, width: footprint.width, depth: footprint.depth }
    })
    const circuitTraces = createCircuitTraces({
      connections: visibleConnections,
      components,
      boardWidth: layout.boardWidth,
      boardDepth: layout.boardDepth,
      comparison: comparisonMode === "comparison",
    })
    scene.add(circuitTraces.group)

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    const labelPoint = new THREE.Vector3()
    const fitPoint = new THREE.Vector3()
    const regionPoint = new THREE.Vector3()
    const cameraOffset = new THREE.Vector3()
    const cameraSpherical = new THREE.Spherical()
    let viewport = { width: 0, height: 0 }

    const updateLabels = () => {
      graph.nodes.forEach((node) => {
        const point = layout.positions.get(node.id)
        const label = nodeLabelRefs.current.get(node.id)
        if (!point || !label) return
        labelPoint.set(point.x, 0.78, point.z).project(camera)
        label.style.transform = `translate3d(${(labelPoint.x * 0.5 + 0.5) * viewport.width}px, ${(-labelPoint.y * 0.5 + 0.5) * viewport.height}px, 0) translate(-50%, -135%)`
        label.hidden = labelPoint.z < -1 || labelPoint.z > 1
      })
      layout.regions.forEach((region) => {
        const label = regionLabelRefs.current.get(region.scope)
        if (!label) return
        regionPoint.set(region.x - layout.regionWidth * 0.36, 0.31, region.z - layout.regionDepth * 0.38).project(camera)
        label.style.transform = `translate3d(${(regionPoint.x * 0.5 + 0.5) * viewport.width}px, ${(-regionPoint.y * 0.5 + 0.5) * viewport.height}px, 0) translate(-50%, -50%)`
        label.hidden = regionPoint.z < -1 || regionPoint.z > 1
      })
    }

    const draw = () => {
      renderer.render(scene, camera)
      updateLabels()
    }

    const fitCamera = () => {
      if (!viewport.width || !viewport.height) return
      camera.updateMatrixWorld(true)
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
      for (let corner = 0; corner < 8; corner += 1) {
        fitPoint.set((corner & 1 ? 1 : -1) * layout.boardWidth / 2, corner & 4 ? 0.9 : -0.26, (corner & 2 ? 1 : -1) * layout.boardDepth / 2).applyMatrix4(camera.matrixWorldInverse)
        minX = Math.min(minX, fitPoint.x); maxX = Math.max(maxX, fitPoint.x)
        minY = Math.min(minY, fitPoint.y); maxY = Math.max(maxY, fitPoint.y)
      }
      const aspect = viewport.width / viewport.height
      const verticalSpan = Math.max(maxY - minY, (maxX - minX) / aspect) * 1.18
      const centerX = (minX + maxX) / 2, centerY = (minY + maxY) / 2
      camera.left = centerX - verticalSpan * aspect / 2
      camera.right = centerX + verticalSpan * aspect / 2
      camera.top = centerY + verticalSpan / 2
      camera.bottom = centerY - verticalSpan / 2
      camera.updateProjectionMatrix()
    }

    const rememberOrientation = () => {
      cameraOffset.copy(camera.position).sub(controls.target)
      cameraSpherical.setFromVector3(cameraOffset)
      cameraOrientation.azimuth = cameraSpherical.theta
      cameraOrientation.polar = cameraSpherical.phi
    }

    const onCameraChange = () => {
      rememberOrientation()
      fitCamera()
      draw()
    }

    const resize = () => {
      const { width, height } = stage.getBoundingClientRect()
      if (!width || !height) return
      viewport = { width, height }
      renderer.setSize(width, height, false)
      fitCamera()
      draw()
    }

    const rotateCamera = (azimuth: number, polar: number) => {
      cameraOffset.copy(camera.position).sub(controls.target)
      cameraSpherical.setFromVector3(cameraOffset)
      cameraSpherical.theta += azimuth
      cameraSpherical.phi = clamp(cameraSpherical.phi + polar, controls.minPolarAngle, controls.maxPolarAngle)
      camera.position.setFromSphericalCoords(cameraOffset.length(), cameraSpherical.phi, cameraSpherical.theta).add(controls.target)
      controls.update()
    }

    const resetView = () => {
      camera.position.setFromSphericalCoords(cameraRadius, defaultCameraOrientation.polar, defaultCameraOrientation.azimuth)
      controls.target.set(0, 0, 0)
      controls.update()
    }

    const applySelection = (id: string) => {
      nodeVisuals.forEach((visual, nodeId) => {
        const isSelected = nodeId === id
        visual.halo.visible = isSelected
        visual.materials.forEach((material) => {
          material.emissive.setHex(isSelected ? 0x43300d : 0x000000)
          material.emissiveIntensity = isSelected ? 0.5 : 0
        })
      })
      circuitTraces.select(id)
      draw()
    }

    const intersections: THREE.Intersection[] = []
    const pick = (event: PointerEvent): string | undefined => {
      if (!viewport.width || !viewport.height) return undefined
      pointer.x = event.offsetX / viewport.width * 2 - 1
      pointer.y = -(event.offsetY / viewport.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      intersections.length = 0
      raycaster.intersectObjects(pickables, false, intersections)
      return intersections[0]?.object.userData.scopeNodeId as string | undefined
    }

    const activePointers = new Map<number, Point>()
    let selectionSuppressed = false
    const onPointerDown = (event: PointerEvent) => {
      if (disabledRef.current || event.button !== 0) return
      stage.focus({ preventScroll: true })
      if (activePointers.size === 0) selectionSuppressed = false
      activePointers.set(event.pointerId, { x: event.clientX, z: event.clientY })
      if (activePointers.size > 1) selectionSuppressed = true
    }
    const onPointerMove = (event: PointerEvent) => {
      const origin = activePointers.get(event.pointerId)
      if (origin && Math.hypot(event.clientX - origin.x, event.clientY - origin.z) > 6) selectionSuppressed = true
      if (!disabledRef.current && !selectionSuppressed) setHoveredId(pick(event) ?? "")
    }
    const onPointerUp = (event: PointerEvent) => {
      const canSelect = !disabledRef.current && !selectionSuppressed && event.isPrimary && event.button === 0 && activePointers.has(event.pointerId)
      activePointers.delete(event.pointerId)
      if (canSelect) {
        const id = pick(event)
        if (id) selectRef.current(id)
      }
      if (activePointers.size === 0) selectionSuppressed = false
    }
    const onPointerCancel = (event: PointerEvent) => {
      selectionSuppressed = true
      activePointers.delete(event.pointerId)
      setHoveredId("")
    }
    const onPointerLeave = () => setHoveredId("")
    const onKeyDown = (event: KeyboardEvent) => {
      if (disabledRef.current) return
      if (event.key === "ArrowLeft") rotateCamera(0.16, 0)
      else if (event.key === "ArrowRight") rotateCamera(-0.16, 0)
      else if (event.key === "ArrowUp") rotateCamera(0, -0.1)
      else if (event.key === "ArrowDown") rotateCamera(0, 0.1)
      else return
      event.preventDefault()
    }
    const onContextLost = (event: Event) => {
      event.preventDefault()
      setRendererStatus("fallback")
    }
    const onContextRestored = () => {
      setRendererStatus("ready")
      resize()
    }

    controls.addEventListener("change", onCameraChange)
    renderer.domElement.addEventListener("pointerdown", onPointerDown, true)
    renderer.domElement.addEventListener("pointerup", onPointerUp, true)
    renderer.domElement.addEventListener("pointermove", onPointerMove, true)
    renderer.domElement.addEventListener("pointercancel", onPointerCancel, true)
    renderer.domElement.addEventListener("pointerleave", onPointerLeave)
    renderer.domElement.addEventListener("webglcontextlost", onContextLost)
    renderer.domElement.addEventListener("webglcontextrestored", onContextRestored)
    stage.addEventListener("keydown", onKeyDown)
    const observer = new ResizeObserver(resize)
    observer.observe(stage)
    resize()
    applySelection(selectedIdRef.current)

    runtimeRef.current = {
      select: applySelection,
      reset: resetView,
      setInteractionDisabled: (isDisabled) => {
        controls.enabled = !isDisabled
        if (isDisabled) setHoveredId("")
      },
      dispose: () => {
        rememberOrientation()
        observer.disconnect()
        controls.removeEventListener("change", onCameraChange)
        controls.dispose()
        renderer.domElement.removeEventListener("pointerdown", onPointerDown, true)
        renderer.domElement.removeEventListener("pointerup", onPointerUp, true)
        renderer.domElement.removeEventListener("pointermove", onPointerMove, true)
        renderer.domElement.removeEventListener("pointercancel", onPointerCancel, true)
        renderer.domElement.removeEventListener("pointerleave", onPointerLeave)
        renderer.domElement.removeEventListener("webglcontextlost", onContextLost)
        renderer.domElement.removeEventListener("webglcontextrestored", onContextRestored)
        stage.removeEventListener("keydown", onKeyDown)
        disposeObject(scene)
        renderer.renderLists.dispose()
        renderer.dispose()
        renderer.forceContextLoss()
        renderer.domElement.remove()
      },
    }

    return () => {
      runtimeRef.current?.dispose()
      runtimeRef.current = undefined
    }
  }, [graph, layout, comparisonMode, visibleConnections, cameraOrientation])

  useEffect(() => {
    runtimeRef.current?.select(selectedId)
  }, [selectedId])

  useEffect(() => {
    runtimeRef.current?.setInteractionDisabled(disabled)
  }, [disabled])

  const selectNode = (id: string) => {
    if (!disabled) onSelect(id)
  }

  return <section
    className={`scope-board ${rendererStatus === "fallback" ? "is-fallback" : ""}`}
    aria-label="Contract scope board"
    data-renderer-status={rendererStatus}
    data-selected-node-id={selectedId}
    data-comparison-mode={comparisonMode}
    data-node-count={graph.nodes.length}
  >
    <header className="scope-board-header">
      <div><h2>Contract scope</h2><p>Select a component or browse all contracts. Connections describe source contracts, not runtime execution.</p></div>
      <div className="scope-board-tools">
        <div className="scope-board-modes" aria-label="Comparison mode">
          {(["comparison", "current", "proposed"] as const).map((mode) => <button key={mode} type="button" disabled={disabled} aria-pressed={comparisonMode === mode} onClick={() => setComparisonMode(mode)} data-comparison-mode={mode}>{mode === "comparison" ? "Compare" : mode[0].toUpperCase() + mode.slice(1)}</button>)}
        </div>
        <button className="scope-board-reset" type="button" disabled={disabled || rendererStatus !== "ready"} onClick={() => runtimeRef.current?.reset()}>Reset view</button>
        <div className="scope-board-legend" aria-label="Change legend">
          {(Object.keys(changeNames) as ScopeChange[]).map((change) => <span key={change} data-change={change}><i aria-hidden="true" />{changeNames[change]}</span>)}
        </div>
      </div>
    </header>
    <p className="scope-board-description" id="scope-board-description">Drag to rotate, or use arrow keys when focused. {graph.nodes.length} declarations across {layout.regions.length} regions. Unchanged source does not mean unaffected behavior.</p>
    <div className="scope-board-stage" ref={stageRef} tabIndex={rendererStatus === "ready" ? 0 : -1} aria-label="Interactive 3D contract scope board" aria-describedby="scope-board-description" data-board-stage="isometric">
      <div className="scope-board-overlay" ref={overlayRef} hidden={rendererStatus !== "ready"}>
        {graph.nodes.map((node) => <button
          key={node.id}
          type="button"
          className={`scope-board-node-label is-${node.change}`}
          data-visible={node.id === selectedId || node.id === hoveredId}
          title={`${labelFor(node, comparisonMode)} · ${nodeStatus(node, comparisonMode)}`}
          ref={(element) => { if (element) nodeLabelRefs.current.set(node.id, element); else nodeLabelRefs.current.delete(node.id) }}
          onClick={() => selectNode(node.id)}
          disabled={disabled}
          aria-pressed={selectedId === node.id}
          data-node-id={node.id}
          data-change={node.change}
        >{labelFor(node, comparisonMode)}<small>{versionFor(node, comparisonMode)?.category ?? node.category} · {nodeStatus(node, comparisonMode)}</small></button>)}
        {layout.regions.map((region) => <span
          key={region.scope}
          className="scope-board-region-label"
          ref={(element) => { if (element) regionLabelRefs.current.set(region.scope, element); else regionLabelRefs.current.delete(region.scope) }}
          data-scope={region.scope}
        >{region.scope}</span>)}
      </div>
      {rendererStatus === "fallback" && <div className="scope-board-fallback" role="status">3D board is unavailable. Use the contract component list below to inspect and select every declared item.</div>}
    </div>
    <div className="scope-board-footer">
      <details className="scope-board-node-list" open={rendererStatus === "fallback" ? true : undefined}>
        <summary>All contracts ({graph.nodes.length})</summary>
        <nav aria-label="Contract components">{graph.nodes.map((node) => <button key={node.id} type="button" disabled={disabled} aria-current={selectedId === node.id ? "true" : undefined} onClick={() => selectNode(node.id)} data-node-id={node.id} data-change={node.change}><span>{labelFor(node, comparisonMode)}</span><small>{versionFor(node, comparisonMode)?.category ?? node.category} · {versionFor(node, comparisonMode)?.scope ?? node.scope} · {nodeStatus(node, comparisonMode)}</small></button>)}</nav>
      </details>
      <aside className="scope-board-connection-note"><h3>Connected to {selectedNode ? labelFor(selectedNode, comparisonMode) : "selection"}</h3>{selectedConnections.length > 0 ? <ul>{selectedConnections.map((connection) => {
        const otherId = connection.from === selectedId ? connection.to : connection.from
        const label = comparisonMode === "current" ? connection.currentLabel : comparisonMode === "proposed" ? connection.proposedLabel : connection.label
        const other = nodeById.get(otherId)
        return <li key={connection.id} data-connection-id={connection.id} data-connection-kind={connection.kind} data-change={connection.change}><button disabled={disabled} onClick={() => selectNode(otherId)}>{other ? labelFor(other, comparisonMode) : otherId}</button><span>{connectionNames[connection.kind]}{connection.kind === "schema" ? ` · ${label}` : ""}{comparisonMode === "comparison" && connection.change !== "unchanged" ? ` · ${changeNames[connection.change]}` : ""}</span></li>
      })}</ul> : <span>No connections in this view.</span>}</aside>
    </div>
  </section>
}
