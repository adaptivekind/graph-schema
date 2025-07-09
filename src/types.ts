export interface Graph {
  id?: string;
  label?: string;
  nodes: { [name: string]: Node };
  links: Link[];
}

export interface Node {
  label?: string;
  type?: string;
  aliases?: Array<string>;
  value?: number;
  weights?: { [name: string]: number };
  meta?: { [name: string]: string };
}

export interface Link {
  id?: string;
  source: string;
  type?: string;
  target: string;
  label?: string;
  value?: number;
  weights?: { [name: string]: number };
  meta?: { [name: string]: string };
}
