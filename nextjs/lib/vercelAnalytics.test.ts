import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  getPropertyAnalytics,
  getPropertyAnalyticsByPath,
} from "./vercelAnalytics";
describe("getPropertyAnalytics", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubEnv("VERCEL_ANALYTICS_TOKEN", "test-token");
  });

  it("returns visitors and pageviews from Vercel Analytics", async () => {
    const fetchMock = vi.fn(
      async (url: string, options?: RequestInit) =>
        new Response(
          JSON.stringify({
            version: 1,
            data: {
              visitors: 12,
              pageviews: 27,
            },
          }),
          { status: 200 },
        ),
    );

    vi.stubGlobal("fetch", fetchMock);

    const result = await getPropertyAnalytics("/imoveis/imovel-exemplo");

    expect(result).toEqual({
      visitors: 12,
      pageviews: 27,
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, options] = fetchMock.mock.calls[0];
    const requestUrl = new URL(String(url));

    expect(requestUrl.pathname).toBe("/v1/query/web-analytics/visits/count");
    expect(requestUrl.searchParams.get("projectId")).toBe(
      "prj_9KWGrVUjEZLNdfz1vBUiiGYXdYvK",
    );
    expect(requestUrl.searchParams.get("teamId")).toBe(
      "team_COFWoYOIeVzQ8EdAE6c1H3iL",
    );
    expect(requestUrl.searchParams.get("filter")).toBe(
      "requestPath eq '/imoveis/imovel-exemplo'",
    );

    expect(options).toEqual({
      headers: {
        Authorization: "Bearer test-token",
      },
      cache: "no-store",
    });
  });

  it("returns zero when Vercel returns no metrics", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              version: 1,
              data: {},
            }),
            { status: 200 },
          ),
      ),
    );

    const result = await getPropertyAnalytics("/imoveis/imovel-sem-visitas");

    expect(result).toEqual({
      visitors: 0,
      pageviews: 0,
    });
  });

  it("throws when the analytics token is not configured", async () => {
    vi.stubEnv("VERCEL_ANALYTICS_TOKEN", "");

    await expect(
      getPropertyAnalytics("/imoveis/imovel-exemplo"),
    ).rejects.toThrow("VERCEL_ANALYTICS_TOKEN não configurado");
  });

  it("throws when Vercel Analytics returns an error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("Unauthorized", { status: 401 })),
    );

    await expect(
      getPropertyAnalytics("/imoveis/imovel-exemplo"),
    ).rejects.toThrow("Vercel Analytics API retornou HTTP 401");
  });
});
it("returns property analytics grouped by request path", async () => {
  const fetchMock = vi.fn(
    async (_url: string, _options?: RequestInit) =>
      new Response(
        JSON.stringify({
          version: 1,
          data: [
            {
              requestPath: "/imoveis/imovel-1",
              visitors: 10,
              pageviews: 20,
            },
            {
              requestPath: "/imoveis/imovel-2",
              visitors: 5,
              pageviews: 8,
            },
          ],
        }),
        { status: 200 },
      ),
  );

  vi.stubGlobal("fetch", fetchMock);

  const result = await getPropertyAnalyticsByPath(
    ["/imoveis/imovel-1", "/imoveis/imovel-2"],
    "2026-09-08T00:00:00.000Z",
    "2026-09-09T00:00:00.000Z",
  );

  expect(result).toEqual([
    {
      requestPath: "/imoveis/imovel-1",
      visitors: 10,
      pageviews: 20,
    },
    {
      requestPath: "/imoveis/imovel-2",
      visitors: 5,
      pageviews: 8,
    },
  ]);

  expect(fetchMock).toHaveBeenCalledTimes(1);

  const [url, options] = fetchMock.mock.calls[0];
  const requestUrl = new URL(String(url));

  expect(requestUrl.pathname).toBe("/v1/query/web-analytics/visits/aggregate");
  expect(requestUrl.searchParams.get("by")).toBe("requestPath");
  expect(requestUrl.searchParams.get("limit")).toBe("100");
  expect(options).toEqual({
    headers: {
      Authorization: "Bearer test-token",
    },
    cache: "no-store",
  });
});

it("splits property analytics requests into batches of 20 paths", async () => {
  vi.stubEnv("VERCEL_ANALYTICS_TOKEN", "test-token");

  const fetchMock = vi.fn(async (url: string) => {
    const requestUrl = new URL(url);
    const filter = requestUrl.searchParams.get("filter") ?? "";
    const paths = filter
      .split(" or ")
      .map((item) => item.replace(/^requestPath eq '/, "").replace(/'$/, ""));

    return new Response(
      JSON.stringify({
        version: 1,
        data: paths.map((requestPath) => ({
          requestPath,
          visitors: 1,
          pageviews: 2,
        })),
      }),
      { status: 200 },
    );
  });

  vi.stubGlobal("fetch", fetchMock);

  const requestPaths = Array.from(
    { length: 21 },
    (_, index) => `/imoveis/imovel-${index + 1}`,
  );

  const result = await getPropertyAnalyticsByPath(
    requestPaths,
    "2026-09-08T00:00:00.000Z",
    "2026-09-09T00:00:00.000Z",
  );

  expect(result).toHaveLength(21);
  expect(fetchMock).toHaveBeenCalledTimes(2);
});
