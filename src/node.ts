export interface Node {
  id: string;
  title?: string;
  aliases?: Array<string>;
  value?: number;
  weights?: Record<string, number>;
  meta?: Record<string, string>;
}
