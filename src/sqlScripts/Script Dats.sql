CREATE TABLE Servicios (
    Id INT PRIMARY KEY,
    Icon NVARCHAR(10),
    Title NVARCHAR(100),
    Description NVARCHAR(255),
    Popular BIT
);

INSERT INTO Servicios (Id, Icon, Title, Description, Popular) VALUES
(1, N'📦', 'Entrega de Paquetes', 'Envía y recibe paquetes pequeños de forma rápida y segura en toda la ciudad.', 1),
(2, N'📄', 'Recoger Documentos', 'Recogemos documentos importantes y los entregamos en el lugar que necesites.', 0),
(3, N'💳', 'Pago de Trámites', 'Realizamos pagos de servicios, facturas y trámites bancarios por ti.', 0),
(4, N'🛒', 'Compra Urgente', 'Hacemos compras urgentes en farmacias, supermercados o tiendas específicas.', 1),
(5, N'⏳', 'Hacer Fila', 'Evita las largas filas, nosotros esperamos por ti en oficinas y trámites.', 0),
(6, N'📋', 'Otros Servicios', 'Diligencias personalizadas según tus necesidades específicas.', 0);

CREATE TABLE Testimonios (
    Id INT PRIMARY KEY,
    Name NVARCHAR(100),
    Role NVARCHAR(50),
    Avatar NVARCHAR(10),
    Rating INT,
    Comment NVARCHAR(500)
);
INSERT INTO Testimonios VALUES
(1, 'Carlos Mendoza', 'Empresario', N'👨‍💼', 5, 'DiliBee me ha ahorrado horas de trabajo. Sus gestores son puntuales y confiables. ¡Excelente servicio!'),
(2, 'Ana García', 'Estudiante', N'👩‍🎓', 5, 'Como estudiante, no tengo tiempo para hacer trámites. DiliBee siempre me ayuda cuando lo necesito.'),
(3, 'María Rodríguez', 'Mamá', N'👩', 5, 'Con dos niños pequeños, hacer filas es imposible. DiliBee ha sido un salvavidas para mí.'),
(4, 'Luis Hernández', 'Profesional', N'👨', 5, 'El servicio de seguimiento en tiempo real es genial. Siempre sé dónde está mi diligencia.'),
(5, 'Sofía Martínez', 'Empresaria', N'👩‍💼', 5, 'Usamos DiliBee para las diligencias de nuestra empresa. Rápido, eficiente y económico.');

CREATE TABLE Usuarios (
    Id INT PRIMARY KEY,
    Email NVARCHAR(150),
    Password NVARCHAR(100),
    Nombre NVARCHAR(100),
    Tipo NVARCHAR(20),
    Telefono NVARCHAR(30),
    Zona NVARCHAR(100) NULL,
    Calificacion DECIMAL(3,1) NULL
);

INSERT INTO Usuarios VALUES
(1, 'john.doe@gmail.com', 'usuario123', 'John Doe', 'usuario', '+52 55 1234 5678', NULL, NULL),
(2, 'juan.perez@dilibee.com', 'gestor123', 'Juan Pérez', 'gestor', '+52 55 9876 5432', 'Centro y Norte', 4.9);


CREATE TABLE Gestores (
    Id INT PRIMARY KEY,
    Nombre NVARCHAR(100),
    Email NVARCHAR(150),
    Telefono NVARCHAR(30),
    Calificacion DECIMAL(3,1),
    TotalDiligencias INT,
    Disponible BIT,
    Zona NVARCHAR(100),
    Vehiculo NVARCHAR(50),
    Foto NVARCHAR(10)
);
INSERT INTO Gestores VALUES
(10, 'Juan Pérez', 'juan.perez@email.com', '+57 300 123 4567', 4.9, 145, 1, 'Centro y Norte', 'Moto', N'👨‍🦱'),
(11, 'Pedro López', 'pedro.lopez@email.com', '+57 310 234 5678', 4.6, 89, 1, 'Sur', 'Bicicleta', N'👨'),
(12, 'Roberto Silva', 'roberto.silva@email.com', '+57 320 345 6789', 4.8, 203, 1, 'Este y Oeste', 'Moto', N'👨‍💼'),
(13, 'María González', 'maria.gonzalez@email.com', '+57 350 456 7890', 4.7, 112, 0, 'Centro', 'Caminando', N'👩'),
(14, 'Carmen Ruiz', 'carmen.ruiz@email.com', '+57 315 567 8901', 4.9, 178, 1, 'Norte y Sur', 'Carro', N'👩‍💼');


CREATE TABLE Diligencias (
    Id INT PRIMARY KEY,
    Titulo NVARCHAR(200),
    Descripcion NVARCHAR(500),
    Tipo NVARCHAR(50),
    PuntoInicio NVARCHAR(200),
    PuntoDestino NVARCHAR(200),
    Estado NVARCHAR(50),
    Urgencia NVARCHAR(50),
    Precio DECIMAL(10,2),
    FechaCreacion DATE,
    UsuarioId INT,
    GestorId INT NULL,
    FOREIGN KEY (UsuarioId) REFERENCES Usuarios(Id),
    FOREIGN KEY (GestorId) REFERENCES Usuarios(Id)
);


INSERT INTO Diligencias VALUES
(1,'Entrega de documentos importantes','Necesito entregar documentos legales en el centro de la ciudad','documento',
 'Calle 123, Zona Norte','Oficina Legal, Calle 456, Centro','pendiente','urgente',350,'2024-01-20',1,NULL),

(2,'Recoger paquete de mensajería','Recoger paquete en oficina de correos y entregarlo en mi domicilio','entrega',
 'Oficina de Correos, Calle 789','Calle 321, Zona Sur','completada','normal',200,'2024-01-10',1,2),

(3,'Pago de factura de servicios','Realizar pago de factura de servicios públicos en banco','pago',
 'Calle Principal 100','Banco Nacional, Sucursal Centro','completada','normal',180,'2024-01-08',1,2),

(4,'Compra urgente de medicamentos','Comprar medicamentos recetados en farmacia específica','compra',
 'Clínica San José, Calle 500','Farmacia Central, Avenida Principal','pendiente','muy-urgente',450,'2024-01-21',1,NULL),

(5,'Hacer fila para renovación de documento','Hacer fila en oficina de tránsito para renovación de licencia','fila',
 'Oficina de Tránsito, Zona Este','Oficina de Tránsito, Zona Este','en-progreso','urgente',550,'2024-01-18',1,2);
