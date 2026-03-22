import {
  FLOW_NODE_TYPE_OPTIONS,
  type FlowNodeTypeOption,
} from "./nodeConstants";

const flowNodeTypeMap = new Map(
  FLOW_NODE_TYPE_OPTIONS.map((option) => [option.value, option]),
);

export function getFlowNodeTypeOption(rawType?: string | null): FlowNodeTypeOption {
  if (!rawType) {
    return flowNodeTypeMap.get("node") ?? FLOW_NODE_TYPE_OPTIONS[0];
  }

  return (
    flowNodeTypeMap.get(rawType.toLowerCase()) ??
    flowNodeTypeMap.get("node") ??
    FLOW_NODE_TYPE_OPTIONS[0]
  );
}
