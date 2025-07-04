import { readFileSync, writeFileSync } from "fs";
import { Graph } from "../src/index";
import path from "path";

describe("JSON Import/Export Validation", () => {
  const sampleGraphPath = path.resolve(__dirname, "sample-graph.json");
  const outputGraphPath = path.resolve(__dirname, "output-graph.json");

  afterEach(() => {
    try {
      require("fs").unlinkSync(outputGraphPath);
    } catch (error) {
      // File doesn't exist, ignore
    }
  });

  test("should import JSON file and validate against Graph type", () => {
    const jsonData = readFileSync(sampleGraphPath, "utf-8");
    const graphData = JSON.parse(jsonData);

    expect(graphData).toHaveProperty("id");
    expect(graphData).toHaveProperty("label");
    expect(graphData).toHaveProperty("nodes");
    expect(graphData).toHaveProperty("links");
    expect(graphData).toHaveProperty("directed");

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

      if (link.weight !== undefined) {
        expect(typeof link.weight).toBe("number");
      }

      if (link.directed !== undefined) {
        expect(typeof link.directed).toBe("boolean");
      }
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
    expect(graphData.directed).toBe(false);
    expect(graphData.nodes.length).toBe(3);
    expect(graphData.links.length).toBe(3);
  });

  test("should export graph to JSON and re-import successfully", () => {
    const originalJsonData = readFileSync(sampleGraphPath, "utf-8");
    const originalGraph: Graph = JSON.parse(originalJsonData);

    const exportedJson = JSON.stringify(originalGraph, null, 2);
    writeFileSync(outputGraphPath, exportedJson);

    const reimportedJsonData = readFileSync(outputGraphPath, "utf-8");
    const reimportedGraph: Graph = JSON.parse(reimportedJsonData);

    expect(reimportedGraph).toEqual(originalGraph);
    expect(reimportedGraph.id).toBe(originalGraph.id);
    expect(reimportedGraph.nodes.length).toBe(originalGraph.nodes.length);
    expect(reimportedGraph.links.length).toBe(originalGraph.links.length);
  });

  test("should handle typed node and link data", () => {
    interface UserData {
      age: number;
      role: string;
    }

    interface RelationshipData {
      since: string;
    }

    const jsonData = readFileSync(sampleGraphPath, "utf-8");
    const graphData: Graph<UserData, RelationshipData> = JSON.parse(jsonData);

    const aliceNode = graphData.nodes.find((n) => n.id === "alice");
    expect(aliceNode?.data?.age).toBe(30);
    expect(aliceNode?.data?.role).toBe("developer");

    const friendshipLink = graphData.links.find((l) => l.id === "link1");
    expect(friendshipLink?.data?.since).toBe("2020-01-15");
  });

  test("should validate basic graph properties", () => {
    const jsonData = readFileSync(sampleGraphPath, "utf-8");
    const graphData = JSON.parse(jsonData);

    expect(typeof graphData.id).toBe("string");
    expect(typeof graphData.label).toBe("string");
    expect(typeof graphData.directed).toBe("boolean");
    expect(Array.isArray(graphData.nodes)).toBe(true);
    expect(Array.isArray(graphData.links)).toBe(true);
  });
});
