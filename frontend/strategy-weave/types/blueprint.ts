export interface BlueprintStyleToken {
  name: string;
  value: string;
  usage: string;
}

export interface BlueprintStyle {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  intended_for: string[];
  recommended_node_types: string[];
  tokens: BlueprintStyleToken[];
  notes: string[];
}
