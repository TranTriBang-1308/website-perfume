import { formatVND, slugify, generateOrderNumber } from "@/lib/utils";

describe("formatVND", () => {
  it("formats a number to VND currency string", () => {
    expect(formatVND(1000000)).toMatch(/1\.000\.000/);
    expect(formatVND(0)).toMatch(/0/);
  });

  it("accepts a string input", () => {
    expect(formatVND("500000")).toMatch(/500\.000/);
  });
});

describe("slugify", () => {
  it("converts Vietnamese text to slug", () => {
    expect(slugify("Nước hoa cao cấp")).toBe("nuoc-hoa-cao-cap");
    expect(slugify("Chanel No. 5")).toBe("chanel-no-5");
  });

  it("removes special characters", () => {
    expect(slugify("hello world!")).toBe("hello-world");
  });

  it("lowercases the result", () => {
    expect(slugify("GUCCI")).toBe("gucci");
  });

  it("handles đ character", () => {
    expect(slugify("đẹp")).toBe("dep");
  });
});

describe("generateOrderNumber", () => {
  it("generates a string starting with PF-", () => {
    const num = generateOrderNumber();
    expect(num).toMatch(/^PF-/);
  });

  it("generates unique order numbers", () => {
    const nums = new Set(Array.from({ length: 50 }, () => generateOrderNumber()));
    expect(nums.size).toBe(50);
  });
});
