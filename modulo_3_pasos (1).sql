-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-06-2025 a las 17:43:08
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `modulo_3_pasos`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias_servicios`
--

CREATE TABLE `categorias_servicios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias_servicios`
--

INSERT INTO `categorias_servicios` (`id`, `nombre`) VALUES
(10, 'Automatizacion'),
(7, 'Diseno'),
(12, 'Formacion'),
(8, 'Giftcard'),
(9, 'Marketing'),
(11, 'Tecnologia');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ordenes`
--

CREATE TABLE `ordenes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `servicios_json` text DEFAULT NULL,
  `estado_pago` varchar(50) NOT NULL DEFAULT 'pendiente' COMMENT 'Estado del pago: pendiente, pagado, fallido, etc.',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ordenes`
--

INSERT INTO `ordenes` (`id`, `nombre`, `apellido`, `correo`, `telefono`, `servicios_json`, `estado_pago`, `fecha_creacion`) VALUES
(1, 'Dusan', 'Daaaasdfgdsfgdfs', 'ovthissardi@gmail.com', '+56976636941', '[{\"id\":\"tecnologia-1\",\"nombre\":\"Servicios de Ciberseguridad Premium\",\"precio\":400000,\"tiempo\":\"3 semanas\",\"comentarioPersonalizado\":\"bdfghx\",\"opcionesSeleccionadas\":[{\"id\":\"monitoreo-continuo\",\"nombre\":\"Monitoreo Continuo\",\"descripcion\":\"Monitoreo 24\\/7 de seguridad\",\"precio\":100000,\"seleccionado\":false}]}]', 'pagado', '2025-06-04 01:10:51'),
(2, 'Dusanaaaa', 'Daaaasdfgdsfgdfs', 'ovthissardi@gmail.com', '+56976636941', '[{\"id\":\"automatizacion-1\",\"nombre\":\"Integraci\\u00f3n de Sistemas Empresariales\",\"precio\":400000,\"tiempo\":\"4-6 semanas\",\"comentarioPersonalizado\":\"\",\"opcionesSeleccionadas\":[]}]', 'pendiente', '2025-06-04 01:14:04'),
(3, 'pepepepe', 'Daaaasdfgdsfgdfs', 'ovthissardi@gmail.com', '+56976636941', '[{\"id\":\"automatizacion-1\",\"nombre\":\"Integraci\\u00f3n de Sistemas Empresariales\",\"precio\":400000,\"tiempo\":\"4-6 semanas\",\"comentarioPersonalizado\":\"\",\"opcionesSeleccionadas\":[]}]', 'pendiente', '2025-06-04 01:14:39');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios`
--

CREATE TABLE `servicios` (
  `id` varchar(255) NOT NULL,
  `categoria_id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio_base` decimal(10,2) NOT NULL,
  `tiempo_entrega` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `servicios`
--

INSERT INTO `servicios` (`id`, `categoria_id`, `nombre`, `descripcion`, `precio_base`, `tiempo_entrega`) VALUES
('automatizacion-1', 10, 'Integración de Sistemas Empresariales', 'Integración completa de sistemas CRM, ERP, POS y otros con manejo de grandes volúmenes de datos y sincronización en tiempo real.', 400000.00, '4'),
('automatizacion-2', 10, 'ChatBot Avanzado', 'Desarrollo de chatbot inteligente con IA para atención al cliente y ventas automatizadas.', 150000.00, '3'),
('diseno-1', 7, 'Desarrollo de landing page', 'Creación de una página de aterrizaje profesional y optimizada para conversiones, con diseño responsive y adaptado a todos los dispositivos. Incluye 3 revisiones y entrega en 10 días hábiles.', 120000.00, '10'),
('diseno-2', 7, 'Rediseño web', 'Modernización completa de su sitio web existente con análisis detallado de arquitectura actual, migración de contenidos y optimización SEO. Incluye evaluación de compatibilidad entre tecnologías y pruebas de regresión.', 350000.00, '20'),
('diseno-3', 7, 'Ecommerce Completo', 'Desarrollo de tienda online con gestión avanzada de productos, integración ERP y sistema de inventario multicanal. Incluye pasarela de pagos y panel de administración completo.', 450000.00, '30'),
('diseno-4', 7, 'Experiencia de usuario (UX/UI)', 'Diseño centrado en el usuario con investigación cualitativa y cuantitativa, prototipos interactivos y pruebas de usabilidad exhaustivas.', 250000.00, '15'),
('formacion-1', 12, 'Formación Empresarial', 'Programa de formación personalizado para equipos con temario adaptado y múltiples modalidades.', 80000.00, '8'),
('giftcard-1', 8, 'Giftcard Normal', 'Tarjeta de regalo estándar para cualquier ocasión. El regalo perfecto para sorprender a tus seres queridos con total libertad de elección.', 10000.00, '0'),
('giftcard-2', 8, 'Giftcard Medium', 'Tarjeta de regalo con beneficios adicionales y mayor valor. Ideal para celebraciones especiales y agradecimientos importantes.', 30000.00, '1'),
('giftcard-3', 8, 'Giftcard Premium', 'Nuestra tarjeta de regalo de máxima categoría. Una experiencia de regalo exclusiva con beneficios VIP y atención personalizada.', 100000.00, '0'),
('marketing-1', 9, 'Campañas RRSS Premium', 'Gestión integral de campañas en redes sociales con estrategia personalizada según objetivos de branding, leads o ventas directas.', 150000.00, '1'),
('marketing-2', 9, 'Branding Corporativo', 'Desarrollo completo de identidad de marca con aplicaciones en múltiples formatos y manual de marca detallado.', 200000.00, '20'),
('marketing-3', 9, 'Estrategia Digital Integral', 'Desarrollo de estrategia digital completa con auditoría, roadmap y plan de implementación detallado.', 120000.00, '2'),
('tecnologia-1', 11, 'Servicios de Ciberseguridad Premium', 'Servicios completos de ciberseguridad con pentesting, auditorías y cumplimiento normativo.', 300000.00, '3'),
('tecnologia-2', 11, 'Cloud y Hosting Enterprise', 'Solución de hosting y cloud empresarial con alta disponibilidad y seguridad avanzada.', 80000.00, '0');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios_caracteristicas`
--

CREATE TABLE `servicios_caracteristicas` (
  `id` int(11) NOT NULL,
  `servicio_id` varchar(255) NOT NULL,
  `caracteristica` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `servicios_caracteristicas`
--

INSERT INTO `servicios_caracteristicas` (`id`, `servicio_id`, `caracteristica`) VALUES
(101, 'diseno-1', 'Diseño 100% responsive'),
(102, 'diseno-1', 'Optimización para SEO básico'),
(103, 'diseno-1', 'Integración con redes sociales'),
(104, 'diseno-1', 'Formulario de contacto funcional'),
(105, 'diseno-1', 'Certificado SSL incluido'),
(106, 'diseno-2', 'Auditoría de arquitectura actual'),
(107, 'diseno-2', 'Evaluación de compatibilidad tecnológica'),
(108, 'diseno-2', 'Mapeo de URLs y conservación SEO'),
(109, 'diseno-2', 'Migración de contenidos optimizada'),
(110, 'diseno-2', 'Pruebas de regresión completas'),
(111, 'diseno-2', 'Optimización de rendimiento'),
(112, 'diseno-2', 'Certificado SSL incluido'),
(113, 'diseno-3', 'Catálogo de productos ilimitado con variantes'),
(114, 'diseno-3', 'Integración con ERP (SAP, Oracle, Odoo)'),
(115, 'diseno-3', 'Gestión de inventario multicanal'),
(116, 'diseno-3', 'Sistema de reabastecimiento automático'),
(117, 'diseno-3', 'Pasarela de pagos integrada'),
(118, 'diseno-3', 'Panel de administración avanzado'),
(119, 'diseno-3', 'Soporte técnico por 90 días'),
(120, 'diseno-4', 'Investigación cualitativa y cuantitativa'),
(121, 'diseno-4', 'Creación de user personas detalladas'),
(122, 'diseno-4', 'Prototipos interactivos en Figma/Sketch'),
(123, 'diseno-4', 'Tests de usabilidad con usuarios reales'),
(124, 'diseno-4', 'Análisis de resultados y métricas'),
(125, 'diseno-4', 'Guía de estilo UI completa'),
(126, 'diseno-4', 'Documentación de patrones de diseño'),
(127, 'giftcard-1', 'Diseño clásico y elegante'),
(128, 'giftcard-1', 'Personalizable con mensaje de felicitación'),
(129, 'giftcard-1', 'Disponible en montos desde $10.000 hasta $50.000'),
(130, 'giftcard-1', 'Válida por 1 año desde su activación'),
(131, 'giftcard-1', 'Envío digital inmediato'),
(132, 'giftcard-2', 'Diseño premium con acabado metalizado'),
(133, 'giftcard-2', 'Personalizable con mensaje y foto'),
(134, 'giftcard-2', 'Disponible en montos desde $30.000 hasta $100.000'),
(135, 'giftcard-2', 'Válida por 1 año desde su activación'),
(136, 'giftcard-2', 'Opción de entrega física o digital'),
(137, 'giftcard-2', 'Incluye notificación de entrega'),
(138, 'giftcard-3', 'Diseño exclusivo con acabado en oro rosa'),
(139, 'giftcard-3', 'Personalizable con mensaje, foto y video'),
(140, 'giftcard-3', 'Disponible en montos desde $100.000 hasta $500.000'),
(141, 'giftcard-3', 'Válida por 2 años desde su activación'),
(142, 'giftcard-3', 'Entrega prioritaria física o digital'),
(143, 'giftcard-3', 'Acceso a descuentos exclusivos'),
(144, 'giftcard-3', 'Servicio de atención al cliente VIP'),
(145, 'marketing-1', 'Estrategia por objetivos (branding/leads/ventas)'),
(146, 'marketing-1', 'Gestión de presupuesto de ads'),
(147, 'marketing-1', 'Creación de 10+ piezas gráficas mensuales'),
(148, 'marketing-1', 'Desarrollo de contenido audiovisual'),
(149, 'marketing-1', 'Optimización continua de campañas'),
(150, 'marketing-1', 'Reporte de KPIs personalizado'),
(151, 'marketing-1', 'Sesiones de análisis mensual'),
(152, 'marketing-2', 'Naming y desarrollo de logotipo'),
(153, 'marketing-2', 'Paleta de colores corporativos'),
(154, 'marketing-2', 'Sistema tipográfico completo'),
(155, 'marketing-2', 'Aplicaciones en papelería y digital'),
(156, 'marketing-2', 'Diseño de merchandising'),
(157, 'marketing-2', 'Manual de marca detallado'),
(158, 'marketing-2', 'Archivos en múltiples formatos'),
(159, 'marketing-3', 'Auditoría digital completa'),
(160, 'marketing-3', 'Benchmarking competitivo'),
(161, 'marketing-3', 'Roadmap de canales digitales'),
(162, 'marketing-3', 'Plan de acción táctico'),
(163, 'marketing-3', 'Cronograma de implementación'),
(164, 'marketing-3', 'Definición de KPIs'),
(165, 'marketing-3', 'Sesiones de seguimiento trimestral'),
(166, 'automatizacion-1', 'Integración con múltiples plataformas'),
(167, 'automatizacion-1', 'Migración de datos históricos'),
(168, 'automatizacion-1', 'Sincronización en tiempo real'),
(169, 'automatizacion-1', 'Mapeo de procesos detallado'),
(170, 'automatizacion-1', 'Configuración de webhooks'),
(171, 'automatizacion-1', 'Middleware personalizado'),
(172, 'automatizacion-1', 'Soporte post-implementación 90 días'),
(173, 'automatizacion-2', 'Diseño de flujos conversacionales'),
(174, 'automatizacion-2', 'Integración con CRM'),
(175, 'automatizacion-2', 'Entrenamiento con IA avanzada'),
(176, 'automatizacion-2', 'Panel de administración completo'),
(177, 'automatizacion-2', 'Análisis de conversaciones'),
(178, 'automatizacion-2', 'Personalización por segmento'),
(179, 'automatizacion-2', 'Soporte por 90 días'),
(180, 'tecnologia-1', 'Pentesting (white-box y black-box)'),
(181, 'tecnologia-1', 'Auditoría de cumplimiento normativo'),
(182, 'tecnologia-1', 'Pruebas de red y aplicación'),
(183, 'tecnologia-1', 'Plan de remediación detallado'),
(184, 'tecnologia-1', 'Acuerdos de confidencialidad'),
(185, 'tecnologia-1', 'Certificación de seguridad'),
(186, 'tecnologia-1', 'Soporte 24/7'),
(187, 'tecnologia-2', 'Infraestructura cloud escalable'),
(188, 'tecnologia-2', 'Alta disponibilidad (99.99%)'),
(189, 'tecnologia-2', 'Backups automáticos diarios'),
(190, 'tecnologia-2', 'Firewall de nueva generación'),
(191, 'tecnologia-2', 'Monitoreo 24/7'),
(192, 'tecnologia-2', 'Soporte técnico prioritario'),
(193, 'tecnologia-2', 'Reportes de rendimiento'),
(194, 'formacion-1', 'Temario personalizado por nivel'),
(195, 'formacion-1', 'Material didáctico exclusivo'),
(196, 'formacion-1', 'Modalidad presencial o virtual'),
(197, 'formacion-1', 'Ejercicios prácticos reales'),
(198, 'formacion-1', 'Certificación de competencias'),
(199, 'formacion-1', 'Soporte post-formación'),
(200, 'formacion-1', 'Acceso a plataforma de recursos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios_opciones`
--

CREATE TABLE `servicios_opciones` (
  `id` varchar(255) NOT NULL,
  `servicio_id` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `seleccionado_por_defecto` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `servicios_opciones`
--

INSERT INTO `servicios_opciones` (`id`, `servicio_id`, `nombre`, `descripcion`, `precio`, `seleccionado_por_defecto`) VALUES
('ads-management', 'marketing-1', 'Gestión de Anuncios', 'Gestión completa de campañas publicitarias', 100000.00, 0),
('auditoria-normativa', 'tecnologia-1', 'Auditoría Normativa', 'Cumplimiento de normativas específicas', 150000.00, 0),
('beneficios-vip', 'giftcard-3', 'Beneficios VIP', 'Acceso a descuentos exclusivos y atención personalizada', 10000.00, 0),
('contenido-audiovisual', 'marketing-1', 'Contenido Audiovisual', 'Producción de videos y contenido multimedia', 80000.00, 0),
('entrega-fisica', 'giftcard-2', 'Entrega física', 'Envío de la tarjeta física en estuche de regalo', 5000.00, 0),
('entrega-premium', 'giftcard-3', 'Entrega Premium', 'Entrega en caja de regalo de lujo con servicio prioritario', 15000.00, 0),
('erp-integration', 'diseno-3', 'Integración ERP', 'Integración con sistema ERP existente', 150000.00, 0),
('formulario-avanzado', 'diseno-1', 'Formulario Avanzado', 'Formulario con validación y captcha', 30000.00, 0),
('influencer', 'marketing-1', 'Campaña con Influencers', 'Colaboración con influencers del sector', 150000.00, 0),
('migracion-completa', 'diseno-2', 'Migración Completa', 'Migración de todos los contenidos y funcionalidades', 100000.00, 1),
('monitoreo-continuo', 'tecnologia-1', 'Monitoreo Continuo', 'Monitoreo 24/7 de seguridad', 100000.00, 0),
('monto-10000', 'giftcard-1', 'Monto $10.000', 'Giftcard con valor de $10.000', 10000.00, 1),
('monto-100000', 'giftcard-2', 'Monto $100.000', 'Giftcard con valor de $100.000', 100000.00, 0),
('monto-100000', 'giftcard-3', 'Monto $100.000', 'Giftcard con valor de $100.000', 100000.00, 1),
('monto-20000', 'giftcard-1', 'Monto $20.000', 'Giftcard con valor de $20.000', 20000.00, 0),
('monto-250000', 'giftcard-3', 'Monto $250.000', 'Giftcard con valor de $250.000', 250000.00, 0),
('monto-30000', 'giftcard-2', 'Monto $30.000', 'Giftcard con valor de $30.000', 30000.00, 1),
('monto-50000', 'giftcard-1', 'Monto $50.000', 'Giftcard con valor de $50.000', 50000.00, 0),
('monto-50000', 'giftcard-2', 'Monto $50.000', 'Giftcard con valor de $50.000', 50000.00, 0),
('monto-500000', 'giftcard-3', 'Monto $500.000', 'Giftcard con valor de $500.000', 500000.00, 0),
('multi-warehouse', 'diseno-3', 'Múltiples Almacenes', 'Gestión de inventario en múltiples ubicaciones', 100000.00, 0),
('pentest-completo', 'tecnologia-1', 'Pentest Completo', 'Pruebas de penetración exhaustivas', 200000.00, 0),
('pruebas-extendidas', 'diseno-2', 'Pruebas Extendidas', 'Pruebas de usabilidad y rendimiento', 50000.00, 0),
('seo-avanzado', 'diseno-1', 'SEO Avanzado', 'Optimización completa con palabras clave y análisis de competencia', 100000.00, 0),
('seo-basico', 'diseno-1', 'SEO Básico', 'Optimización básica para motores de búsqueda', 50000.00, 1),
('seo-preservacion', 'diseno-2', 'Preservación SEO', 'Mapeo y redirección de URLs antiguas', 75000.00, 0),
('soporte-extendido', 'diseno-3', 'Soporte Extendido', 'Soporte técnico por 6 meses', 120000.00, 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias_servicios`
--
ALTER TABLE `categorias_servicios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `ordenes`
--
ALTER TABLE `ordenes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoria_id` (`categoria_id`);

--
-- Indices de la tabla `servicios_caracteristicas`
--
ALTER TABLE `servicios_caracteristicas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `servicio_id` (`servicio_id`);

--
-- Indices de la tabla `servicios_opciones`
--
ALTER TABLE `servicios_opciones`
  ADD PRIMARY KEY (`id`,`servicio_id`),
  ADD KEY `servicio_id` (`servicio_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias_servicios`
--
ALTER TABLE `categorias_servicios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `ordenes`
--
ALTER TABLE `ordenes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `servicios_caracteristicas`
--
ALTER TABLE `servicios_caracteristicas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=201;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD CONSTRAINT `servicios_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias_servicios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `servicios_caracteristicas`
--
ALTER TABLE `servicios_caracteristicas`
  ADD CONSTRAINT `servicios_caracteristicas_ibfk_1` FOREIGN KEY (`servicio_id`) REFERENCES `servicios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `servicios_opciones`
--
ALTER TABLE `servicios_opciones`
  ADD CONSTRAINT `servicios_opciones_ibfk_1` FOREIGN KEY (`servicio_id`) REFERENCES `servicios` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
