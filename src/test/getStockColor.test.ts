import { getStockColor } from "../products/utils";
import { describe, expect, test } from "vitest";


describe("getStockColor", () => {
  test("returns 'default' when stock is greater than 10", () => {
    expect(getStockColor(11)).toBe("default");
    expect(getStockColor(100)).toBe("default");
  });

  test("returns 'warning' when stock is between 5 and 10", () => {
    expect(getStockColor(5)).toBe("warning");
    expect(getStockColor(10)).toBe("warning");
  });

  test("returns 'danger' when stock is less than 5", () => {
    expect(getStockColor(4)).toBe("danger");
    expect(getStockColor(0)).toBe("danger");
  });
});