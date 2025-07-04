import { GraphNode } from "./node";
import { GraphLink } from "./link";

export interface Graph {
  nodes: GraphNode[];
  links: GraphLink[];
}
