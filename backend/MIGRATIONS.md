# Migraciones de Base de Datos

Este documento explica cómo ejecutar las migraciones de la base de datos para el proyecto DonNicola.

## Estructura de las Migraciones

Las migraciones se han creado en el siguiente orden para respetar las dependencias:

1. **20241201000001-create-usuario.js** - Tabla Usuarios
2. **20241201000002-create-cliente.js** - Tabla Clientes
3. **20241201000003-create-producto.js** - Tabla Productos
4. **20241201000004-create-sucursal.js** - Tabla Sucursales
5. **20241201000005-create-objetivo.js** - Tabla Objetivos (depende de Usuarios)
6. **20241201000006-create-venta.js** - Tabla Ventas (depende de Clientes)
7. **20241201000007-create-lote.js** - Tabla Lotes (depende de Sucursales y Productos)
8. **20241201000008-create-venta-detalle.js** - Tabla VentaDetalles (depende de Ventas y Productos)

## Comandos Disponibles

### Ejecutar todas las migraciones
```bash
npm run migrate
```

### Deshacer la última migración
```bash
npm run migrate:undo
```

### Deshacer todas las migraciones
```bash
npm run migrate:undo:all
```

### Ejecutar seeders (cuando estén disponibles)
```bash
npm run seed
```

### Deshacer seeders
```bash
npm run seed:undo
```

## Configuración

Asegúrate de que el archivo `config/config.json` esté configurado correctamente con los datos de conexión a tu base de datos MySQL.

### Configuración de Desarrollo
```json
{
  "development": {
    "username": "user",
    "password": "password",
    "database": "donicola",
    "host": "db",
    "dialect": "mysql"
  }
}
```

## Notas Importantes

- Las migraciones se ejecutan en orden cronológico según el timestamp del nombre del archivo
- Todas las claves foráneas tienen configurado `onUpdate: 'CASCADE'` y `onDelete: 'CASCADE'`
- Las tablas incluyen automáticamente los campos `createdAt` y `updatedAt` de Sequelize
- El campo `email` en la tabla Usuarios tiene restricción `unique: true`

## Estructura de las Tablas

### Usuarios
- id (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
- email (STRING, UNIQUE, NOT NULL)
- password (STRING, NOT NULL)
- rol (STRING, NOT NULL)

### Clientes
- id (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
- nombre (STRING, NOT NULL)
- localidad (STRING, NOT NULL)

### Productos
- id (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
- nombre (STRING, NOT NULL)
- descripcion (TEXT)
- precio (DECIMAL(10,2), NOT NULL)
- tipo (INTEGER, NOT NULL)
- imagen (STRING)

### Sucursales
- id (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
- nombre (STRING, NOT NULL)
- direccion (TEXT, NOT NULL)

### Objetivos
- id (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
- descripcion (TEXT)
- fechaInicio (DATE, NOT NULL)
- fechaFin (DATE, NOT NULL)
- nombre (STRING, NOT NULL)
- usuarioId (INTEGER, FOREIGN KEY -> Usuarios.id)

### Ventas
- id (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
- fecha (DATE, NOT NULL)
- total (DECIMAL(10,2), NOT NULL)
- clienteId (INTEGER, FOREIGN KEY -> Clientes.id)

### Lotes
- id (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
- cantidad (INTEGER, NOT NULL)
- fechaCaducidad (DATE, NOT NULL)
- fechaProduccion (DATE, NOT NULL)
- sucursalId (INTEGER, FOREIGN KEY -> Sucursales.id)
- productoId (INTEGER, FOREIGN KEY -> Productos.id)

### VentaDetalles
- id (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
- cantidad (INTEGER, NOT NULL)
- fechaCaducidad (DATE, NOT NULL)
- fechaProduccion (DATE, NOT NULL)
- ventaId (INTEGER, FOREIGN KEY -> Ventas.id)
- productoId (INTEGER, FOREIGN KEY -> Productos.id) 