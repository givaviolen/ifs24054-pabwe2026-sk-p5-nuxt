import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";

(globalThis as any).DELCOM_BASEURL = "https://open-api.delcom.org/api/v1";
(globalThis as any).DELCOM_ORIGIN = "https://open-api.delcom.org";

window.scrollTo = vi.fn() as any;
URL.createObjectURL = vi.fn(() => "blob:mock");
URL.revokeObjectURL = vi.fn();

afterEach(() => {
  localStorage.clear();
  document.body.innerHTML = "";
});
