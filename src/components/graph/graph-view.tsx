"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide,
} from "d3-force";
import { Search, ZoomIn, ZoomOut, RotateCcw, Hash, Sparkles, Brain, Unlink } from "lucide-react";

/* ── Types ── */
interface GraphNode {
  id: string; title: string; type: "resource" | "prompt" | "note" | "project"; tags: string[];
  x?: number; y?: number; vx?: number; vy?: number;
}

interface GraphEdge {
  source: string; target: string;
}

export interface GraphInsights {
  totalItems: number; totalTags: number; distinctTags: number;
  connectedItems: number; isolatedItems: number;
  domainCounts: { domain: string; count: number }[];
  topTags: { tag: string; count: number }[];
  orphanTags: { tag: string; items: string[] }[];
}

interface GraphViewProps {
  resources: { id: string; title: string; tags: string[]; createdAt: Date }[];
  prompts: { id: string; title: string; tags: string[]; createdAt: Date }[];
  notes: { id: string; title: string; tags: string[]; createdAt: Date }[];
  projects: { id: string; title: string; tags: string[]; createdAt: Date }[];
  insights: GraphInsights;
  compact?: boolean;
}

const typeConfig = {
  resource: { color: "#14B8A6", label: "Resources", path: "/resources" },
  prompt: { color: "#F59E0B", label: "Prompts", path: "/prompts" },
  note: { color: "#22C55E", label: "Notes", path: "/notes" },
  project: { color: "#8B5CF6", label: "Projects", path: "/projects" },
};

function KnowledgeOverview({ insights }: { insights: GraphInsights }) {
  const [open, setOpen] = useState(false);
  return (
    <details className="border-b border-border/30 bg-card/30" open={open}>
      <summary
        onClick={(e) => { e.preventDefault(); setOpen(!open); }}
        className="flex items-center gap-2 px-5 py-3 cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors select-none"
      >
        <Sparkles className="h-3.5 w-3.5 text-accent" />
        <span className="font-medium">Knowledge Overview</span>
        <span className="text-muted-foreground/60 ml-2 text-[11px]">{insights.totalItems} items · {insights.distinctTags} topics · {insights.connectedItems} connections</span>
      </summary>
      <div className="px-5 pb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg border border-border/30 bg-card p-3">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1.5">
            <Hash className="h-3 w-3" /> Knowledge Stats
          </div>
          <div className="space-y-0.5 text-xs text-foreground/80">
            <p>{insights.totalItems} total items</p>
            <p>{insights.distinctTags} unique topics</p>
            <p>{insights.totalTags} topic assignments</p>
          </div>
        </div>

        <div className="rounded-lg border border-border/30 bg-card p-3">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1.5">
            <Brain className="h-3 w-3" /> Connections
          </div>
          <div className="space-y-0.5 text-xs text-foreground/80">
            <p>{insights.connectedItems} connected items</p>
            <p>{insights.isolatedItems} isolated items</p>
            <p>{insights.connectedItems > 0 ? `${Math.round(insights.connectedItems / insights.totalItems * 100)}% connected` : "No connections yet"}</p>
          </div>
        </div>

        <div className="rounded-lg border border-border/30 bg-card p-3">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1.5">
            <Sparkles className="h-3 w-3" /> Top Topics
          </div>
          <div className="flex flex-wrap gap-1">
            {insights.topTags.slice(0, 5).map((t) => (
              <span key={t.tag} className="text-[11px] text-muted-foreground bg-muted/70 px-1.5 py-0.5 rounded">{t.tag} ({t.count})</span>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border/30 bg-card p-3">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1.5">
            <Unlink className="h-3 w-3" /> Knowledge Gaps
          </div>
          <div className="space-y-0.5 text-xs text-foreground/80">
            {insights.orphanTags.length > 0 ? (
              insights.orphanTags.slice(0, 3).map((o) => (
                <p key={o.tag} className="truncate">
                  <span className="font-medium text-muted-foreground">{o.tag}</span> — only in {o.items[0]}
                </p>
              ))
            ) : (
              <p>No orphan topics detected</p>
            )}
            {insights.isolatedItems > 0 && (
              <p className="text-muted-foreground/60 mt-1">{insights.isolatedItems} items have no shared tags</p>
            )}
          </div>
        </div>

        <div className="col-span-full">
          <div className="flex flex-wrap gap-2">
            {insights.domainCounts.filter((d) => d.count > 0).map((d) => (
              <span key={d.domain} className="text-[11px] text-muted-foreground bg-card border border-border/30 px-2 py-1 rounded-md">
                {d.domain} · {d.count}
              </span>
            ))}
          </div>
        </div>
      </div>
    </details>
  );
}

function NodeContextPanel({ node, onClose }: { node: { title: string; type: string; tags: string[] }; onClose: () => void }) {
  const cfg = typeConfig[node.type as keyof typeof typeConfig];
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
      <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-card px-4 py-3 shadow-lg min-w-[300px] max-w-md">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: cfg?.color + "20" }}>
          <span className="text-xs font-bold" style={{ color: cfg?.color }}>{node.type[0].toUpperCase()}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{node.title}</p>
          <p className="text-[11px] text-muted-foreground">{cfg?.label} · {node.tags.length} {node.tags.length === 1 ? "tag" : "tags"}</p>
        </div>
        <button onClick={onClose} className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors">
          <span className="text-xs">✕</span>
        </button>
      </div>
    </div>
  );
}

export function GraphView({ resources, prompts, notes, projects, insights, compact = false }: GraphViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const posRef = useRef<Record<string, { x: number; y: number }>>({});
  const rafRef = useRef<number | null>(null);

  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set(["resource", "prompt", "note", "project"]));
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
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

    for (const r of resources) n.push({ id: r.id, title: r.title, type: "resource", tags: r.tags || [] });
    for (const p of prompts) n.push({ id: p.id, title: p.title, type: "prompt", tags: p.tags || [] });
    for (const note of notes) n.push({ id: note.id, title: note.title, type: "note", tags: note.tags || [] });
    for (const p of projects) n.push({ id: p.id, title: p.title, type: "project", tags: p.tags || [] });

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

    const doneTimer = setTimeout(() => { sim.stop(); setSimDone(true); }, 4000);

    return () => {
      sim.stop();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(doneTimer);
    };
  }, [nodes, edges, activeTypes]);

  const query = searchQuery.toLowerCase().trim();
  const visibleNodes = nodes.filter((n) => activeTypes.has(n.type) && nodePositions[n.id]);
  const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));
  const visibleEdges = edges.filter((e) => nodePositions[e.source] && nodePositions[e.target] && visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target));

  const matchedNodes = useMemo(() => {
    if (!query) return null;
    return new Set(visibleNodes.filter((n) => n.title.toLowerCase().includes(query)).map((n) => n.id));
  }, [query, visibleNodes]);

  const connectedNodeIds = useMemo(() => {
    if (!hoveredNode && !selectedNode) return null;
    const id = hoveredNode || selectedNode?.id || null;
    if (!id) return null;
    const set = new Set<string>([id]);
    for (const e of visibleEdges) {
      if (e.source === id) set.add(e.target);
      if (e.target === id) set.add(e.source);
    }
    return set;
  }, [hoveredNode, selectedNode, visibleEdges]);

  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode(node.id === selectedNode?.id ? null : node);
  }, [selectedNode]);

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
      return { k: newK, x: ox - (ox - prev.x) * (newK / prev.k), y: oy - (oy - prev.y) * (newK / prev.k) };
    });
  }, [compact]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as SVGElement).closest("g")) return;
    setDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  }, [transform]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    setTransform((prev) => ({ ...prev, x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }));
  }, [dragging, dragStart]);

  const handleMouseUp = useCallback(() => setDragging(false), []);

  const resetView = useCallback(() => setTransform({ x: 0, y: 0, k: 1 }), []);
  const zoomIn = useCallback(() => setTransform((prev) => ({ ...prev, k: Math.min(4, prev.k * 1.3) })), []);
  const zoomOut = useCallback(() => setTransform((prev) => ({ ...prev, k: Math.max(0.2, prev.k * 0.7) })), []);

  return (
    <div className={`flex flex-col ${compact ? "h-[420px] rounded-xl border border-border/30 " : "flex-1"}`} data-accent="graph">
      {/* Knowledge Overview */}
      {!compact && <KnowledgeOverview insights={insights} />}

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/30 bg-card/50 shrink-0">
        {!compact && (
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find in graph..."
              className="h-8 w-full rounded-md border border-border bg-background pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/30 transition-all"
            />
          </div>
        )}

        <div className="flex items-center gap-1">
          {(["resource", "prompt", "note", "project"] as const).map((type) => (
            <button key={type} onClick={() => setActiveTypes((p) => { const n = new Set(p); n.has(type) ? n.delete(type) : n.add(type); return n; })}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all ${activeTypes.has(type) ? "bg-card border border-border/40 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: typeConfig[type].color }} />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <button onClick={zoomIn} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all" title="Zoom in">
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button onClick={zoomOut} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all" title="Zoom out">
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <button onClick={resetView} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all" title="Reset view">
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        {!compact && (
          <span className="text-xs text-muted-foreground tabular-nums ml-2">
            {visibleNodes.length} nodes · {visibleEdges.length} edges
          </span>
        )}
      </div>

      {/* Graph canvas */}
      <div ref={containerRef} className="flex-1 bg-card/20 relative" style={{ cursor: dragging ? "grabbing" : "grab" }} onWheel={handleWheel}>
        {visibleNodes.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-sm">
              <p className="text-sm text-muted-foreground mb-1">Your knowledge map will grow naturally as you create content</p>
              <p className="text-xs text-muted-foreground/60">Items sharing the same topic appear as connected nodes</p>
            </div>
          </div>
        ) : (
          <>
            <svg ref={svgRef} className="w-full h-full" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
              <g transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>
                {visibleEdges.map((edge) => {
                  const source = nodePositions[edge.source];
                  const target = nodePositions[edge.target];
                  if (!source || !target) return null;
                  const highlighted = !connectedNodeIds || (connectedNodeIds.has(edge.source) && connectedNodeIds.has(edge.target));
                  return (
                    <line key={`${edge.source}-${edge.target}`} x1={source.x} y1={source.y} x2={target.x} y2={target.y}
                      strokeWidth={highlighted ? (compact ? 1.5 : 2) : 0.5}
                      className={highlighted ? "stroke-border/60 transition-all duration-300" : "stroke-border/5 transition-all duration-300"}
                    />
                  );
                })}

                {visibleNodes.map((node) => {
                  const pos = nodePositions[node.id];
                  if (!pos) return null;
                  const isHovered = hoveredNode === node.id;
                  const isSelected = selectedNode?.id === node.id;
                  const dimmed = connectedNodeIds !== null && !connectedNodeIds.has(node.id) && connectedNodeIds.size > 1;
                  const isMatched = matchedNodes !== null && matchedNodes.has(node.id);
                  const color = typeConfig[node.type].color;
                  const r = isHovered || isSelected ? 28 : 22;
                  const innerR = isHovered || isSelected ? 14 : 9;

                  return (
                    <g key={node.id} transform={`translate(${pos.x},${pos.y})`} style={{ cursor: "pointer" }}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      onClick={() => handleNodeClick(node)}
                    >
                      <circle r={r + 4} fill={color} opacity={dimmed ? 0.02 : isHovered || isSelected ? 0.12 : 0.06} />
                      <circle r={r} fill={color} opacity={dimmed ? 0.04 : 0.1} />
                      <circle r={innerR} fill={matchedNodes && !isMatched && query ? "color-mix(in srgb, var(--text-muted) 30%, transparent)" : dimmed ? "color-mix(in srgb, var(--text-muted) 40%, transparent)" : color} />
                      {!compact && (
                        <text textAnchor="middle" dy={isHovered || isSelected ? 32 : 26}
                          fill={dimmed ? "color-mix(in srgb, var(--text-muted) 40%, transparent)" : "currentColor"}
                          className={(dimmed ? "opacity-40" : "opacity-90") + " transition-all duration-300 text-[11px] font-medium"}
                          style={{ pointerEvents: "none" }}
                        >
                          {node.title.length > 18 ? node.title.slice(0, 16) + "…" : node.title}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* Selected node context panel */}
            {selectedNode && (
              <NodeContextPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
            )}

            {/* Search hint */}
            {query && matchedNodes && matchedNodes.size === 0 && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2">
                <div className="bg-card border border-border/40 rounded-lg px-4 py-2 shadow-sm">
                  <p className="text-xs text-muted-foreground">No nodes match &quot;{query}&quot;</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      {!compact && (
        <div className="flex items-center gap-4 px-5 py-2 border-t border-border/20 bg-card/30">
          <span className="text-[11px] text-muted-foreground">{simDone ? "Graph stabilized" : "Laying out…"}</span>
        </div>
      )}
    </div>
  );
}
