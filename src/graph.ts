import { GraphNode } from "./node";
import { GraphLink } from "./link";

export interface Graph<NodeData = any, LinkData = any> {
  id?: string;
  label?: string;
  nodes: GraphNode<NodeData>[];
  links: GraphLink<LinkData>[];
  directed?: boolean;
}

export interface DirectedGraph<NodeData = any, LinkData = any>
  extends Graph<NodeData, LinkData> {
  directed: true;
}

export interface UndirectedGraph<NodeData = any, LinkData = any>
  extends Graph<NodeData, LinkData> {
  directed: false;
}
