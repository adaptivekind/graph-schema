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
  // consistently give the same set of things for a given version
  // of this library..
  many(
    count: number,
    options: {
      desiredLinkCount?: number; // Number of links desired
      linkSpreading?: number; // Linear flattening out of the links to push links to later elements
      linkWeightingToFirstElement?: number; // Quadratic weighting of links to cluster around the first element
      scatter?: number; // Scatter points based on this weighting
    } = {},
  ) {
    const {
      linkWeightingToFirstElement,
      linkSpreading,
      desiredLinkCount,
      scatter,
    } = {
      ...{
        desiredLinkCount: count * 1.5,
        linkWeightingToFirstElement: 0.75,
        linkSpreading: 2,
        scatter: 1,
      },
      ...options,
    };
    const lookup: string[] = [];
    for (let i = 0; i < count; i++) {
      const name = toFakeName(i);
      this.id(name);
      lookup.push(name);
    }

    // The following algorithm is a deterministic distribution of
    // links which will give useful graphs for testing purposes.
    const scattering = [0.2, 0.1, 0, 0.5, 0.3, 0.8, 0, 0, 0.6, 0.9];
    var linksAdded = 0;
    var density = linkWeightingToFirstElement;
    var linksToAdd: number[] = [];
    outer: for (let i = 0; i < count; i++) {
      var needle = 0;
      for (let j = 0; j < count; j++) {
        const linkNumber = i * count + j;
        const scatterOffset = scatter * scattering[linkNumber % 10];
        needle += density + scatterOffset;
        // i!=j since we don't want to link to self
        if (i != j && needle > linkSpreading) {
          linksToAdd.push(linkNumber);
          linksAdded += 1;
          needle = 0;
          if (linksAdded >= desiredLinkCount) {
            break outer;
          }
        }
      }
      density *= linkWeightingToFirstElement;
    }

    linksToAdd.forEach((i: number) => {
      const metaBuilder = this.id(lookup[Math.floor(i / count)]);
      metaBuilder.to(lookup[i % count]);
    });

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
