import { Graph } from "../src/index";
import testGraphRaw from "./test-graph.json";

describe("Graph schema validation", () => {
  test("should be able to create graph from interface", () => {
    const graph: Graph = {
      nodes: [
        {
          id: "name-1",
        },
        {
          id: "name-2",
        },
      ],
      links: [
        {
          source: "name-1",
          target: "name-2",
        },
      ],
    };

    const graphAsString = JSON.stringify(graph);

    expect(graphAsString).toBe(
      '{"nodes":[{"id":"name-1"},{"id":"name-2"}],"links":[{"source":"name-1","target":"name-2"}]}',
    );
  });

  test("should import JSON file and validate against Graph type", () => {
    const testGraph: Graph = testGraphRaw;

    expect(Array.isArray(testGraph.nodes)).toBe(true);
    expect(Array.isArray(testGraph.links)).toBe(true);
    expect(testGraph.nodes.length).toBe(3);
    expect(testGraph.links.length).toBe(3);
  });
});
