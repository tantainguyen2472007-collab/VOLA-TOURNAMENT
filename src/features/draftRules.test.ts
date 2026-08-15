import { strict as assert } from "node:assert";
import { getAlternatingTurnOrder, getAvailableAgents } from "./draftRules";
assert.deepEqual(getAlternatingTurnOrder(), ["team_a:0", "team_b:0", "team_a:1", "team_b:1", "team_a:2", "team_b:2", "team_a:3", "team_b:3", "team_a:4", "team_b:4"]);
assert.equal(getAvailableAgents("Any", ["jett", "omen"]).some((agent) => agent.id === "jett"), false);
assert.equal(getAvailableAgents("Any", ["jett", "omen"]).some((agent) => agent.id === "omen"), false);
console.log("draftRules self-check passed");
