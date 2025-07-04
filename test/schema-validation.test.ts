import { Graph } from "../src/index";
import testGraphRaw from "./test-graph.json";
import graphSchema from "../graph.schema.json";
import Ajv from "ajv";

describe("Graph schema validation", () => {
  test("should be able to create graph from interface", () => {
    const graph: Graph = {
      id: "test-graph-1",
      label: "Test Graph Example",
      nodes: {
        "name-1": {
          weights: {
            value: 1,
          },
          type: "person",
          meta: {
            age: "25",
          },
        },
        "name-2": {
          label: "Name 2",
        },
      },
      links: [
        {
          source: "name-1",
          target: "name-2",
          type: "friendship",
        },
      ],
    };

    expect(graph.id).toBe("test-graph-1");
    expect(graph.label).toBe("Test Graph Example");
    expect(graph.nodes["name-1"]).toEqual(
      expect.objectContaining({ type: "person" }),
    );
    expect(graph.nodes["name-2"]).toEqual(
      expect.objectContaining({ label: "Name 2" }),
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
    expect(testGraph.label).toBe("Sample Social Network Graph");
    expect(typeof testGraph.nodes).toBe("object");
    expect(Array.isArray(testGraph.links)).toBe(true);
    expect(Object.keys(testGraph.nodes).length).toBe(3);
    expect(testGraph.links.length).toBe(3);
    expect(testGraph.nodes["alice"]).toEqual(
      expect.objectContaining({ label: "Alice" }),
    );
    expect(testGraph.nodes["bob"]).toEqual(
      expect.objectContaining({ label: "Bob" }),
    );
    expect(testGraph.nodes["charlie"]).toEqual(
      expect.objectContaining({ label: "Charlie" }),
    );
  });
});
