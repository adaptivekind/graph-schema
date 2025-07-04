export interface Link {
  id?: string;
  source: string;
  type?: LinkType;
  target: string;
  label?: string;
  value?: number;
  weights?: Record<string, number>;
}

export enum LinkType {
  To = "to",
  From = "from",
  Has = "has",
  In = "in",
  Child = "child",
  ImplicitTo = "implicit",
  ImplicitFrom = "implicitFrom",
  ImplicitAlias = "implicitAlias",
}
