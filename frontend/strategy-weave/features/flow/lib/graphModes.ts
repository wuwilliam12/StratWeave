import type { Edge, Node } from "reactflow";
import type { FlowEdgeData, FlowNodeData } from "@/lib/graphConvert";

export type GraphMode = "state" | "action";

const ACTION_NODE_TYPE = "action";
const STATE_NODE_TYPE = "state";

function asNodeData(node: Node): FlowNodeData {
  return (node.data ?? {}) as FlowNodeData;
}

function asEdgeData(edge: Edge): FlowEdgeData {
  return (edge.data ?? {}) as FlowEdgeData;
}

type Projection = {
  nodes: Node[];
  edges: Edge[];
};

/**
 * State mode returns the original graph. Action mode hides state nodes and
 * derives Action->Action transitions from Action->State->...->Action paths.
 */
export function projectGraphForMode(
  nodes: Node[],
  edges: Edge[],
  mode: GraphMode,
): Projection {
  if (mode === "state") {
    return { nodes, edges };
  }

  const visibleNodes = nodes.filter((node) => asNodeData(node).nodeType !== STATE_NODE_TYPE);
  const visibleNodeIds = new Set(visibleNodes.map((node) => node.id));
  const edgesBySource = new Map<string, Edge[]>();

  for (const edge of edges) {
    const bucket = edgesBySource.get(edge.source) ?? [];
    bucket.push(edge);
    edgesBySource.set(edge.source, bucket);
  }

  const directEdges = edges.filter(
    (edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target),
  );
  const inferredEdges: Edge[] = [];
  const inferredEdgeKeys = new Set<string>();

  for (const sourceNode of visibleNodes) {
    if (asNodeData(sourceNode).nodeType !== ACTION_NODE_TYPE) {
      continue;
    }

    const queue: Array<{ nodeId: string; labels: string[]; visited: Set<string> }> = [
      { nodeId: sourceNode.id, labels: [], visited: new Set([sourceNode.id]) },
    ];

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) break;

      const outgoing = edgesBySource.get(current.nodeId) ?? [];
      for (const edge of outgoing) {
        if (current.visited.has(edge.target)) continue;

        const targetNode = nodes.find((node) => node.id === edge.target);
        if (!targetNode) continue;

        const targetData = asNodeData(targetNode);
        const label = asEdgeData(edge).label?.trim();
        const nextLabels = label ? [...current.labels, label] : current.labels;

        if (targetData.nodeType === ACTION_NODE_TYPE && targetNode.id !== sourceNode.id) {
          const dedupeKey = `${sourceNode.id}:${targetNode.id}`;
          if (!inferredEdgeKeys.has(dedupeKey)) {
            inferredEdgeKeys.add(dedupeKey);
            inferredEdges.push({
              id: `derived-${sourceNode.id}-${targetNode.id}`,
              source: sourceNode.id,
              target: targetNode.id,
              type: edge.type,
              data: {
                label: nextLabels.join(" -> "),
                derived: true,
              } as FlowEdgeData,
            });
          }
          continue;
        }

        if (targetData.nodeType === STATE_NODE_TYPE) {
          queue.push({
            nodeId: targetNode.id,
            labels: nextLabels,
            visited: new Set([...current.visited, targetNode.id]),
          });
        }
      }
    }
  }

  const directEdgeIds = new Set(directEdges.map((edge) => `${edge.source}:${edge.target}`));
  const mergedEdges = [
    ...directEdges,
    ...inferredEdges.filter((edge) => !directEdgeIds.has(`${edge.source}:${edge.target}`)),
  ];

  return {
    nodes: visibleNodes,
    edges: mergedEdges,
  };
}
