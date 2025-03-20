import { describe, expect, test } from "vitest";
import dayjs from "dayjs";
import { getDateColor } from "../products/utils";

describe("getDateColor", () => {
    test("returns 'bg-transparent' when date is null", () => {
      expect(getDateColor(null)).toBe("bg-transparent");
    });
  
    test("returns 'bg-green-100' when expiration date is more than 2 weeks from today", () => {
      const futureDate = dayjs().add(3, "weeks").toDate();
      expect(getDateColor(futureDate)).toBe("bg-green-100");
    });
  
    test("returns 'bg-yellow-100' when expiration date is between 1 and 2 weeks", () => {
      const futureDate = dayjs().add(2, "weeks").toDate();
      expect(getDateColor(futureDate)).toBe("bg-yellow-100");
  
      const futureDate2 = dayjs().add(1, "weeks").toDate();
      expect(getDateColor(futureDate2)).toBe("bg-yellow-100");
    });
  
    test("returns 'bg-red-100' when expiration date is less than 1 week", () => {
      const futureDate = dayjs().add(6, "days").toDate();
      expect(getDateColor(futureDate)).toBe("bg-red-100");
  
      const pastDate = dayjs().subtract(1, "day").toDate();
      expect(getDateColor(pastDate)).toBe("bg-red-100");
    });
  });