
// Memuat SweetAlert2 secara lazy untuk mengurangi JavaScript awal.
const loadSwal = async () => (await import("sweetalert2")).default;

// Variabel ini didefinisikan melalui vite.define di nuxt.config.ts.
declare const DELCOM_BASEURL: string;

// Menampilkan dialog sukses.
export const showSuccessDialog = async (
  text: string,
  title = "Berhasil"
) =>
  (await loadSwal()).fire({
    icon: "success",
    title,
    text,
    timer: 1500,
    showConfirmButton: false
  });

// Menampilkan dialog error.
export const showErrorDialog = async (
  text: string,
  title = "Gagal"
) =>
  (await loadSwal()).fire({
    icon: "error",
    title,
    text
  });

// Menampilkan dialog konfirmasi.
export const showConfirmDialog = async (
  text: string,
  title = "Apakah kamu yakin?"
): Promise<boolean> => {
  const Swal = await loadSwal();

  const result = await Swal.fire({
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Batal",
    confirmButtonColor: "#047857"
  });

  return result.isConfirmed;
};

// Mengubah angka menjadi format Rupiah.
export const formatRupiah = (
  value: number | string
): string =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(Number(value) || 0);

// Memformat tanggal.
export const formatDate = (
  value?: string | null
): string => {
  if (!value) return "-";

  const date = new Date(
    String(value).includes("T")
      ? value
      : String(value).replace(" ", "T")
  );

  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
};

// Menghasilkan URL foto.
export const photoUrl = (
  photo?: string | null
): string => {
  if (!photo) return "";

  // URL lengkap tidak perlu diubah.
  if (/^https?:\/\//i.test(photo)) {
    return photo;
  }

  // Gunakan origin API yang telah dikonfigurasi di Nuxt.
  const apiOrigin = new URL(DELCOM_BASEURL).origin;
  const photoPath = photo.replace(/^\/+/, "");

  return `${apiOrigin}/${photoPath}`;
};
