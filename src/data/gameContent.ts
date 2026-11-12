import { LevelId, QuizQuestion } from '../types/game';

export interface LevelInfo {
  id: LevelId;
  title: string;
  subtitle: string;
  theme: string;
  locationName: string;
  objective: string;
  learnPoints: {
    title: string;
    description: string;
    example?: string;
    steps?: string[];
    tag?: string;
  }[];
  questions: QuizQuestion[];
}

export const GAME_LEVELS: Record<LevelId, LevelInfo> = {
  1: {
    id: 1,
    title: 'Laboratorium Copy Paste',
    subtitle: 'Misi 1: Menguasai Pemindahan Objek Digital',
    theme: 'Laboratorium Teknologi Digital',
    locationName: 'Laboratorium Copy Paste',
    objective: 'Memahami perbedaan fungsi Copy, Cut, dan Paste serta penggunaannya dalam memindahkan objek antardokumen.',
    learnPoints: [
      {
        title: 'COPY (Menyalin)',
        description: 'Digunakan untuk menduplikasi atau menyalin objek tanpa menghilangkan objek aslinya dari lokasi awal.',
        tag: 'Shortcut: Ctrl + C',
        example: 'Teks atau tabel di file Excel tetap ada, namun salinannya dapat ditaruh di tempat lain.',
      },
      {
        title: 'CUT (Memotong / Memindahkan)',
        description: 'Digunakan untuk memotong atau memindahkan objek langsung dari lokasi asal ke papan klip (clipboard). Objek di lokasi asal akan terhapus.',
        tag: 'Shortcut: Ctrl + X',
        example: 'Memindahkan kalimat dari paragraf 2 ke paragraf 1 secara utuh.',
      },
      {
        title: 'PASTE (Menempelkan)',
        description: 'Digunakan untuk menempelkan objek yang sebelumnya telah disalin (Copy) atau dipotong (Cut) ke dokumen target.',
        tag: 'Shortcut: Ctrl + V',
        example: 'Menampilkan kembali tabel atau teks yang tersimpan di clipboard.',
      },
      {
        title: 'Studi Kasus: Memindahkan Tabel Excel ke Word',
        description: 'Langkah praktis memindahkan data spreadsheet ke dalam laporan pengolah kata:',
        steps: [
          'Buka aplikasi spreadsheet (Microsoft Excel).',
          'Pilih / blok rentang sel tabel yang dibutuhkan.',
          'Klik perintah Copy (atau tekan Ctrl + C).',
          'Buka dokumen laporan di Microsoft Word.',
          'Pilih posisi kursor lalu klik perintah Paste (atau Ctrl + V).',
        ],
      },
    ],
    questions: [
      {
        id: 101,
        question: 'Apa fungsi dari perintah Copy dalam pengolahan dokumen?',
        options: [
          { key: 'A', text: 'Menghapus objek secara permanen' },
          { key: 'B', text: 'Menyalin objek tanpa menghilangkan aslinya' },
          { key: 'C', text: 'Mengganti nama file dokumen' },
          { key: 'D', text: 'Menutup aplikasi yang sedang aktif' },
        ],
        correctAnswer: 'B',
        explanation: 'Fungsi Copy adalah menduplikasi / menyalin objek, sehingga objek aslinya tetap aman tersimpan di tempat semula.',
      },
      {
        id: 102,
        question: 'Jika ingin memindahkan teks dan menghilangkannya dari tempat asal, gunakan perintah...',
        options: [
          { key: 'A', text: 'Copy' },
          { key: 'B', text: 'Paste' },
          { key: 'C', text: 'Cut' },
          { key: 'D', text: 'Save' },
        ],
        correctAnswer: 'C',
        explanation: 'Cut digunakan untuk memotong objek dari tempat asal, sehingga objek di posisi semula akan berpindah/hilang.',
      },
      {
        id: 103,
        question: 'Fungsi dari perintah Paste adalah...',
        options: [
          { key: 'A', text: 'Menempelkan objek yang sudah disalin atau dipotong' },
          { key: 'B', text: 'Menghapus objek yang salah ketik' },
          { key: 'C', text: 'Membuka lembar kerja baru' },
          { key: 'D', text: 'Mengubah ukuran dan jenis huruf' },
        ],
        correctAnswer: 'A',
        explanation: 'Paste bertugas meletakkan / menempelkan objek dari Clipboard ke posisi kursor yang kita tuju.',
      },
      {
        id: 104,
        question: 'Tabel dari Microsoft Excel ingin dipindahkan ke Microsoft Word. Langkah yang benar adalah...',
        options: [
          { key: 'A', text: 'Save lalu Close' },
          { key: 'B', text: 'Copy lalu Paste' },
          { key: 'C', text: 'Delete lalu Save' },
          { key: 'D', text: 'Print lalu Paste' },
        ],
        correctAnswer: 'B',
        explanation: 'Alur perpindahan objek antardokumen adalah menyalinnya di aplikasi sumber (Copy) lalu menempelkannya di aplikasi tujuan (Paste).',
      },
      {
        id: 105,
        question: 'Apa yang terjadi pada objek asli jika kita menggunakan perintah Copy?',
        options: [
          { key: 'A', text: 'Objek asli tetap ada di tempat semula' },
          { key: 'B', text: 'Objek asli otomatis terhapus' },
          { key: 'C', text: 'File dokumen otomatis tertutup' },
          { key: 'D', text: 'Aplikasi mengalami error dan berhenti' },
        ],
        correctAnswer: 'A',
        explanation: 'Perintah Copy mempertahankan objek aslinya, berbeda dengan Cut yang menghapus/memotong objek dari sumber aslinya.',
      },
    ],
  },
  2: {
    id: 2,
    title: 'Kota Screenshot',
    subtitle: 'Misi 2: Menangkap dan Memotong Tampilan Layar',
    theme: 'Kota Digital Berlayar Monitor',
    locationName: 'Kota Screenshot',
    objective: 'Memahami cara menangkap tampilan layar menggunakan tombol PrtSc, Snipping Tool, shortcut Windows, serta teknik Crop gambar.',
    learnPoints: [
      {
        title: 'SCREENSHOT (Tangkapan Layar)',
        description: 'Screenshot adalah proses merekam atau mengambil gambar diam dari apa yang sedang tampil di layar monitor komputer atau ponsel pintar.',
      },
      {
        title: 'Tombol PrtSc (Print Screen)',
        description: 'Tombol khusus pada keyboard komputer untuk menangkap seluruh tampilan layar ke dalam memori clipboard seketika.',
        tag: 'Keyboard Key',
      },
      {
        title: 'SNIPPING TOOL',
        description: 'Aplikasi bawaan sistem operasi Windows yang memungkinkan kita mengambil sebagian area layar tertentu dalam bentuk kotak persegi panjang, jendela, atau bentuk bebas.',
      },
      {
        title: 'Shortcut Cepat: Windows + Shift + S',
        description: 'Kombinasi tombol keyboard ajaib untuk langsung mengaktifkan mode penangkap layar fleksibel tanpa perlu membuka menu aplikasi secara manual.',
        tag: 'Shortcut Utama',
      },
      {
        title: 'Fungsi CROP (Memotong Gambar)',
        description: 'Fitur pengedit gambar di Word atau pengolah grafis untuk memangkas bagian tepi gambar yang tidak diinginkan agar fokus pada informasi penting.',
      },
    ],
    questions: [
      {
        id: 201,
        question: 'Apa fungsi utama dari tombol PrtSc (Print Screen) pada keyboard?',
        options: [
          { key: 'A', text: 'Mengambil gambar seluruh tampilan layar' },
          { key: 'B', text: 'Menghapus dokumen yang terbuka' },
          { key: 'C', text: 'Membuat tabel otomatis' },
          { key: 'D', text: 'Mengubah format font huruf' },
        ],
        correctAnswer: 'A',
        explanation: 'PrtSc (Print Screen) mengambil salinan gambar dari apa yang tampak di seluruh layar monitor Anda.',
      },
      {
        id: 202,
        question: 'Shortcut keyboard cepat untuk membuka fitur tangkapan layar (Snipping Tool) di Windows adalah...',
        options: [
          { key: 'A', text: 'Ctrl + C' },
          { key: 'B', text: 'Ctrl + V' },
          { key: 'C', text: 'Windows + Shift + S' },
          { key: 'D', text: 'Alt + F4' },
        ],
        correctAnswer: 'C',
        explanation: 'Kombinasi Windows + Shift + S merupakan shortcut resmi Windows Snipping Tool untuk memilih area tangkapan layar.',
      },
      {
        id: 203,
        question: 'Jika kamu hanya ingin mengambil sebagian area layar tertentu saja sesuai kebutuhan, gunakan aplikasi...',
        options: [
          { key: 'A', text: 'Save' },
          { key: 'B', text: 'Snipping Tool' },
          { key: 'C', text: 'Print' },
          { key: 'D', text: 'Rename' },
        ],
        correctAnswer: 'B',
        explanation: 'Snipping Tool memungkinkan pemilihan area spesifik, baik kotak, jendela aktif, maupun seleksi bebas.',
      },
      {
        id: 204,
        question: 'Apa kegunaan dari fitur Crop pada pengolahan gambar dokumen?',
        options: [
          { key: 'A', text: 'Memotong bagian tepi gambar yang tidak diperlukan' },
          { key: 'B', text: 'Menyalin tulisan paragraf' },
          { key: 'C', text: 'Menghapus seluruh halaman dokumen' },
          { key: 'D', text: 'Membuat baris paragraf baru' },
        ],
        correctAnswer: 'A',
        explanation: 'Crop digunakan untuk memangkas tepi gambar sehingga bagian penting yang relevan terlihat jelas dan rapi.',
      },
      {
        id: 205,
        question: 'Hasil tangkapan layar yang ada di clipboard dapat langsung ditempelkan ke Microsoft Word menggunakan tombol...',
        options: [
          { key: 'A', text: 'Ctrl + X' },
          { key: 'B', text: 'Ctrl + S' },
          { key: 'C', text: 'Ctrl + V' },
          { key: 'D', text: 'Ctrl + Z' },
        ],
        correctAnswer: 'C',
        explanation: 'Ctrl + V adalah pintasan keyboard untuk Paste (menempelkan) gambar hasil screenshot yang berada di clipboard.',
      },
    ],
  },
  3: {
    id: 3,
    title: 'Markas Detektif Objek',
    subtitle: 'Misi 3: Mengenal Anatomi dan Hierarki Objek Dokumen',
    theme: 'Ruang Arsip Dokumen Digital',
    locationName: 'Markas Detektif Objek',
    objective: 'Mengidentifikasi objek-objek penyusun aplikasi pengolah kata serta memahami susunan hierarkinya dari unit terkecil hingga terbesar.',
    learnPoints: [
      {
        title: 'FILE (Dokumen Keseluruhan)',
        description: 'Unit data terbesar yang mencakup seluruh isi lembar kerja, halaman, teks, dan format yang disimpan dengan ekstensi (misal: .docx).',
      },
      {
        title: 'PAGE (Halaman)',
        description: 'Satu lembar kerja fisik atau virtual tempat teks dan elemen grafis diletakkan dalam dokumen.',
      },
      {
        title: 'HEADER & FOOTER',
        description: 'Header berada di area margin atas halaman (biasanya untuk judul bab atau tanggal), sedangkan Footer berada di margin bawah halaman (biasanya untuk nomor halaman).',
      },
      {
        title: 'PARAGRAPH (Paragraf)',
        description: 'Kumpulan satu atau lebih baris tulisan yang diakhiri dengan penekanan tombol Enter pada keyboard.',
      },
      {
        title: 'LINE (Baris)',
        description: 'Satu lajur mendatar tulisan dalam satu batas margin kiri ke kanan.',
      },
      {
        title: 'WORD (Kata)',
        description: 'Rangkaian karakter yang membentuk satu kesatuan makna dan dipisahkan oleh tanda spasi.',
      },
      {
        title: 'CHARACTER (Karakter)',
        description: 'Unit penyusun terkecil berupa huruf tunggal (A-Z), angka (0-9), spasi, atau simbol tanda baca.',
      },
      {
        title: 'OBJEK SISIPAN: TABLE & SHAPE',
        description: 'Table tersusun atas baris (rows) dan kolom (columns) yang membentuk sel data. Shape adalah bangun geometris seperti kotak, lingkaran, panah, atau bintang.',
      },
    ],
    questions: [
      {
        id: 301,
        question: 'Keseluruhan isi dokumen pengolah kata yang tersimpan sebagai satu file data disebut...',
        options: [
          { key: 'A', text: 'File' },
          { key: 'B', text: 'Line' },
          { key: 'C', text: 'Word' },
          { key: 'D', text: 'Character' },
        ],
        correctAnswer: 'A',
        explanation: 'File adalah keseluruhan berkas dokumen yang memuat seluruh halaman, paragraf, dan isi lembar kerja.',
      },
      {
        id: 302,
        question: 'Bagian khusus yang terletak di area batas atas setiap halaman dokumen disebut...',
        options: [
          { key: 'A', text: 'Footer' },
          { key: 'B', text: 'Header' },
          { key: 'C', text: 'Paragraph' },
          { key: 'D', text: 'Table' },
        ],
        correctAnswer: 'B',
        explanation: 'Header adalah area paling atas pada halaman dokumen, sedangkan Footer berada di batas paling bawah.',
      },
      {
        id: 303,
        question: 'Kumpulan beberapa baris tulisan yang diakhiri dengan menekan tombol Enter disebut...',
        options: [
          { key: 'A', text: 'Word' },
          { key: 'B', text: 'Paragraph' },
          { key: 'C', text: 'Character' },
          { key: 'D', text: 'Shape' },
        ],
        correctAnswer: 'B',
        explanation: 'Dalam pengolah kata, sebuah paragraf dihitung sejak penulisan awal hingga pengguna menekan tombol Enter.',
      },
      {
        id: 304,
        question: 'Susunan kisi-kisi yang terdiri dari baris (rows) dan kolom (columns) membentuk sel disebut...',
        options: [
          { key: 'A', text: 'Shape' },
          { key: 'B', text: 'Table' },
          { key: 'C', text: 'Line' },
          { key: 'D', text: 'Header' },
        ],
        correctAnswer: 'B',
        explanation: 'Table (tabel) adalah objek dokumen yang terdiri atas pertemuan baris dan kolom untuk menyajikan data terstruktur.',
      },
      {
        id: 305,
        question: 'Bentuk geometris seperti lingkaran, persegi, segitiga, dan anak panah termasuk dalam kategori...',
        options: [
          { key: 'A', text: 'Paragraph' },
          { key: 'B', text: 'Footer' },
          { key: 'C', text: 'Shape' },
          { key: 'D', text: 'File' },
        ],
        correctAnswer: 'C',
        explanation: 'Shape mencakup beragam gambar bentuk vektor dasar dua dimensi yang dapat dimasukkan ke dalam dokumen.',
      },
    ],
  },
  4: {
    id: 4,
    title: 'Pusat Kendali Menu Home',
    subtitle: 'Misi 4: Menguasai Pita Perintah Pengolah Kata',
    theme: 'Ruang Kendali Aplikasi Perkantoran',
    locationName: 'Pusat Kendali Menu Home',
    objective: 'Mengenal fungsi kelompok perintah pada Menu Home: Clipboard, Font, Paragraph, dan Styles untuk mengatur format tampilan dokumen.',
    learnPoints: [
      {
        title: 'Kelompok CLIPBOARD',
        description: 'Tempat berkumpulnya tombol perintah potong (Cut), salin (Copy), tempel (Paste), serta Format Painter untuk menyalin format gaya tulisan.',
      },
      {
        title: 'Kelompok FONT',
        description: 'Pusat pengaturan tampilan karakter: memilih jenis font (misal Calibri, Arial), ukuran huruf, warna font, warna highlight, serta gaya cetak tebal (Bold), miring (Italic), dan garis bawah (Underline).',
      },
      {
        title: 'Kelompok PARAGRAPH',
        description: 'Mengatur struktur paragraf: perataan teks (Align Left, Center, Align Right, Justify), penomoran (Numbering & Bullets), jarak spasi baris, dan warna latar baris.',
      },
      {
        title: 'Kelompok STYLES',
        description: 'Kumpulan templat gaya cepat otomatis untuk judul utama (Heading 1), sub-judul (Heading 2), dan teks baku (Normal) yang mempermudah pembuatan daftar isi.',
      },
    ],
    questions: [
      {
        id: 401,
        question: 'Kelompok perintah yang digunakan untuk mengatur jenis, ukuran, dan warna huruf adalah...',
        options: [
          { key: 'A', text: 'Clipboard' },
          { key: 'B', text: 'Font' },
          { key: 'C', text: 'Paragraph' },
          { key: 'D', text: 'Styles' },
        ],
        correctAnswer: 'B',
        explanation: 'Kelompok Font bertanggung jawab atas seluruh tipografi huruf, meliputi jenis, ukuran, warna, dan hiasan huruf.',
      },
      {
        id: 402,
        question: 'Mengatur perataan teks seperti rata kiri, rata tengah, dan rata kanan berada pada kelompok...',
        options: [
          { key: 'A', text: 'Paragraph' },
          { key: 'B', text: 'Font' },
          { key: 'C', text: 'Clipboard' },
          { key: 'D', text: 'Styles' },
        ],
        correctAnswer: 'A',
        explanation: 'Pengaturan alignment (kiri, tengah, kanan, rata kiri-kanan/justify) berada di dalam kelompok Paragraph.',
      },
      {
        id: 403,
        question: 'Fitur Copy, Cut, dan Paste dalam pita menu Home terhimpun di dalam kelompok...',
        options: [
          { key: 'A', text: 'Clipboard' },
          { key: 'B', text: 'Styles' },
          { key: 'C', text: 'Paragraph' },
          { key: 'D', text: 'Font' },
        ],
        correctAnswer: 'A',
        explanation: 'Clipboard adalah kelompok pertama di menu Home yang menampung tombol Copy, Cut, Paste, dan Format Painter.',
      },
      {
        id: 404,
        question: 'Untuk mengatur format judul bab secara terstruktur seperti Heading 1 dan Heading 2, kita menggunakan...',
        options: [
          { key: 'A', text: 'Font' },
          { key: 'B', text: 'Styles' },
          { key: 'C', text: 'Clipboard' },
          { key: 'D', text: 'Paragraph' },
        ],
        correctAnswer: 'B',
        explanation: 'Kelompok Styles menyediakan preset Heading 1, 2, 3 dan Normal untuk struktur dokumen yang rapi.',
      },
      {
        id: 405,
        question: 'Ikon huruf "B" tebal (Bold) pada kelompok Font berfungsi untuk...',
        options: [
          { key: 'A', text: 'Menebalkan teks tulisan' },
          { key: 'B', text: 'Memiringkan teks tulisan' },
          { key: 'C', text: 'Memberi garis bawah teks' },
          { key: 'D', text: 'Menghapus teks' },
        ],
        correctAnswer: 'A',
        explanation: 'Fitur Bold (ikon B atau Ctrl + B) digunakan untuk memberi efek cetak tebal pada huruf yang dipilih.',
      },
    ],
  },
  5: {
    id: 5,
    title: 'Kastil Final Boss',
    subtitle: 'Misi Pamungkas: Pertarungan Ujian Akhir Detektif Digital',
    theme: 'Kastil Cyber Digital Academy',
    locationName: 'Kastil Final Boss',
    objective: 'Taklukkan Robot Penjaga Raksasa Cyber Boss dengan menjawab 10 soal tantangan komprehensif dalam batas waktu!',
    learnPoints: [
      {
        title: 'Ringkasan Misi Detektif',
        description: 'Kamu telah menempuh Laboratorium Copy Paste, Kota Screenshot, Markas Detektif Objek, dan Pusat Kendali Menu Home. Sekarang saatnya membuktikan kepakaranmu!',
      },
      {
        title: 'Aturan Pertarungan Boss',
        description: 'Robot Penjaga memiliki perisai energi 100%. Setiap jawaban yang benar akan melontarkan gelombang energi dan mengurangi 10% daya Boss. Perhatikan batas waktu 20 detik untuk setiap pertanyaan!',
      },
    ],
    questions: [
      {
        id: 501,
        question: 'Fitur yang digunakan untuk menyalin objek tanpa menghilangkan objek asli adalah...',
        options: [
          { key: 'A', text: 'Cut' },
          { key: 'B', text: 'Copy' },
          { key: 'C', text: 'Delete' },
          { key: 'D', text: 'Undo' },
        ],
        correctAnswer: 'B',
        explanation: 'Copy menyalin objek dengan mempertahankan keberadaan objek aslinya.',
      },
      {
        id: 502,
        question: 'Perintah untuk memindahkan objek dari tempat asal sehingga terhapus dari lokasi awal adalah...',
        options: [
          { key: 'A', text: 'Cut' },
          { key: 'B', text: 'Paste' },
          { key: 'C', text: 'Save' },
          { key: 'D', text: 'Print' },
        ],
        correctAnswer: 'A',
        explanation: 'Cut memotong objek dari tempat asal untuk dipindahkan.',
      },
      {
        id: 503,
        question: 'Shortcut resmi Windows untuk membuka penangkap layar Snipping Tool adalah...',
        options: [
          { key: 'A', text: 'Ctrl + Alt + Del' },
          { key: 'B', text: 'Ctrl + P' },
          { key: 'C', text: 'Windows + Shift + S' },
          { key: 'D', text: 'Alt + Tab' },
        ],
        correctAnswer: 'C',
        explanation: 'Windows + Shift + S mengaktifkan snipping tool secara instan.',
      },
      {
        id: 504,
        question: 'Objek dokumen yang tersusun atas perpotongan baris (rows) dan kolom (columns) disebut...',
        options: [
          { key: 'A', text: 'Shape' },
          { key: 'B', text: 'Table' },
          { key: 'C', text: 'Footer' },
          { key: 'D', text: 'Header' },
        ],
        correctAnswer: 'B',
        explanation: 'Table adalah struktur data sel berbentuk kisi baris dan kolom.',
      },
      {
        id: 505,
        question: 'Bagian margin bawah dari suatu halaman dokumen pengolah kata dinamakan...',
        options: [
          { key: 'A', text: 'Header' },
          { key: 'B', text: 'Footer' },
          { key: 'C', text: 'Paragraph' },
          { key: 'D', text: 'Line' },
        ],
        correctAnswer: 'B',
        explanation: 'Footer terletak di bagian bawah setiap halaman lembar kerja.',
      },
      {
        id: 506,
        question: 'Satu kesatuan kata yang dipisahkan oleh tanda spasi disebut objek...',
        options: [
          { key: 'A', text: 'Character' },
          { key: 'B', text: 'Word' },
          { key: 'C', text: 'Line' },
          { key: 'D', text: 'Page' },
        ],
        correctAnswer: 'B',
        explanation: 'Word (kata) merupakan kumpulan karakter yang dipisahkan spasi.',
      },
      {
        id: 507,
        question: 'Pengaturan warna, ukuran, dan jenis huruf terpusat di dalam kelompok ribbon...',
        options: [
          { key: 'A', text: 'Clipboard' },
          { key: 'B', text: 'Font' },
          { key: 'C', text: 'Paragraph' },
          { key: 'D', text: 'Styles' },
        ],
        correctAnswer: 'B',
        explanation: 'Font menangani segala properti visual huruf teks.',
      },
      {
        id: 508,
        question: 'Fitur untuk mengatur perataan paragraf (rata kiri, tengah, kanan, justify) berada pada kelompok...',
        options: [
          { key: 'A', text: 'Paragraph' },
          { key: 'B', text: 'Font' },
          { key: 'C', text: 'Styles' },
          { key: 'D', text: 'Clipboard' },
        ],
        correctAnswer: 'A',
        explanation: 'Kelompok Paragraph menaungi pengaturan perataan dan spasi.',
      },
      {
        id: 509,
        question: 'Bentuk geometris visual seperti lingkaran, kotak, dan tanda panah disebut...',
        options: [
          { key: 'A', text: 'Shape' },
          { key: 'B', text: 'Table' },
          { key: 'C', text: 'Header' },
          { key: 'D', text: 'Word' },
        ],
        correctAnswer: 'A',
        explanation: 'Shape merupakan objek gambar grafis geometris.',
      },
      {
        id: 510,
        question: 'Keseluruhan lembar kerja dokumen digital yang tersimpan dalam satu berkas disebut...',
        options: [
          { key: 'A', text: 'File' },
          { key: 'B', text: 'Paragraph' },
          { key: 'C', text: 'Line' },
          { key: 'D', text: 'Page' },
        ],
        correctAnswer: 'A',
        explanation: 'File adalah puncak tertinggi dalam hierarki berkas pengolah kata.',
      },
    ],
  },
};

export const ACHIEVEMENTS = [
  {
    id: 'ach_1',
    title: 'Pemula Digital',
    description: 'Memulai langkah pertama sebagai detektif di Digital Academy.',
    iconName: 'BadgeCheck',
  },
  {
    id: 'ach_2',
    title: 'Ahli Copy Paste',
    description: 'Menyelesaikan investigasi di Laboratorium Copy Paste.',
    iconName: 'Copy',
  },
  {
    id: 'ach_3',
    title: 'Master Screenshot',
    description: 'Menguasai penangkapan layar di Kota Screenshot.',
    iconName: 'Camera',
  },
  {
    id: 'ach_4',
    title: 'Detektif Objek',
    description: 'Mengungkap hierarki objek di Markas Detektif Objek.',
    iconName: 'Layers',
  },
  {
    id: 'ach_5',
    title: 'Penguasa Menu Home',
    description: 'Menguasai seluruh fitur pita menu Home pengolah kata.',
    iconName: 'Sliders',
  },
  {
    id: 'ach_6',
    title: 'Master Detektif Digital',
    description: 'Menaklukkan Kastil Final Boss dan menyelamatkan Digital Academy!',
    iconName: 'Trophy',
  },
];
