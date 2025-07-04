import { GraphNode } from "./node";
import { GraphLink } from "./link";

export interface Graph {
  id: string;
  label: string;
  nodes: GraphNode[];
  links: GraphLink[];
  directed?: boolean;
}
