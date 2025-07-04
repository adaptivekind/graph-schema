import { readFileSync } from "fs";
import { Graph } from "../src/index";
import path from "path";

describe("JSON Import/Export Validation", () => {
  const sampleGraphPath = path.resolve(__dirname, "sample-graph.json");

  test("should import JSON file and validate against Graph type", () => {
    const jsonData = readFileSync(sampleGraphPath, "utf-8");
    const graphData = JSON.parse(jsonData);

    expect(graphData).toHaveProperty("id");
    expect(graphData).toHaveProperty("label");
    expect(graphData).toHaveProperty("nodes");
    expect(graphData).toHaveProperty("links");

    expect(Array.isArray(graphData.nodes)).toBe(true);
    expect(Array.isArray(graphData.links)).toBe(true);
    expect(graphData.nodes.length).toBe(3);
    expect(graphData.links.length).toBe(3);
  });

  test("should validate node structure", () => {
    const jsonData = readFileSync(sampleGraphPath, "utf-8");
    const graphData = JSON.parse(jsonData);

    graphData.nodes.forEach((node: any) => {
      expect(node).toHaveProperty("id");
      expect(typeof node.id).toBe("string");

      if (node.label) {
        expect(typeof node.label).toBe("string");
      }

      if (node.data) {
        expect(typeof node.data).toBe("object");
      }

      if (node.metadata) {
        expect(typeof node.metadata).toBe("object");
      }
    });
  });

  test("should validate link structure", () => {
    const jsonData = readFileSync(sampleGraphPath, "utf-8");
    const graphData = JSON.parse(jsonData);

    graphData.links.forEach((link: any) => {
      expect(link).toHaveProperty("id");
      expect(link).toHaveProperty("source");
      expect(link).toHaveProperty("target");
      expect(typeof link.id).toBe("string");
      expect(typeof link.source).toBe("string");
      expect(typeof link.target).toBe("string");
    });
  });

  test("should validate that all link references point to existing nodes", () => {
    const jsonData = readFileSync(sampleGraphPath, "utf-8");
    const graphData = JSON.parse(jsonData);

    const nodeIds = new Set(graphData.nodes.map((node: any) => node.id));

    graphData.links.forEach((link: any) => {
      expect(nodeIds.has(link.source)).toBe(true);
      expect(nodeIds.has(link.target)).toBe(true);
    });
  });

  test("should type-check as Graph interface", () => {
    const jsonData = readFileSync(sampleGraphPath, "utf-8");
    const graphData: Graph = JSON.parse(jsonData);

    expect(graphData.id).toBe("sample-graph");
    expect(graphData.label).toBe("Sample Social Network");
    expect(graphData.nodes.length).toBe(3);
    expect(graphData.links.length).toBe(3);
  });
});
