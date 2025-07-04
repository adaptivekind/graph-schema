import { GraphNode } from './node';
import { GraphLink } from './link';

export interface Graph<NodeData = any, LinkData = any> {
  id?: string;
  label?: string;
  nodes: GraphNode<NodeData>[];
  links: GraphLink<LinkData>[];
  directed?: boolean;
  metadata?: Record<string, any>;
}

export interface DirectedGraph<NodeData = any, LinkData = any> extends Graph<NodeData, LinkData> {
  directed: true;
}

export interface UndirectedGraph<NodeData = any, LinkData = any> extends Graph<NodeData, LinkData> {
  directed: false;
}

export interface GraphStatistics {
  nodeCount: number;
  linkCount: number;
  density: number;
  isConnected: boolean;
  hasCycles: boolean;
}

export interface GraphMetadata {
  name?: string;
  description?: string;
  version?: string;
  createdAt?: string;
  updatedAt?: string;
  author?: string;
  tags?: string[];
}