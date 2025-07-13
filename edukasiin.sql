CREATE TABLE `comments` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`id_video` INT NOT NULL,
	`id_user` INT NOT NULL,
	`komentar` LONGTEXT NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`likes` INT NOT NULL DEFAULT '0',
	`waktu` TIMESTAMP NOT NULL DEFAULT (now()),
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB
;

CREATE TABLE `hadiah` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`nama` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`poin` INT NOT NULL DEFAULT '0',
	`stok` INT NOT NULL DEFAULT '0',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB
;

CREATE TABLE `history_video` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`id_user` INT NOT NULL,
	`id_video` INT NOT NULL,
	`timestamps` DATETIME NOT NULL DEFAULT (now()),
	`key_status` VARCHAR(12) NOT NULL DEFAULT 'active' COLLATE 'utf8mb4_0900_ai_ci',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB
;


CREATE TABLE `jawaban_siswa` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`id_ujian` INT NOT NULL,
	`id_user` INT NOT NULL,
	`id_soal` INT NOT NULL,
	`jawaban` LONGTEXT NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`nilai` INT NOT NULL DEFAULT '0',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB
;

CREATE TABLE `kupon` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`id_hadiah` INT NOT NULL,
	`kode` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`tipe` VARCHAR(12) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`waktu` TIMESTAMP NOT NULL DEFAULT (now()),
	`status` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB
;

CREATE TABLE `like_comment` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`id_comment` INT NOT NULL,
	`id_video` INT NOT NULL,
	`id_user` INT NOT NULL,
	`timestamp` TIMESTAMP NOT NULL DEFAULT (now()),
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB
;


CREATE TABLE `like_video` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`id_video` INT NOT NULL,
	`id_user` INT NOT NULL,
	`timestamp` TIMESTAMP NOT NULL DEFAULT (now()),
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB
;


CREATE TABLE `mengikuti_ujian` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`id_user` INT NOT NULL DEFAULT '0',
	`id_ujian` INT NOT NULL DEFAULT '0',
	`status` VARCHAR(50) NOT NULL DEFAULT 'tidak hadir' COLLATE 'utf8mb4_0900_ai_ci',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB
;

CREATE TABLE `notifikasi` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`id_user` INT NOT NULL,
	`icon` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`warna` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`judul` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`pesan` LONGTEXT NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`waktu` TIMESTAMP NOT NULL DEFAULT (now()),
	`status` VARCHAR(50) NOT NULL DEFAULT 'belum dibaca' COLLATE 'utf8mb4_0900_ai_ci',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB
AUTO_INCREMENT=3
;


CREATE TABLE `soal` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`id_ujian` INT NOT NULL,
	`tipe` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`soal` LONGTEXT NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`opsi_a` VARCHAR(255) NOT NULL DEFAULT '-' COLLATE 'utf8mb4_0900_ai_ci',
	`opsi_b` VARCHAR(255) NOT NULL DEFAULT '-' COLLATE 'utf8mb4_0900_ai_ci',
	`opsi_c` VARCHAR(255) NOT NULL DEFAULT '-' COLLATE 'utf8mb4_0900_ai_ci',
	`opsi_d` VARCHAR(255) NOT NULL DEFAULT '-' COLLATE 'utf8mb4_0900_ai_ci',
	`opsi_e` VARCHAR(255) NOT NULL DEFAULT '-' COLLATE 'utf8mb4_0900_ai_ci',
	`jawaban` VARCHAR(255) NOT NULL DEFAULT '-' COLLATE 'utf8mb4_0900_ai_ci',
	`pembahasan` LONGTEXT NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`link_video` VARCHAR(255) NOT NULL DEFAULT '-' COLLATE 'utf8mb4_0900_ai_ci',
	`link_gambar` VARCHAR(255) NOT NULL DEFAULT '-' COLLATE 'utf8mb4_0900_ai_ci',
	`link_file` VARCHAR(255) NOT NULL DEFAULT '-' COLLATE 'utf8mb4_0900_ai_ci',
	`link_audio` VARCHAR(255) NOT NULL DEFAULT '-' COLLATE 'utf8mb4_0900_ai_ci',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB
;

CREATE TABLE `ujian` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`nama` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`tipe` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`durasi` TIME NOT NULL,
	`tanggal` DATE NOT NULL,
	`mulai` TIME NOT NULL,
	`selesai` TIME NOT NULL,
	`jumlah_soal` INT NOT NULL,
	`deskripsi` LONGTEXT NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`id_guru` INT NOT NULL,
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB
;

CREATE TABLE `users` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`email` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`password` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`nama` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`role` VARCHAR(5) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`kelas` VARCHAR(2) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`poin` INT NOT NULL DEFAULT '0',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB
AUTO_INCREMENT=6
;

CREATE TABLE `video_edukasi` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`judul` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`mata_pelajaran` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`link_video` LONGTEXT NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`kelas` CHAR(1) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`views` INT NOT NULL DEFAULT '0',
	`likes` INT NOT NULL DEFAULT '0',
	`durasi` TIME NOT NULL,
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB
AUTO_INCREMENT=5
;


-- Data dummy untuk tabel `users`
INSERT INTO `users` (`email`, `password`, `nama`, `role`, `kelas`, `poin`) VALUES
('rama@gmail.com', 'hashed_password_siswa', 'Ramz', 'siswa', '7D', 0),
('rivieraaf25@gmail.com', 'hashed_password_siswa', 'Luczty', 'siswa', '7E', 0),
('admin@gmail.com', 'hashed_password_admin', 'Luczty', 'admin', NULL, 0),
('guru@gmail.com', 'hashed_password_guru', 'Luczty', 'guru', NULL, 0);

-- Data dummy untuk tabel `comments`
INSERT INTO `comments` (`id_video`, `id_user`, `komentar`, `likes`, `waktu`) VALUES
(1, 2, 'Video ini sangat membantu!', 5, NOW()),
(1, 3, 'Terima kasih atas penjelasannya.', 3, NOW());

-- Data dummy untuk tabel `hadiah`
INSERT INTO `hadiah` (`nama`, `poin`, `stok`) VALUES
('Pulpen', 10, 100),
('Buku Catatan', 20, 50),
('Tas Sekolah', 50, 10);
('Ultra Milk Coklat', 10, 10);

-- Data dummy untuk tabel `jawaban_siswa`
INSERT INTO `jawaban_siswa` (`id_ujian`, `id_user`, `id_soal`, `jawaban`, `nilai`) VALUES
(1, 3, 1, 'A', 10),
(1, 2, 1, 'B', 0);

-- Data dummy untuk tabel `kupon`
INSERT INTO `kupon` (`id_hadiah`, `kode`, `tipe`, `waktu`, `status`) VALUES
(1, 'AT_001_18042025', 'alat tulis', NOW(), 'belum diklaim'),
(2, 'MI_001_18042025', 'minuman', NOW(), 'belum diklaim');

-- Data dummy untuk tabel `mengikuti_ujian`
INSERT INTO `mengikuti_ujian` (`id_user`, `id_ujian`, `status`) VALUES
(2, 1, 'hadir'),
(3, 1, 'hadir');

-- Data dummy untuk tabel `notifikasi`
INSERT INTO `notifikasi` (`id_user`, `judul`, `pesan`, `waktu`, `status`) VALUES
(3, 'Ujian Baru', 'Anda memiliki ujian baru yang dijadwalkan.', NOW(), 'belum dibaca'),
(2, 'Poin Bertambah', 'Poin Anda telah bertambah.', NOW(), 'belum dibaca');

-- Data dummy untuk tabel `soal`
INSERT INTO `soal` (`id_ujian`, `tipe`, `soal`, `opsi_a`, `opsi_b`, `opsi_c`, `opsi_d`, `opsi_e`, `jawaban`, `pembahasan`, `link_video`, `link_gambar`, `link_file`, `link_audio`) VALUES
(1, 'pilihan ganda', 'Apa ibu kota Indonesia?', 'Jakarta', 'Surabaya', 'Bandung', 'Medan', '-', 'A', 'Ibu kota Indonesia adalah Jakarta.', '-', '-', '-', '-'),
(1, 'pilihan ganda', 'Apa warna bendera Indonesia?', 'Merah Putih', 'Hijau Kuning', 'Biru Putih', 'Merah Biru', '-', 'A', 'Bendera Indonesia berwarna Merah Putih.', '-', '-', '-', '-'),
(1, 'isian', 'Sebutkan nama presiden pertama Indonesia!', '-', '-', '-', '-', '-', 'Soekarno', 'Presiden pertama Indonesia adalah Soekarno.', '-', '-', '-', '-'),
(1, 'upload file', 'Unggah file tugas sejarah Anda.', '-', '-', '-', '-', '-', '-', 'Unggah file tugas sejarah Anda sesuai instruksi.', '-', '-', '-', '-');

-- Data dummy untuk tabel `ujian`
INSERT INTO `ujian` (`nama`, `tipe`, `durasi`, `tanggal`, `mulai`, `selesai`, `jumlah_soal`, `deskripsi`, `id_guru`) VALUES
('Ujian Sejarah', 'pilihan ganda', '01:00:00', '2025-04-20', '09:00:00', '10:00:00', 10, 'Ujian tentang sejarah Indonesia.', 5),
('Ujian Matematika', 'pilihan ganda', '01:30:00', '2025-04-21', '10:00:00', '11:30:00', 15, 'Ujian tentang dasar-dasar matematika.', 5);

-- Data dummy untuk tabel `video_edukasi`
INSERT INTO `video_edukasi` (`judul`, `mata_pelajaran`, `link_video`, `kelas`, `views`, `likes`) VALUES
('Sejarah Proklamasi', 'Sejarah', 'https://www.youtube.com/watch?v=example1', '7', 100, 50),
('Dasar-Dasar Aljabar', 'Matematika', 'https://www.youtube.com/watch?v=example2', '7', 200, 80),
('Fisika Dasar', 'Fisika', 'https://www.youtube.com/watch?v=example3', '8', 150, 60),
('Kimia Organik', 'Kimia', 'https://www.youtube.com/watch?v=example4', '9', 300, 120);

