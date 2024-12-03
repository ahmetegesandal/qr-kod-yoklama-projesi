-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1
-- Üretim Zamanı: 03 Ara 2024, 14:48:01
-- Sunucu sürümü: 10.4.28-MariaDB
-- PHP Sürümü: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `my_auth_db`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `bolumler`
--

CREATE TABLE `bolumler` (
  `bolum_id` int(11) NOT NULL,
  `bolum_kodu` varchar(20) DEFAULT NULL,
  `bolum_adi` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `bolumler`
--

INSERT INTO `bolumler` (`bolum_id`, `bolum_kodu`, `bolum_adi`) VALUES
(1, 'BLPM', 'Bilgisayar Programcılığı');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `campus`
--

CREATE TABLE `campus` (
  `campus_id` int(11) NOT NULL,
  `campus_adi` varchar(100) DEFAULT NULL,
  `adres` varchar(255) DEFAULT NULL,
  `campus_kodu` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `campus`
--

INSERT INTO `campus` (`campus_id`, `campus_adi`, `adres`, `campus_kodu`) VALUES
(1, 'Tepekent', 'Merkez Mahallesi, Kampüs Sokak No:1', 'TY'),
(2, 'Cevizlibağ', 'Batı Mahallesi, Eğitim Cad. No:2', 'CY');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `dersler`
--

CREATE TABLE `dersler` (
  `ders_id` int(11) NOT NULL,
  `ders_kodu` varchar(20) DEFAULT NULL,
  `ders_adı` varchar(100) DEFAULT NULL,
  `kredi` int(11) DEFAULT NULL,
  `derslik_id` int(11) DEFAULT NULL,
  `ogretim_elemani_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `dersler`
--

INSERT INTO `dersler` (`ders_id`, `ders_kodu`, `ders_adı`, `kredi`, `derslik_id`, `ogretim_elemani_id`) VALUES
(1, 'BLPM207', 'Sistem Analizi ve Tasarımı', 4, 1, 2),
(2, 'BLPM209', 'Web Programlama-1', 3, 2, 10),
(11, 'BLPM261', 'Bilgisayar Ağ Sistemleri', 4, 3, 9),
(12, 'BLPM231', 'Dijital Sanayi', 3, 2, 9),
(13, 'BLPM203', 'Görsel Programlama-2', 3, 1, 2),
(14, 'BLPM205', 'Nesneye Dayalı Programlama-2', 3, 2, 2);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `derslikler`
--

CREATE TABLE `derslikler` (
  `derslik_id` int(11) NOT NULL,
  `derslik_adi` varchar(100) DEFAULT NULL,
  `kapasite` int(11) DEFAULT NULL,
  `campus_id` int(11) DEFAULT NULL,
  `qr_kod_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `derslikler`
--

INSERT INTO `derslikler` (`derslik_id`, `derslik_adi`, `kapasite`, `campus_id`, `qr_kod_id`) VALUES
(1, 'TY.3.309', 75, 1, 1),
(2, 'TY.0.Z26', 28, 1, 2),
(3, 'TY.2.217', 55, 1, 3),
(4, 'TY.2.218', 35, 1, 4),
(5, 'TY.0.Z28', 20, 1, 5),
(6, 'CY.3.317', 30, 2, 6);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `ticketId` int(11) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `messages`
--

INSERT INTO `messages` (`id`, `ticketId`, `userId`, `content`, `created_at`) VALUES
(90, 22, '2', '<p>123</p>', '2024-11-16 14:50:05'),
(91, 22, '4', '<p>mailden dönülmüştür</p>', '2024-11-16 16:38:52'),
(92, 22, '2', '<p>bana yardım lazım hocam ya</p>', '2024-11-16 17:25:52'),
(93, 22, '4', '<p>ederiz canım</p>', '2024-11-16 17:26:11'),
(94, 22, '2', '<p>hocam yardımmm</p>', '2024-11-16 17:37:08'),
(95, 22, '2', '<ul><li><i><strong>dasdasd</strong></i></li><li><i><strong>dsadsada</strong></i></li><li><i><strong>dsadsa</strong></i></li><li><i><strong>d</strong></i></li><li><i><strong>as</strong></i></li><li><i><strong>dasdas</strong></i></li></ul>', '2024-11-16 17:41:11'),
(96, 22, '2', '<p>ddd</p>', '2024-11-16 17:43:29'),
(97, 22, '4', '<p>sorun çözülmüştür iyi günler dileriz</p>', '2024-11-16 17:44:05'),
(98, 24, '2', '<p>dd</p>', '2024-11-16 18:08:36'),
(99, 24, '4', '<p>merhaba</p>', '2024-11-16 19:00:45'),
(100, 23, '2', '<p>dsjandusauıduıasıodas</p>', '2024-11-19 21:17:10'),
(101, 23, '4', '<p>egecim problemi çözcem</p>', '2024-11-19 21:17:40');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `ogretim_elemanlari`
--

CREATE TABLE `ogretim_elemanlari` (
  `ogretim_elemani_id` int(11) NOT NULL,
  `unvan` varchar(50) DEFAULT NULL,
  `telefon` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `bölüm_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `ogretim_elemanlari`
--

INSERT INTO `ogretim_elemanlari` (`ogretim_elemani_id`, `unvan`, `telefon`, `email`, `bölüm_id`, `user_id`) VALUES
(1, 'Öğr. Gör. Veyis Şen', '05331234567', 'veyis.sen@istanbularel.edu.tr', 1, NULL),
(2, 'Öğr. Gör. Ebru İdman', '05339876543', 'ebru.idman@istanbularel.edu.tr', 1, 4),
(9, 'Öğr. Gör. Sibel Birtane Akar', '05345678901', 'sibel.akar@istanbularel.edu.tr', 1, NULL),
(10, 'Öğr. Gör. Aslıhan Karataş', '05346789012', 'aslihan.karatas@istanbularel.edu.tr', 1, NULL);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `opened_rollcall`
--

CREATE TABLE `opened_rollcall` (
  `roll_call_id` int(11) NOT NULL,
  `ders_id` int(11) NOT NULL,
  `users_id` int(11) NOT NULL,
  `tarih` date NOT NULL,
  `durum` enum('acik','kapali') DEFAULT 'acik',
  `baslangic_saati` time NOT NULL,
  `bitis_saati` time NOT NULL,
  `qr_kod_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `opened_rollcall`
--

INSERT INTO `opened_rollcall` (`roll_call_id`, `ders_id`, `users_id`, `tarih`, `durum`, `baslangic_saati`, `bitis_saati`, `qr_kod_id`) VALUES
(36, 1, 4, '2024-11-16', 'acik', '18:49:00', '19:30:00', 1),
(38, 14, 4, '2024-11-16', 'acik', '18:32:00', '00:00:19', 1),
(40, 14, 4, '2024-11-16', 'acik', '18:50:00', '19:30:00', 2),
(41, 14, 4, '2024-11-19', 'acik', '21:19:00', '23:00:00', 2);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `qr_kodlar`
--

CREATE TABLE `qr_kodlar` (
  `qr_kod_id` int(11) NOT NULL,
  `derslik_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `qr_kodlar`
--

INSERT INTO `qr_kodlar` (`qr_kod_id`, `derslik_id`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `student_courses`
--

CREATE TABLE `student_courses` (
  `student_courses_id` int(11) NOT NULL,
  `id` int(11) DEFAULT NULL,
  `gün` varchar(20) DEFAULT NULL,
  `başlangıç_saati` time DEFAULT NULL,
  `bitiş_saati` time DEFAULT NULL,
  `ders_id` int(11) DEFAULT NULL,
  `derslik_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `student_courses`
--

INSERT INTO `student_courses` (`student_courses_id`, `id`, `gün`, `başlangıç_saati`, `bitiş_saati`, `ders_id`, `derslik_id`) VALUES
(16, 2, 'Saturday', '16:00:00', '16:50:00', 1, 1),
(21, 2, 'Saturday', '17:00:00', '17:50:00', 1, 1),
(22, 2, 'Tuesday', '21:00:00', '23:00:00', 14, 1);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `tickets`
--

CREATE TABLE `tickets` (
  `id` int(11) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `status` enum('Yanıt Bekliyor','Cevaplandı') DEFAULT 'Yanıt Bekliyor'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `tickets`
--

INSERT INTO `tickets` (`id`, `userId`, `subject`, `description`, `created_at`, `status`) VALUES
(22, '2', 'merhaba hocam', 'merhabalarrrrrr', '2024-11-16 14:49:23', 'Cevaplandı'),
(23, '2', 'dd', 'dd', '2024-11-16 17:46:59', 'Cevaplandı'),
(24, '2', 'aa', 'aa', '2024-11-16 17:49:54', 'Cevaplandı');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `studentNumber` varchar(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `role` enum('admin','student') NOT NULL DEFAULT 'student',
  `photo` varchar(255) DEFAULT NULL,
  `bolum_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `studentNumber`, `name`, `surname`, `role`, `photo`, `bolum_id`) VALUES
(2, 'ege', '$2a$10$Q.neNjq1HjmO5gA9cyS2T.HTyySJ6tp8pbCUiidyqZH.aKnleoqia', '231030015', 'Ahmet Ege', 'Sandal', 'student', 'user_231030015.jpg', 1),
(4, 'efe', '$2a$10$OE8tFQR8EDV6.lP8kr62F.3khuzzeoHxycAFefWQSM3HJhyIXDzGG', '19103001', 'Ebru', 'İdman', 'admin', 'user_19103001.png', NULL),
(5, 'asa', '$2a$10$Rgo6BY6IMqZNRpbJy3ErW.7caFrBWFkpgNjQKmGqXSuGr0VGXiKBq', '231030019', 'Mehmet', 'Talha Çelik', 'student', 'user_231030019.png', NULL);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `yoklamalar`
--

CREATE TABLE `yoklamalar` (
  `yoklama_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `ders_id` int(11) DEFAULT NULL,
  `tarih` date DEFAULT NULL,
  `durum` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `yoklamalar`
--

INSERT INTO `yoklamalar` (`yoklama_id`, `user_id`, `ders_id`, `tarih`, `durum`) VALUES
(89, 2, 1, '2024-11-16', 'var'),
(90, 2, 14, '2024-11-16', 'var'),
(91, 2, 14, '2024-11-19', 'var');

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `bolumler`
--
ALTER TABLE `bolumler`
  ADD PRIMARY KEY (`bolum_id`);

--
-- Tablo için indeksler `campus`
--
ALTER TABLE `campus`
  ADD PRIMARY KEY (`campus_id`);

--
-- Tablo için indeksler `dersler`
--
ALTER TABLE `dersler`
  ADD PRIMARY KEY (`ders_id`),
  ADD KEY `öğretim_elemanı_id` (`ogretim_elemani_id`),
  ADD KEY `derslik_id` (`derslik_id`);

--
-- Tablo için indeksler `derslikler`
--
ALTER TABLE `derslikler`
  ADD PRIMARY KEY (`derslik_id`),
  ADD KEY `campus_id` (`campus_id`);

--
-- Tablo için indeksler `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ticketId` (`ticketId`);

--
-- Tablo için indeksler `ogretim_elemanlari`
--
ALTER TABLE `ogretim_elemanlari`
  ADD PRIMARY KEY (`ogretim_elemani_id`),
  ADD KEY `bölüm_id` (`bölüm_id`),
  ADD KEY `fk_user_id` (`user_id`);

--
-- Tablo için indeksler `opened_rollcall`
--
ALTER TABLE `opened_rollcall`
  ADD PRIMARY KEY (`roll_call_id`),
  ADD UNIQUE KEY `unique_rollcall` (`ders_id`,`tarih`,`qr_kod_id`),
  ADD KEY `users_id` (`users_id`);

--
-- Tablo için indeksler `qr_kodlar`
--
ALTER TABLE `qr_kodlar`
  ADD PRIMARY KEY (`qr_kod_id`),
  ADD KEY `derslik_id` (`derslik_id`);

--
-- Tablo için indeksler `student_courses`
--
ALTER TABLE `student_courses`
  ADD PRIMARY KEY (`student_courses_id`),
  ADD KEY `id` (`id`),
  ADD KEY `ders_id` (`ders_id`),
  ADD KEY `derslik_id` (`derslik_id`);

--
-- Tablo için indeksler `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Tablo için indeksler `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `bölüm_id` (`bolum_id`);

--
-- Tablo için indeksler `yoklamalar`
--
ALTER TABLE `yoklamalar`
  ADD PRIMARY KEY (`yoklama_id`),
  ADD UNIQUE KEY `unique_attendance` (`user_id`,`ders_id`,`tarih`),
  ADD KEY `ders_id` (`ders_id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `bolumler`
--
ALTER TABLE `bolumler`
  MODIFY `bolum_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Tablo için AUTO_INCREMENT değeri `campus`
--
ALTER TABLE `campus`
  MODIFY `campus_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Tablo için AUTO_INCREMENT değeri `dersler`
--
ALTER TABLE `dersler`
  MODIFY `ders_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Tablo için AUTO_INCREMENT değeri `derslikler`
--
ALTER TABLE `derslikler`
  MODIFY `derslik_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Tablo için AUTO_INCREMENT değeri `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- Tablo için AUTO_INCREMENT değeri `ogretim_elemanlari`
--
ALTER TABLE `ogretim_elemanlari`
  MODIFY `ogretim_elemani_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Tablo için AUTO_INCREMENT değeri `opened_rollcall`
--
ALTER TABLE `opened_rollcall`
  MODIFY `roll_call_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- Tablo için AUTO_INCREMENT değeri `qr_kodlar`
--
ALTER TABLE `qr_kodlar`
  MODIFY `qr_kod_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Tablo için AUTO_INCREMENT değeri `student_courses`
--
ALTER TABLE `student_courses`
  MODIFY `student_courses_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Tablo için AUTO_INCREMENT değeri `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- Tablo için AUTO_INCREMENT değeri `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Tablo için AUTO_INCREMENT değeri `yoklamalar`
--
ALTER TABLE `yoklamalar`
  MODIFY `yoklama_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=92;

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `dersler`
--
ALTER TABLE `dersler`
  ADD CONSTRAINT `dersler_ibfk_1` FOREIGN KEY (`ogretim_elemani_id`) REFERENCES `ogretim_elemanlari` (`ogretim_elemani_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `dersler_ibfk_2` FOREIGN KEY (`derslik_id`) REFERENCES `derslikler` (`derslik_id`) ON DELETE SET NULL;

--
-- Tablo kısıtlamaları `derslikler`
--
ALTER TABLE `derslikler`
  ADD CONSTRAINT `derslikler_ibfk_1` FOREIGN KEY (`campus_id`) REFERENCES `campus` (`campus_id`) ON DELETE SET NULL;

--
-- Tablo kısıtlamaları `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`ticketId`) REFERENCES `tickets` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `ogretim_elemanlari`
--
ALTER TABLE `ogretim_elemanlari`
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ogretim_elemanlari_ibfk_1` FOREIGN KEY (`bölüm_id`) REFERENCES `bolumler` (`bolum_id`) ON DELETE SET NULL;

--
-- Tablo kısıtlamaları `opened_rollcall`
--
ALTER TABLE `opened_rollcall`
  ADD CONSTRAINT `opened_rollcall_ibfk_2` FOREIGN KEY (`ders_id`) REFERENCES `dersler` (`ders_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `opened_rollcall_ibfk_4` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Tablo kısıtlamaları `qr_kodlar`
--
ALTER TABLE `qr_kodlar`
  ADD CONSTRAINT `qr_kodlar_ibfk_1` FOREIGN KEY (`derslik_id`) REFERENCES `derslikler` (`derslik_id`) ON DELETE SET NULL;

--
-- Tablo kısıtlamaları `student_courses`
--
ALTER TABLE `student_courses`
  ADD CONSTRAINT `student_courses_ibfk_1` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `student_courses_ibfk_2` FOREIGN KEY (`ders_id`) REFERENCES `dersler` (`ders_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `student_courses_ibfk_3` FOREIGN KEY (`derslik_id`) REFERENCES `derslikler` (`derslik_id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`bolum_id`) REFERENCES `bolumler` (`bolum_id`) ON DELETE SET NULL;

--
-- Tablo kısıtlamaları `yoklamalar`
--
ALTER TABLE `yoklamalar`
  ADD CONSTRAINT `yoklamalar_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `yoklamalar_ibfk_3` FOREIGN KEY (`ders_id`) REFERENCES `dersler` (`ders_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
