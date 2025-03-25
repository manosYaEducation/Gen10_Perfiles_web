CREATE TABLE `education` (
  `id` int(11) NOT NULL,
  `profileid` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `institution` varchar(255) DEFAULT NULL,
  `startdate` date DEFAULT NULL,
  `enddate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `experience` (
  `id` int(11) NOT NULL,
  `profileid` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `startdate` date DEFAULT NULL,
  `enddate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `imagenes` (
  `id` int(11) NOT NULL,
  `profileid` int(11) NOT NULL,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `imagen` longblob NOT NULL,
  `tipo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

CREATE TABLE `interest` (
  `id` int(11) NOT NULL,
  `profileid` int(11) DEFAULT NULL,
  `interest` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `profile` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `phrase` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `proyectos` (
  `id_proyecto` int(11) NOT NULL,
  `titulo_tarjeta` varchar(255) NOT NULL,
  `descripcion_tarjeta` text NOT NULL,
  `titulo_proyecto` varchar(255) NOT NULL,
  `contenido_proyecto` text NOT NULL,
  `fecha` date NOT NULL,
  `ubicacion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `proyectos_detalles` (
  `id_detalle` bigint(20) UNSIGNED NOT NULL,
  `tipo` varchar(20) NOT NULL CHECK (`tipo` in ('enlace','imagen','testimonio','participante','parrafo')),
  `descripcion` text NOT NULL,
  `detalle` text DEFAULT NULL,
  `id_proyecto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `review` (
  `id` int(11) NOT NULL,
  `statusid` int(11) NOT NULL,
  `profileid` int(11) NOT NULL,
  `nameClient` varchar(255) NOT NULL,
  `company` varchar(255) DEFAULT NULL,
  `rating` int(11) NOT NULL,
  `comments` text DEFAULT NULL,
  `date_review` date DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

CREATE TABLE `skill` (
  `id` int(11) NOT NULL,
  `profileid` int(11) DEFAULT NULL,
  `skill` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `social` (
  `id` int(11) NOT NULL,
  `profileid` int(11) DEFAULT NULL,
  `platform` varchar(255) NOT NULL,
  `url` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `status` (
  `id_status` int(11) NOT NULL,
  `status` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;


---- talbas nuevas o modificaciones 19-03-2025

ALTER TABLE users ADD COLUMN type VARCHAR(50) NOT NULL DEFAULT 'client';
UPDATE users SET type = 'admin' WHERE username = 'admin';
UPDATE users SET type = 'admin' WHERE username = 'admin2';


CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    company VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    location VARCHAR(255),
    phone VARCHAR(20),
    description TEXT,
    photo VARCHAR(255),
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- Modificar tabla usuarios para adaptarla a los nuevos requisitos
ALTER TABLE usuarios
ADD COLUMN company VARCHAR(100) AFTER nombre,
ADD COLUMN location VARCHAR(255) AFTER ciudad,
ADD COLUMN phone VARCHAR(20) DEFAULT NULL,
ADD COLUMN description TEXT,
ADD COLUMN photo VARCHAR(255) DEFAULT NULL;

-- Cambiar el nombre del campo ciudad a algo más compatible con tu esquema
ALTER TABLE usuarios
CHANGE COLUMN ciudad location VARCHAR(255);