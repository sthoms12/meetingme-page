import { describe, expect, test } from "bun:test";
import {
  buildManagementUrl,
  readManagementToken,
  stripManagementToken,
} from "../src/lib/management-link";

describe("management links", () => {
  test("builds new links with an encoded fragment token", () => {
    expect(buildManagementUrl("https://b4wemeet.app/", "jane-doe", "secret/value"))
      .toBe("https://b4wemeet.app/jane-doe/edit#token=secret%2Fvalue");
  });

  test("reads fragment tokens before legacy query tokens", () => {
    expect(readManagementToken(new URL("https://b4wemeet.app/jane/edit?token=legacy#token=current")))
      .toBe("current");
  });

  test("continues to read existing query-token links", () => {
    expect(readManagementToken(new URL("https://b4wemeet.app/jane/edit?token=legacy")))
      .toBe("legacy");
  });

  test("removes token values while preserving unrelated URL state", () => {
    const url = new URL("https://b4wemeet.app/jane/edit?tab=access&token=legacy#token=current&panel=keys");
    expect(stripManagementToken(url)).toBe("/jane/edit?tab=access#panel=keys");
  });
});
