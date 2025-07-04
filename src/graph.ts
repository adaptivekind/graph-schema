import { Node } from "./node";
import { Link } from "./link";

export interface Graph {
  id?: string;
  label?: string;
  nodes: Record<string, Node>;
  links: Link[];
}
