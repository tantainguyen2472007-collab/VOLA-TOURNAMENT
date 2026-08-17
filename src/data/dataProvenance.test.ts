import assert from "node:assert/strict";
import {
  LINEUP_SOURCE_STATE,
  findProUsersForGear,
  isValidSourceMetadata,
} from "./dataProvenance";

const source = {
  sourceName: "ProSettings" as const,
  sourceUrl: "https://prosettings.net/lists/valorant/",
  lastVerified: "2026-08-17",
};

assert.equal(isValidSourceMetadata(source), true);
assert.equal(isValidSourceMetadata({ ...source, sourceUrl: "http://example.com" }), false);
assert.deepEqual(findProUsersForGear("Razer Viper V3 Pro", []), []);
assert.equal(LINEUP_SOURCE_STATE.availability, "blocked_by_robots");
assert.equal(LINEUP_SOURCE_STATE.source.sourceUrl, "https://lineupsvalorant.com/");

console.log("data provenance checks passed");