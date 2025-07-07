import { toFakeName } from "./fake";
import { Graph } from ".";

interface ChainedGraphBuilder {
  build: () => Graph;
  id: (name: string) => NodeBuilder;
  and: () => GraphBuilder;
}

class NodeBuilder implements ChainedGraphBuilder {
  private graphBuilder;
  private nodeId;

  constructor(graphBuilder: GraphBuilder, nodeId: string) {
    this.graphBuilder = graphBuilder;
    this.nodeId = nodeId;
  }

  link(nodeId: string) {
    this.graphBuilder.link(this.nodeId, nodeId);
    return this;
  }

  to(...names: string[]) {
    for (const name of names) {
      this.link(name);
    }
    return this;
  }

  and() {
    return this.graphBuilder;
  }

  build() {
    return this.graphBuilder.build();
  }

  id(id: string) {
    return this.graphBuilder.id(id);
  }
}

class GraphBuilder implements ChainedGraphBuilder {
  private graph: Graph = {
    nodes: {},
    links: [],
  };

  id(id: string) {
    const node = {
      label: id,
    };
    this.graph.nodes[id] = node;
    return new NodeBuilder(this, id);
  }

  link(source: string, target: string): GraphBuilder {
    this.graph.links.push({ source, target });
    return this;
  }

  deep(base: string, count: number) {
    for (let i = 0; i < count; i++) {
      this.id(`${base}-${i}`).to(`${base}-${i + 1}`);
    }
    return this;
  }

  // Generate many things in a deterministic way. The same inputs will
  // consistently give the same set of things.
  many(
    count: number,
    options: { linkCount?: number; linkCluster?: number } = {},
  ) {
    const { linkCluster, linkCount } = {
      ...{ linkCount: 5, linkCluster: 0.75 },
      ...options,
    };
    const lookup: string[] = [];
    for (let i = 0; i < count; i++) {
      const name = toFakeName(i);
      lookup.push(name);
    }

    // Generate links between things
    for (let i = 0; i < count; i++) {
      const metaBuilder = this.id(lookup[i]);
      let distance = 1;
      let trigger = linkCluster;
      let direction = 1;
      for (let j = 0; j < linkCount; j++) {
        // Aim for the given the number of links. Clustered around the given
        // thing
        let relation = i + distance * direction;
        while (trigger < 1 && relation > -1 && relation < count) {
          trigger += linkCluster;
          distance += 1;
          direction *= -1;
          relation = i + distance * direction;
        }
        trigger -= 1;
        if (relation > -1 && relation < count) {
          metaBuilder.to(lookup[relation]);
        }
      }
    }

    return this;
  }

  and() {
    return this;
  }

  build() {
    return this.graph;
  }
}

export const builder = () => new GraphBuilder();
