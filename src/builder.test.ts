import { builder } from "./builder";
import { Link } from "./types";

const byTarget = (target: string) => (link: Link) => link.target === target;

describe("factor", () => {
  it("should create empty items", () => {
    const graph = builder().build();
    expect(Object.keys(graph.nodes)).toHaveLength(0);
  });

  it("should create a single item", () => {
    const graph = builder().id("foo").build();
    expect(Object.keys(graph.nodes)).toHaveLength(1);
    expect(graph.nodes.foo.label).toStrictEqual("foo");
    expect(graph.nodes.weights).not.toBeDefined();
  });

  it("should create a single item with value", () => {
    const graph = builder().id("foo").weight("value", 0.9).build();
    expect(Object.keys(graph.nodes)).toHaveLength(1);
    expect(graph.nodes.foo.label).toStrictEqual("foo");
    expect(graph.nodes.foo.weights?.value).toStrictEqual(0.9);
  });

  it("should create linked items", () => {
    const graph = builder().id("foo").and().id("bar").to("foo").build();
    expect(Object.keys(graph.nodes)).toHaveLength(2);
    expect(graph.links.find(byTarget("foo"))).toBeDefined();
    expect(graph.nodes.foo.label).toStrictEqual("foo");
  });

  it("should create linked items with value", () => {
    const graph = builder()
      .id("foo")
      .and()
      .id("bar")
      .link("foo", { value: 0.1 })
      .build();
    expect(Object.keys(graph.nodes)).toHaveLength(2);
    const link = graph.links.find(byTarget("foo"));
    expect(link).toBeDefined();
    expect(link?.weights?.value).toBe(0.1);
    expect(graph.nodes.foo.label).toStrictEqual("foo");
  });

  it("should create deep links", () => {
    const graph = builder().deep("word", 6).build();
    expect(Object.keys(graph.nodes)).toHaveLength(6);
  });

  it("should create many items", () => {
    const graph = builder().many(50).build();
    expect(Object.keys(graph.nodes)).toHaveLength(50);
    expect(graph.nodes["bar-baz"].weights?.value).toBe(0.2);
  });

  it("should create many items with default number of links", () => {
    const graph = builder().many(10).build();
    expect(Object.keys(graph.nodes)).toHaveLength(10);
    expect(Object.keys(graph.links)).toHaveLength(15);
  });
});
