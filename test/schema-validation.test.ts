import { Graph } from "../src/index";
import testGraphRaw from "./test-graph.json";
import graphSchema from "../graph.schema.json";
import Ajv from "ajv";

describe("Graph schema validation", () => {
  test("should be able to create graph from interface", () => {
    const graph: Graph = {
      nodes: [
        {
          id: "name-1",
          weights: {
            value: 1,
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
        },
      ],
    };

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
    expect(Array.isArray(testGraph.nodes)).toBe(true);
    expect(Array.isArray(testGraph.links)).toBe(true);
    expect(testGraph.nodes.length).toBe(3);
    expect(testGraph.links.length).toBe(3);
  });
});
