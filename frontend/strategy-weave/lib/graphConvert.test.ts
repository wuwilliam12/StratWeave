import { describe, expect, it } from "vitest";
import type { Node as GraphNode } from "@/lib/graphApi";
import { toFlowNodes } from "@/lib/graphConvert";

describe("toFlowNodes", () => {
  it("maps API nodes to React Flow shape", () => {
    const apiNodes: GraphNode[] = [
      {
        id: "n1",
        label: "Root",
        position_x: 10,
        position_y: 20,
        node_type: "strategy",
        strategy_id: "s1",
        parent_id: null,
        sport: "boxing",
        action_id: null,
        athlete_id: null,
      },
    ];

    const flow = toFlowNodes(apiNodes);

    expect(flow).toHaveLength(1);
    expect(flow[0]).toMatchObject({
      id: "n1",
      position: { x: 10, y: 20 },
      data: {
        label: "Root",
        nodeType: "strategy",
        strategy_id: "s1",
        parentId: null,
        sport: "boxing",
        action_id: null,
        athlete_id: null,
      },
    });
  });
});
