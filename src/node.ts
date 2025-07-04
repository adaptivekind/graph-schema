export interface GraphNode<T = any> {
  id: string;
  label?: string;
  data?: T;
  metadata?: Record<string, any>;
}

export interface GraphNodeWithId extends GraphNode {
  id: string;
}

export type NodeId = string;
