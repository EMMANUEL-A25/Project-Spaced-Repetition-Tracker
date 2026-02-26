import {  calculateReviewDate, formatUserDate } from "./common.mjs";
import assert from "node:assert";
import test from "node:test";

test("calculateReviewDate adding 7 days to October 26th should cross into November", () => {
  const startDate = "2026-10-26"
  const monthsToAdd = 0;
  const daysToAdd = 7;
    const expectedDate = "2026-11-02";

    const actualDate = calculateReviewDate(startDate, monthsToAdd, daysToAdd);


  assert.strictEqual(actualDate, expectedDate, "Calculation: 7 days after Oct 26 should be Nov 2nd");
});


test("formatUserDate: Should correctly apply 'th to the 11th (ordinal exception)", () => {
  const dateString = "2026-10-11"
  const expectedFormat = "11th, October 2026";


    const actualFormat = formatUserDate(dateString);


  assert.strictEqual(actualFormat, expectedFormat, "Formatting: The 11th must use 'th' not 'st'");
});

