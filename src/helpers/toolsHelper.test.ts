import { describe, it, expect, vi, beforeEach } from "vitest";
import Swal from "sweetalert2";
import * as t from "./toolsHelper";

vi.mock("sweetalert2", () => ({ default: { fire: vi.fn() } }));

const fire = Swal.fire as unknown as ReturnType<typeof vi.fn>;

describe("toolsHelper", () => {
  beforeEach(() => vi.clearAllMocks());

  it("dialog success & error memanggil Swal dengan judul default dan kustom", async () => {
    await t.showSuccessDialog("ok");
    expect(fire).toHaveBeenLastCalledWith(expect.objectContaining({ icon: "success", title: "Berhasil", text: "ok" }));
    await t.showSuccessDialog("ok", "Judul");
    expect(fire).toHaveBeenLastCalledWith(expect.objectContaining({ title: "Judul" }));
    await t.showErrorDialog("bad");
    expect(fire).toHaveBeenLastCalledWith({ icon: "error", title: "Gagal", text: "bad" });
    await t.showErrorDialog("bad", "Oops");
    expect(fire).toHaveBeenLastCalledWith({ icon: "error", title: "Oops", text: "bad" });
    expect(fire).toHaveBeenCalledTimes(4);
  });

  it("showConfirmDialog mengembalikan isConfirmed", async () => {
    fire.mockResolvedValueOnce({ isConfirmed: true });
    expect(await t.showConfirmDialog("x")).toBe(true);
    expect(fire).toHaveBeenLastCalledWith(expect.objectContaining({ title: "Apakah kamu yakin?", showCancelButton: true }));
    fire.mockResolvedValueOnce({ isConfirmed: false });
    expect(await t.showConfirmDialog("x", "Judul")).toBe(false);
    expect(fire).toHaveBeenLastCalledWith(expect.objectContaining({ title: "Judul" }));
  });

  it("formatRupiah", () => {
    expect(t.formatRupiah(10000)).toContain("10.000");
    expect(t.formatRupiah("2500")).toContain("2.500");
    expect(t.formatRupiah("abc")).toContain("0");
  });

  it("formatDate", () => {
    expect(t.formatDate()).toBe("-");
    expect(t.formatDate(null)).toBe("-");
    expect(t.formatDate("")).toBe("-");
    expect(t.formatDate("bukan-tanggal")).toBe("-");
    expect(t.formatDate("2026-12-31 23:59:00")).toContain("2026");
    expect(t.formatDate("2026-06-15T12:00:00Z")).toContain("2026");
  });

  it("photoUrl", () => {
    expect(t.photoUrl()).toBe("");
    expect(t.photoUrl(null)).toBe("");
    expect(t.photoUrl("")).toBe("");
    expect(t.photoUrl("http://x/y.png")).toBe("http://x/y.png");
    expect(t.photoUrl("HTTPS://x/y.png")).toBe("HTTPS://x/y.png");
    expect(t.photoUrl("/img/a.png")).toBe("https://open-api.delcom.org/img/a.png");
    expect(t.photoUrl("//img/b.png")).toBe("https://open-api.delcom.org/img/b.png");
    expect(t.photoUrl("c.png")).toBe("https://open-api.delcom.org/c.png");
  });
});