# 🩺 HealthMirror

HealthMirror adalah aplikasi web yang membantu pengguna memantau dan mengevaluasi kebiasaan hidup sehat sehari-hari. Aplikasi ini mengubah data aktivitas harian seperti pola tidur, konsumsi air putih, olahraga, dan screen time menjadi Health Score yang mudah dipahami melalui dashboard interaktif dan visualisasi data.

## ✨ Fitur Utama

### 🔐 Autentikasi Pengguna
- Registrasi akun
- Login menggunakan email dan password
- Autentikasi berbasis JWT

### 📊 Dashboard Kesehatan
- Ringkasan kondisi kesehatan pengguna
- Health Score harian
- Statistik mingguan
- Insight dan rekomendasi kesehatan

### 📝 Pencatatan Aktivitas Harian
Pengguna dapat mencatat:
- Jam tidur
- Konsumsi air putih
- Durasi olahraga
- Screen time

### 📈 Visualisasi Data
- Grafik perkembangan kesehatan
- Tren aktivitas pengguna
- Statistik kesehatan dalam bentuk chart

### 📚 Riwayat Kesehatan
- Menyimpan data kesehatan sebelumnya
- Melihat perkembangan kebiasaan sehat dari waktu ke waktu

### 🔔 Notifikasi
- Pengingat dan informasi terkait kesehatan pengguna

## 🛠️ Teknologi yang Digunakan

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- Chart.js
- React ChartJS 2
- Lucide React

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcryptjs
- CORS

### Database
- SQLite
- Prisma ORM

## 📂 Struktur Project

```
UAS_PrakPBW_KLP1
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── api/
│   └── package.json
│
├── server/
│   ├── prisma/
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   └── package.json
│
└── README.md
```

## ⚙️ Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/T-Fikram/UAS_PrakPBW_KLP1.git
cd UAS_PrakPBW_KLP1
```

## Backend Setup

Masuk ke folder server:

```bash
cd server
```

Install dependency:

```bash
npm install
```

Generate Prisma Client:

```bash
npm run db:generate
```

Migrasi database:

```bash
npm run db:migrate
```

Menjalankan backend:

```bash
npm run dev
```

atau

```bash
npm start
```

Backend berjalan pada:

```text
http://localhost:5000
```

---

## Frontend Setup

Masuk ke folder client:

```bash
cd client
```

Install dependency:

```bash
npm install
```

Jalankan frontend:

```bash
npm run dev
```

Frontend berjalan pada:

```text
http://localhost:5173
```

## 🗄️ Database

Project menggunakan SQLite dengan Prisma ORM.

Schema utama:

### User
- id
- name
- email
- password

### HealthRecord
- date
- sleepHours
- waterGlasses
- exerciseMinutes
- screenTimeHours
- healthScore

### Notification
- title
- message
- type
- isRead

## 🎯 Tujuan Aplikasi

HealthMirror dikembangkan untuk membantu pengguna:

- Memantau pola hidup sehat.
- Mengevaluasi kebiasaan harian.
- Meningkatkan kesadaran kesehatan.
- Melihat perkembangan kesehatan melalui data dan visualisasi.

## 👨‍💻 Tim Pengembang

Kelompok 1 Praktikum Pemrograman Berbasis Web

- Abdullah Asy-Syifawi
- T. Fikram Al Syahbanna

## 🎓 Institusi

Program Studi Informatika  
Fakultas MIPA  
Universitas Syiah Kuala

## 📄 Lisensi

Project ini dibuat untuk keperluan akademik dan pembelajaran pada mata kuliah Praktikum Pemrograman Berbasis Web.
