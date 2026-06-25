"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide,
} from "d3-force";
import { Search, ZoomIn, ZoomOut, RotateCcw, ExternalLink } from "lucide-react";

/* ── Types ── */
interface GraphNode {
  id: string; title: string; type: "resource" | "prompt" | "note" | "project"; tags: string[];
  x?: number; y?: number; vx?: number; vy?: number;
}

interface GraphEdge {
  source: string; target: string;
}

interface GraphViewProps {
  resources: { id: string; title: string; tags: string[] }[];
  prompts: { id: string; title: string; tags: string[] }[];
  notes: { id: string; title: string; tags: string[] }[];
  projects: { id: string; title: string; tags: string[] }[];
  compact?: boolean;
}

const typeConfig = {
  resource: { color: "#14B8A6", label: "Resources", path: "/resources" },
  prompt: { color: "#F59E0B", label: "Prompts", path: "/prompts" },
  note: { color: "#22C55E", label: "Notes", path: "/notes" },
  project: { color: "#8B5CF6", label: "Projects", path: "/projects" },
};

export function GraphView({ resources, prompts, notes, projects, compact = false }: GraphViewProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const simRef = useRef<any>(null);
  const posRef = useRef<Record<string, { x: number; y: number }>>({});
  const rafRef = useRef<number | null>(null);

  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set(["resource", "prompt", "note", "project"]));
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [simDone, setSimDone] = useState(false);

  /* ── Build graph data ── */
  const { nodes, edges } = useMemo(() => {
    const n: GraphNode[] = [];
    const tagMap = new Map<string, string[]>();
    const edgeSet = new Set<string>();
    const e: GraphEdge[] = [];

    for (const r of resources) n.push({ id: r.id, title: r.title, type: "resource", tags: r.tags });
    for (const p of prompts) n.push({ id: p.id, title: p.title, type: "prompt", tags: p.tags });
    for (const note of notes) n.push({ id: note.id, title: note.title, type: "note", tags: note.tags });
    for (const p of projects) n.push({ id: p.id, title: p.title, type: "project", tags: p.tags });

    for (const node of n) {
      for (const tag of node.tags) {
        const existing = tagMap.get(tag) || [];
        for (const otherId of existing) {
          const key = [node.id, otherId].sort().join("-");
          if (!edgeSet.has(key)) {
            edgeSet.add(key);
            e.push({ source: node.id, target: otherId });
          }
        }
        existing.push(node.id);
        tagMap.set(tag, existing);
      }
    }

    return { nodes: n, edges: e };
  }, [resources, prompts, notes, projects]);

  /* ── Run force simulation ── */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const width = container.clientWidth || 1200;
    const height = container.clientHeight || 800;

    const filtered = nodes.filter((n) => activeTypes.has(n.type));
    const filteredIds = new Set(filtered.map((n) => n.id));
    const simNodes = filtered.map((n) => ({ ...n }));
    const simEdges = edges.filter((e) => filteredIds.has(e.source) && filteredIds.has(e.target));

    if (simNodes.length === 0) return;

    const sim = forceSimulation(simNodes as any)
      .force("link", forceLink(simEdges as any).id((d: any) => d.id).distance(160).strength(0.4) as any)
      .force("charge", forceManyBody().strength(-300) as any)
      .force("center", forceCenter(width / 2, height / 2))
      .force("collision", forceCollide(45) as any)
      .alphaDecay(0.015)
      .velocityDecay(0.3)
      .on("tick", () => {
        (sim.nodes() as any[]).forEach((n: any) => {
          posRef.current[n.id] = { x: n.x ?? 0, y: n.y ?? 0 };
        });
        if (!rafRef.current) {
          rafRef.current = requestAnimationFrame(() => {
            setNodePositions({ ...posRef.current });
            rafRef.current = null;
          });
        }
      });

    simRef.current = sim;

    const doneTimer = setTimeout(() => {
      sim.stop();
      setSimDone(true);
    }, 4000);

    return () => {
      sim.stop();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(doneTimer);
    };
  }, [nodes, edges, activeTypes]);

  /* ── Derived data ── */
  const query = searchQuery.toLowerCase().trim();
  const visibleNodes = nodes.filter(
    (n) => activeTypes.has(n.type) && nodePositions[n.id]
  );
  const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));
  const visibleEdges = edges.filter(
    (e) =>
      nodePositions[e.source] &&
      nodePositions[e.target] &&
      visibleNodeIds.has(e.source) &&
      visibleNodeIds.has(e.target)
  );

  const matchedNodes = useMemo(() => {
    if (!query) return null;
    return new Set(
      visibleNodes
        .filter((n) => n.title.toLowerCase().includes(query))
        .map((n) => n.id)
    );
  }, [query, visibleNodes]);

  const connectedNodeIds = useMemo(() => {
    if (!hoveredNode && !selectedNode) return null;
    const id = hoveredNode || selectedNode;
    if (!id) return null;
    const set = new Set<string>([id]);
    for (const e of visibleEdges) {
      if (e.source === id) set.add(e.target);
      if (e.target === id) set.add(e.source);
    }
    return set;
  }, [hoveredNode, selectedNode, visibleEdges]);

  /* ── Navigation ── */
  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      const config = typeConfig[node.type];
      if (config) {
        setSelectedNode(node.id);
        router.push(`${config.path}?id=${node.id}`);
      }
    },
    [router]
  );

  /* ── Zoom / Pan ── */
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (compact) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform((prev) => {
      const newK = Math.max(0.2, Math.min(4, prev.k * delta));
      const mx = e.clientX;
      const my = e.clientY;
      const svg = svgRef.current;
      if (!svg) return prev;
      const rect = svg.getBoundingClientRect();
      const ox = mx - rect.left;
      const oy = my - rect.top;
      return {
        k: newK,
        x: ox - (ox - prev.x) * (newK / prev.k),
        y: oy - (oy - prev.y) * (newK / prev.k),
      };
    });
  }, [compact]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as SVGElement).closest("g")) return;
      setDragging(true);
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    },
    [transform]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging) return;
      setTransform((prev) => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }));
    },
    [dragging, dragStart]
  );

  const handleMouseUp = useCallback(() => setDragging(false), []);

  const resetView = useCallback(() => {
    setTransform({ x: 0, y: 0, k: 1 });
  }, []);

  const zoomIn = useCallback(() => {
    setTransform((prev) => ({ ...prev, k: Math.min(4, prev.k * 1.3) }));
  }, []);

  const zoomOut = useCallback(() => {
    setTransform((prev) => ({ ...prev, k: Math.max(0.2, prev.k * 0.7) }));
  }, []);

  /* ── Compute bounds for auto-centering ── */
  const viewBox = useMemo(() => {
    const positions = Object.values(nodePositions);
    if (positions.length === 0) return "0 0 100 100";
    const padding = 80;
    const xs = positions.map((p) => p.x);
    const ys = positions.map((p) => p.y);
    const minX = Math.min(...xs) - padding;
    const minY = Math.min(...ys) - padding;
    const maxX = Math.max(...xs) + padding;
    const maxY = Math.max(...ys) + padding;
    return `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;
  }, [nodePositions]);

  /* ── Toggle type filter ── */
  const toggleType = useCallback((type: string) => {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
    setSimDone(false);
  }, []);

  return (
    <div className={`flex flex-col ${compact ? "h-[420px] rounded-xl border border-border/30 " : "flex-1"}`} data-accent="graph">
      {/* Toolbar */}
      <div className={`flex items-center gap-2 px-4 py-2 border-b border-border/30 bg-card/50 ${compact ? "shrink-0" : ""}`}>
        {!compact && (
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find nodes..."
              className="h-8 w-52 rounded-md border border-border bg-card pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
        )}

        <div className={`flex items-center gap-1 ${!compact ? "border-l border-border/30 pl-3" : ""}`}>
          {(["resource", "prompt", "note", "project"] as const).map((type) => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all ${activeTypes.has(type)
                ? "bg-card border border-border/40 text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: typeConfig[type].color }}
              />
              {compact ? "" : typeConfig[type].label}
              <span className="text-muted-foreground tabular-nums">
                {nodes.filter((n) => n.type === type).length}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={zoomIn}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            title="Zoom in"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={zoomOut}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            title="Zoom out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={resetView}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            title="Reset view"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        {!compact && (
          <span className="text-xs text-muted-foreground tabular-nums">
            {visibleNodes.length} nodes · {visibleEdges.length} edges
          </span>
        )}
      </div>

      {/* Graph canvas */}
      <div
        ref={containerRef}
        className="flex-1  bg-card/20 relative"
        style={{ cursor: dragging ? "grabbing" : "grab" }}
        onWheel={handleWheel}
      >
        <svg
          ref={svgRef}
          className="w-full h-full"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <g transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>
            {/* Edges */}
            {visibleEdges.map((edge) => {
              const source = nodePositions[edge.source];
              const target = nodePositions[edge.target];
              if (!source || !target) return null;
              const highlighted =
                !connectedNodeIds ||
                (connectedNodeIds.has(edge.source) && connectedNodeIds.has(edge.target));
              return (
                <line
                  key={`${edge.source}-${edge.target}`}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  strokeWidth={highlighted ? (compact ? 1.5 : 2) : 0.5}
                  className={
                    highlighted
                      ? "stroke-border/60 transition-all duration-300"
                      : "stroke-border/5 transition-all duration-300"
                  }
                />
              );
            })}

            {/* Nodes */}
            {visibleNodes.map((node) => {
              const pos = nodePositions[node.id];
              if (!pos) return null;
              const isHovered = hoveredNode === node.id;
              const isSelected = selectedNode === node.id;
              const dimmed = connectedNodeIds !== null && !(connectedNodeIds?.has(node.id) ?? false) && (connectedNodeIds?.size ?? 0) > 1;
              const isMatched = matchedNodes !== null && matchedNodes.has(node.id);

              const color = typeConfig[node.type].color;
              const baseR = compact ? 16 : 22;
              const hoverR = compact ? 20 : 28;
              const r = isHovered || isSelected ? hoverR : baseR;
              const innerBase = compact ? 6 : 9;
              const innerHover = compact ? 9 : 14;
              const innerR = isHovered || isSelected ? innerHover : innerBase;

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x},${pos.y})`}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => handleNodeClick(node)}
                  className="transition-all duration-200"
                >
                  {/* Glow */}
                  <circle
                    r={r + 4}
                    fill={color}
                    opacity={
                      dimmed ? 0.02 : isHovered || isSelected ? 0.12 : 0.06
                    }
                    className="transition-all duration-300"
                  />
                  {/* Outer ring */}
                  <circle
                    r={r}
                    fill={color}
                    opacity={dimmed ? 0.04 : 0.1}
                    className="transition-all duration-300"
                  />
                  {/* Inner dot */}
                  <circle
                    r={innerR}
                    fill={
                      matchedNodes && !isMatched && query
                        ? "color-mix(in srgb, var(--text-muted) 30%, transparent)"
                        : dimmed
                          ? "color-mix(in srgb, var(--text-muted) 40%, transparent)"
                          : color
                    }
                    className="transition-all duration-300"
                  />
                  {/* Label */}
                  {!compact && (
                    <text
                      textAnchor="middle"
                      dy={isHovered || isSelected ? 32 : 26}
                      fill={
                        dimmed
                          ? "color-mix(in srgb, var(--text-muted) 40%, transparent)"
                          : "currentColor"
                      }
                      className={
                        (dimmed ? "opacity-40" : "opacity-90") +
                        " transition-all duration-300 text-[11px] font-medium"
                      }
                      style={{ pointerEvents: "none" }}
                    >
                      {node.title.length > 18
                        ? node.title.slice(0, 16) + "…"
                        : node.title}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Empty state */}
        {visibleNodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                No data to display. Try enabling a type filter above.
              </p>
            </div>
          </div>
        )}

        {/* Search hint */}
        {query && matchedNodes && matchedNodes.size === 0 && !compact && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2">
            <div className="bg-card border border-border/40 rounded-lg px-4 py-2 shadow-sm">
              <p className="text-xs text-muted-foreground">
                No nodes match "{query}"
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      {!compact && (
        <div className="flex items-center gap-4 px-5 py-2 border-t border-border/20 bg-card/30">
          {(Object.keys(typeConfig) as Array<keyof typeof typeConfig>).map(
            (type) => (
              <div key={type} className="flex items-center gap-1.5">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: typeConfig[type].color }}
                />
                <span className="text-[11px] text-muted-foreground">
                  {typeConfig[type].label}
                </span>
              </div>
            )
          )}
          <span className="ml-auto text-[11px] text-muted-foreground">
            {simDone
              ? "Graph stabilized"
              : "Laying out…"}
          </span>
        </div>
      )}
    </div>
  );
}
