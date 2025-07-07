// Test that the built package works
import { builder } from "../../dist/index.js";
import { deepEqual } from "node:assert/strict";

const graph = builder().id("test").build();

deepEqual(graph, { nodes: { test: { label: "test" } }, links: [] });

console.log("OK:", graph);
