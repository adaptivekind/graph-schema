# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript library that provides type definitions for graph data structures. The repository exports TypeScript types for mathematical graphs including nodes, links/edges, and complete graph structures.

## Development Commands

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Watch mode compilation
- `npm run clean` - Remove build artifacts
- `npm run lint` - Run ESLint on source files
- `npm run typecheck` - Type check without emitting files
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm install` - Install dependencies

## Architecture

The project is organized with TypeScript source files in `src/`:

- `src/node.ts` - Node/vertex type definitions
- `src/link.ts` - Link/edge type definitions
- `src/graph.ts` - Main graph type definitions
- `src/index.ts` - Main export file

Key types exported:

- `GraphNode` - Individual graph nodes with optional data and metadata
- `GraphLink` - Connections between nodes with support for directed/undirected
- `Graph` - Complete graph structure containing nodes and links
- Various specialized types for directed/undirected graphs

## Build Output

Compiled JavaScript and type definitions are output to `dist/` directory. The package exports both CommonJS modules and TypeScript declarations.

## Testing

The project includes comprehensive tests for JSON import/export validation:

- `test/json-validation.test.ts` - Tests for validating JSON graph data against TypeScript types
- `test/sample-graph.json` - Sample graph data for testing
- Tests validate node structure, link structure, type safety, and round-trip JSON serialization

## Continuous Integration

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push and pull request:

- **Multi-Node Testing**: Tests on Node.js 18.x, 20.x, and 22.x
- **Quality Checks**: Type checking, linting, and testing
- **Build Validation**: Ensures project builds successfully
- **Publish Dry Run**: Validates package can be published (main branch only)

The CI pipeline runs: `typecheck` → `lint` → `test` → `build` → `publish dry-run`
