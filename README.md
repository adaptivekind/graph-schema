# Graph Schema

TypeScript types and JSON schema for representing [graphs](https://en.wikipedia.org/wiki/Graph_theory) with nodes and links.

## Features

- **TypeScript-first**: Strongly typed interfaces for graph structures
- **JSON Schema**: Generated schema for validation
- **Flexible Metadata**: Support for custom data, weights, and metadata on nodes and links

## Installation

```bash
npm install
```

## Usage

### Basic Graph Structure

```typescript
import { Graph, Node, Link } from "./src/index";

const graph: Graph = {
  id: "my-graph",
  label: "Sample Graph",
  nodes: {
    user1: {
      label: "Alice",
      type: "person",
      meta: {
        department: "engineering",
      },
      weights: {
        influence: 0.8,
      },
    },
    user2: {
      label: "Bob",
      type: "person",
    },
  },
  links: [
    {
      id: "connection1",
      source: "user1",
      target: "user2",
      type: "friendship",
      weights: {
        strength: 0.9,
      },
      meta: {
        since: "2023-01-15",
      },
    },
  ],
};
```

### Node Interface

```typescript
interface Node {
  label?: string; // Display name
  type?: string; // Node category/type
  aliases?: Array<string>; // Alternative names
  value?: number; // Numeric value
  weights?: Record<string, number>; // Named weights
  meta?: Record<string, string>; // String metadata
}
```

### Link Interface

```typescript
interface Link {
  id?: string; // Optional identifier
  source: string; // Source node ID (required)
  target: string; // Target node ID (required)
  type?: string; // Link category/type
  label?: string; // Display label
  value?: number; // Numeric value
  weights?: Record<string, number>; // Named weights
  meta?: Record<string, string>; // String metadata
}
```

### Graph Interface

```typescript
interface Graph {
  id?: string; // Graph identifier
  label?: string; // Graph label
  nodes: Record<string, Node>; // Nodes keyed by ID
  links: Link[]; // Array of links
}
```

## JSON Schema

The project includes automatically generated JSON Schema for validation:

```bash
npm run generate-json-schema
```

This creates `graph.schema.json` which can be used with JSON Schema validators like AJV.

## Development

### Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Watch mode compilation
- `npm run clean` - Remove build artifacts
- `npm run lint` - Run ESLint and Prettier
- `npm run lint:fix` - Fix linting issues
- `npm run typecheck` - Type check without emitting files
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run generate-json-schema` - Generate JSON schema from types

### Testing

The project includes comprehensive tests that validate:

- TypeScript interface compatibility
- JSON schema validation with AJV
- Round-trip serialization
- Node and link structure validation
- Reference integrity (all links point to existing nodes)

## Design Decisions

### Node Storage as Map

Nodes are stored as `Record<string, Node>` rather than `Node[]` for several benefits:

- **No duplicate IDs** - object keys are naturally unique
- **No redundant ID storage** - the map key serves as the node ID

### Flexible Typing

Both nodes and links support:

- **Strong typing** for required fields
- **Optional metadata** through `meta` and `weights` properties
- **Custom types** via the `type` field
- **Extensible design** for domain-specific needs

## License

MIT
