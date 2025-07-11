export interface Graph {
  domain?: string;
  id?: string;
  label?: string;
  links: Link[];
  nodes: { [name: string]: Node };
}

export interface Node {
  aliases?: Array<string>;
  label?: string;
  meta?: { [name: string]: string };
  type?: string;
  value?: number;
  weights?: { [name: string]: number };
}

export interface Link {
  id?: string;
  label?: string;
  meta?: { [name: string]: string };
  source: string;
  target: string;
  type?: string;
  value?: number;
  weights?: { [name: string]: number };
}
