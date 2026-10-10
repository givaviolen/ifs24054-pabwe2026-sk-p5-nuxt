# Delcom Cash Flow — Nuxt (TypeScript)

Aplikasi pencatatan arus kas berbasis Nuxt 4 dan TypeScript yang menggunakan REST API Delcom untuk mengelola pemasukan (*inflow*) dan pengeluaran (*outflow*).

Proyek ini dibuat untuk memenuhi Studi Kasus 2 pada praktikum Praktik Framework JS: VueJS & Nuxt, PABWE 2026.

## Teknologi

- **Bun** — runtime dan package manager
- **Nuxt 4** — framework aplikasi
- **TypeScript** — bahasa pemrograman
- **Tailwind CSS v4** — styling antarmuka
- **Pinia** — state management
- **Vitest** — pengujian otomatis
- **SweetAlert2** — dialog notifikasi
- **Lucide Vue Next** — ikon antarmuka
- **Plus Jakarta Sans** — tipografi

## Fitur Aplikasi

- Dashboard ringkasan arus kas.
- Ringkasan pemasukan dan pengeluaran.
- Daftar transaksi arus kas dari REST API Delcom.
- Pemformatan nominal dalam mata uang Rupiah.
- Pengelolaan state menggunakan Pinia.
- Penanganan kesalahan ketika API gagal diakses.
- Halaman 404 untuk rute yang tidak ditemukan.

Fitur autentikasi, pengelolaan profil, CRUD transaksi lengkap, statistik, dan pengujian menyeluruh merupakan bagian pengembangan yang perlu diselesaikan sesuai modul.

## API

Aplikasi menggunakan Open API Delcom sebagai sumber data.

Dokumentasi: https://open-api.delcom.org/docs/1.0/api-cash-flows

Base URL default:

`https://open-api.delcom.org/api/v1`

## Persyaratan

Pastikan Bun dan Git sudah terpasang sebelum menjalankan proyek.

## Instalasi dan Menjalankan Aplikasi

1. Ekstrak proyek dan buka folder `ifs24054-pabwe2026-sk-p5-nuxt` di Visual Studio Code.
2. Buka terminal pada direktori proyek.
3. Instal dependensi:

   `bun install`

4. Salin `.env.example` menjadi `.env`.
5. Jalankan aplikasi:

   `bun run dev`

6. Buka alamat lokal yang ditampilkan di terminal.

## Konfigurasi Environment

Atur variabel berikut pada file `.env`:

```env
APP_PORT=3000
VITE_DELCOM_BASEURL=https://open-api.delcom.org/api/v1
```

Jangan mengunggah token autentikasi atau informasi rahasia ke repositori GitHub.

## Perintah Pengembangan

| Perintah | Keterangan |
|---|---|
| `bun run dev` | Menjalankan server pengembangan |
| `bun run build` | Membuat build produksi |
| `bun run preview` | Menjalankan hasil build |
| `bun run test` | Menjalankan pengujian |
| `bun run test:coverage` | Menjalankan pengujian beserta laporan coverage |

## Struktur Proyek

```text
ifs24054-pabwe2026-sk-p5-nuxt/
├── src/
│   ├── app.vue
│   ├── index.css
│   ├── pages/
│   ├── helpers/
│   ├── hooks/
│   └── features/
│       └── cashflows/
├── nuxt.config.ts
├── vite.config.ts
├── start.mjs
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Pengujian

Pengujian dilakukan menggunakan Vitest dan jsdom. Target coverage yang ditetapkan dalam modul adalah 100%. Target tersebut harus dibuktikan dengan menjalankan pengujian dan memeriksa hasil laporan coverage.

## Identitas Proyek

- Nama repositori: `ifs24054-pabwe2026-sk-p5-nuxt`
- Framework: Nuxt 4
- Bahasa: TypeScript
- Mata kuliah: PABWE 2026
