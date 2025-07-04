import { NodeId } from './node';

export interface GraphLink<T = any> {
  id: string;
  source: NodeId;
  target: NodeId;
  label?: string;
  weight?: number;
  directed?: boolean;
  data?: T;
  metadata?: Record<string, any>;
}

export interface GraphEdge<T = any> extends GraphLink<T> {
  directed: boolean;
}

export interface DirectedLink<T = any> extends GraphLink<T> {
  directed: true;
}

export interface UndirectedLink<T = any> extends GraphLink<T> {
  directed: false;
}

export type LinkId = string;