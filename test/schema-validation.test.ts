import { Graph } from "../src/index";
import testGraphRaw from "./test-graph.json";
import graphSchema from "../graph.schema.json";
import Ajv from "ajv";

describe("Graph schema validation", () => {
  test("should be able to create graph from interface", () => {
    const graph: Graph = {
      id: "test-graph-1",
      title: "Test Graph Example",
      nodes: [
        {
          id: "name-1",
          weights: {
            value: 1,
          },
          type: "person",
          meta: {
            age: "25",
          },
        },
        {
          id: "name-2",
        },
      ],
      links: [
        {
          source: "name-1",
          target: "name-2",
          type: "friendship",
        },
      ],
    };

    expect(graph.id).toBe("test-graph-1");
    expect(graph.title).toBe("Test Graph Example");
    expect(graph.nodes).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: "name-1" })]),
    );
  });

  test("should import JSON file and validate against Graph type", () => {
    const testGraph: Graph = testGraphRaw;
    const ajv = new Ajv();
    const validate = ajv.compile(graphSchema);
    const isValid = validate(testGraph);

    expect(validate.errors).toBeNull();
    expect(isValid).toBe(true);
    expect(testGraph.id).toBe("social-network-graph");
    expect(testGraph.title).toBe("Sample Social Network Graph");
    expect(Array.isArray(testGraph.nodes)).toBe(true);
    expect(Array.isArray(testGraph.links)).toBe(true);
    expect(testGraph.nodes.length).toBe(3);
    expect(testGraph.links.length).toBe(3);
  });
});
