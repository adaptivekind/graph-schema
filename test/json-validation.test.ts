import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Graph } from '../src/index';

describe('JSON Import/Export Validation', () => {
  const sampleGraphPath = join(__dirname, 'sample-graph.json');
  const outputGraphPath = join(__dirname, 'output-graph.json');

  afterEach(() => {
    try {
      require('fs').unlinkSync(outputGraphPath);
    } catch (error) {
      // File doesn't exist, ignore
    }
  });

  test('should import JSON file and validate against Graph type', () => {
    const jsonData = readFileSync(sampleGraphPath, 'utf-8');
    const graphData = JSON.parse(jsonData);

    expect(graphData).toHaveProperty('id');
    expect(graphData).toHaveProperty('label');
    expect(graphData).toHaveProperty('nodes');
    expect(graphData).toHaveProperty('links');
    expect(graphData).toHaveProperty('directed');
    expect(graphData).toHaveProperty('metadata');

    expect(Array.isArray(graphData.nodes)).toBe(true);
    expect(Array.isArray(graphData.links)).toBe(true);
    expect(graphData.nodes.length).toBe(3);
    expect(graphData.links.length).toBe(3);
  });

  test('should validate node structure', () => {
    const jsonData = readFileSync(sampleGraphPath, 'utf-8');
    const graphData = JSON.parse(jsonData);

    graphData.nodes.forEach((node: any) => {
      expect(node).toHaveProperty('id');
      expect(typeof node.id).toBe('string');
      
      if (node.label) {
        expect(typeof node.label).toBe('string');
      }
      
      if (node.data) {
        expect(typeof node.data).toBe('object');
      }
      
      if (node.position) {
        expect(node.position).toHaveProperty('x');
        expect(node.position).toHaveProperty('y');
        expect(typeof node.position.x).toBe('number');
        expect(typeof node.position.y).toBe('number');
      }
    });
  });

  test('should validate link structure', () => {
    const jsonData = readFileSync(sampleGraphPath, 'utf-8');
    const graphData = JSON.parse(jsonData);

    graphData.links.forEach((link: any) => {
      expect(link).toHaveProperty('id');
      expect(link).toHaveProperty('source');
      expect(link).toHaveProperty('target');
      expect(typeof link.id).toBe('string');
      expect(typeof link.source).toBe('string');
      expect(typeof link.target).toBe('string');
      
      if (link.weight !== undefined) {
        expect(typeof link.weight).toBe('number');
      }
      
      if (link.directed !== undefined) {
        expect(typeof link.directed).toBe('boolean');
      }
    });
  });

  test('should validate that all link references point to existing nodes', () => {
    const jsonData = readFileSync(sampleGraphPath, 'utf-8');
    const graphData = JSON.parse(jsonData);

    const nodeIds = new Set(graphData.nodes.map((node: any) => node.id));

    graphData.links.forEach((link: any) => {
      expect(nodeIds.has(link.source)).toBe(true);
      expect(nodeIds.has(link.target)).toBe(true);
    });
  });

  test('should type-check as Graph interface', () => {
    const jsonData = readFileSync(sampleGraphPath, 'utf-8');
    const graphData: Graph = JSON.parse(jsonData);

    expect(graphData.id).toBe('sample-graph');
    expect(graphData.label).toBe('Sample Social Network');
    expect(graphData.directed).toBe(false);
    expect(graphData.nodes.length).toBe(3);
    expect(graphData.links.length).toBe(3);
    expect(graphData.metadata?.name).toBe('Sample Network');
  });

  test('should export graph to JSON and re-import successfully', () => {
    const originalJsonData = readFileSync(sampleGraphPath, 'utf-8');
    const originalGraph: Graph = JSON.parse(originalJsonData);

    const exportedJson = JSON.stringify(originalGraph, null, 2);
    writeFileSync(outputGraphPath, exportedJson);

    const reimportedJsonData = readFileSync(outputGraphPath, 'utf-8');
    const reimportedGraph: Graph = JSON.parse(reimportedJsonData);

    expect(reimportedGraph).toEqual(originalGraph);
    expect(reimportedGraph.id).toBe(originalGraph.id);
    expect(reimportedGraph.nodes.length).toBe(originalGraph.nodes.length);
    expect(reimportedGraph.links.length).toBe(originalGraph.links.length);
  });

  test('should handle typed node and link data', () => {
    interface UserData {
      age: number;
      role: string;
    }

    interface RelationshipData {
      since: string;
    }

    const jsonData = readFileSync(sampleGraphPath, 'utf-8');
    const graphData: Graph<UserData, RelationshipData> = JSON.parse(jsonData);

    const aliceNode = graphData.nodes.find(n => n.id === 'alice');
    expect(aliceNode?.data?.age).toBe(30);
    expect(aliceNode?.data?.role).toBe('developer');

    const friendshipLink = graphData.links.find(l => l.id === 'link1');
    expect(friendshipLink?.data?.since).toBe('2020-01-15');
  });

  test('should validate graph metadata structure', () => {
    const jsonData = readFileSync(sampleGraphPath, 'utf-8');
    const graphData = JSON.parse(jsonData);

    expect(graphData.metadata).toHaveProperty('name');
    expect(graphData.metadata).toHaveProperty('description');
    expect(graphData.metadata).toHaveProperty('version');
    expect(graphData.metadata).toHaveProperty('createdAt');
    expect(graphData.metadata).toHaveProperty('author');
    
    expect(typeof graphData.metadata.name).toBe('string');
    expect(typeof graphData.metadata.description).toBe('string');
    expect(typeof graphData.metadata.version).toBe('string');
    expect(typeof graphData.metadata.createdAt).toBe('string');
    expect(typeof graphData.metadata.author).toBe('string');
  });
});