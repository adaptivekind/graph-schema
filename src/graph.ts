import { Node } from "./node";
import { Link } from "./link";

export interface Graph {
  id?: string;
  title?: string;
  nodes: Node[];
  links: Link[];
}
