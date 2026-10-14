import { defineEventHandler, getRequestURL, getRouterParam, proxyRequest, setResponseHeader, setResponseStatus } from "h3";

// Proxy same-origin ke Delcom API agar browser tidak melakukan request lintas-origin.
export default defineEventHandler(async (event) => {
  const upstream = (process.env.VITE_DELCOM_BASEURL || "https://open-api.delcom.org/api/v1").replace(/\/+$/, "");
  const path = getRouterParam(event, "path") || "";
  const search = getRequestURL(event).search;

  try {
    const result = await proxyRequest(event, `${upstream}/${path}${search}`);
    // Jangan "no-store" agar halaman tetap eligible untuk back/forward cache.
    setResponseHeader(event, "cache-control", "private, no-cache");
    return result;
  } catch (error) {
    setResponseStatus(event, 502);
    return { status: "error", message: `Gagal menghubungi server Delcom: ${(error as Error).message}` };
  }
});