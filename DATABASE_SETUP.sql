
-- CREACIÓN DE BASE DE DATOS
-- Sistema SEDIF - Almacén de Materiales


-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS almacen_sedif;
USE almacen_sedif;

-- ========================================
-- Tabla: Almacén
-- ========================================
CREATE TABLE IF NOT EXISTS Almacens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL UNIQUE,
  descripcion VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- Tabla: Usuario
-- ========================================
CREATE TABLE IF NOT EXISTS Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  contraseña VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'almacenista') DEFAULT 'almacenista',
  almacenId INT,
  foto VARCHAR(255) DEFAULT '',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (almacenId) REFERENCES Almacens(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- Tabla: Item (Productos)
-- ========================================
CREATE TABLE IF NOT EXISTS Items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  tipo VARCHAR(255) NOT NULL,
  categoria VARCHAR(255) NOT NULL,
  codigoBarras VARCHAR(255),
  cantidad INT NOT NULL,
  peso FLOAT,
  almacenId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (almacenId) REFERENCES Almacens(id) ON DELETE RESTRICT,
  INDEX idx_almacenId (almacenId),
  INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Vales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  items JSON NOT NULL,
  entregadoPorId INT NOT NULL,
  recibidoPor VARCHAR(255),
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  almacenId INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (entregadoPorId) REFERENCES Users(id) ON DELETE RESTRICT,
  FOREIGN KEY (almacenId) REFERENCES Almacens(id) ON DELETE SET NULL,
  INDEX idx_entregadoPorId (entregadoPorId),
  INDEX idx_almacenId (almacenId),
  INDEX idx_fecha (fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insertar superusuario inicial (email: admin@sedif.com, contraseña: admin123)
-- Contraseña hasheada con bcrypt: $2b$10$K1rYZiKQ5yDSVxJk0n8Ene2rJvS5hHmVuKjB7p5rK7LJ2tD8h8kG2
INSERT INTO Users (nombre, email, contraseña, rol, almacenId, foto) VALUES
('Super Admin', 'admin@sedif.com', '$2b$10$K1rYZiKQ5yDSVxJk0n8Ene2rJvS5hHmVuKjB7p5rK7LJ2tD8h8kG2', 'admin', NULL, '');

-- ========================================
-- DATOS INICIALES
-- ========================================

CREATE INDEX idx_users_email ON Users(email);
CREATE INDEX idx_users_rol ON Users(rol);
CREATE INDEX idx_items_codigoBarras ON Items(codigoBarras);
CREATE INDEX idx_vales_createdAt ON Vales(createdAt);


-- La base de datos está lista para usar
-- Superusuario: admin@sedif.com / admin123
-- Cambiar la contraseña inmediatamente después del primer login
