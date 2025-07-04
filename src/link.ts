export interface Link {
  id?: string;
  source: string;
  type?: string;
  target: string;
  label?: string;
  value?: number;
  weights?: Record<string, number>;
  meta?: Record<string, string>;
}
