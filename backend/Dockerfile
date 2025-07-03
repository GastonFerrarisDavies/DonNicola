# Usar Node.js 18 como imagen base
FROM node:18-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Exponer el puerto 3001 (puerto típico para backend)
EXPOSE 3001

# Comando para ejecutar las migraciones y luego el servidor
CMD ["npm", "start"]
