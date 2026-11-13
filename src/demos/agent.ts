import { createAgent } from "@ui-sdk/react/agent";

// One bridge for the demos on the page. It finds the ui-sdk components already
// rendered and registers new ones as they mount, so the playground's inspector
// and the "simulate an agent" button read and drive the same live components.
export const agent = createAgent();