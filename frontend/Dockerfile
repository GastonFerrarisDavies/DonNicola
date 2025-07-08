# frontend/Dockerfile

# Etapa 1: Builder (para construir la aplicación Next.js)
# Usamos una imagen oficial de Node.js con Alpine Linux, que es más ligera para la construcción.
FROM node:20-alpine AS builder

# Establece el directorio de trabajo dentro del contenedor.
# Aquí es donde se copiará tu código y se ejecutarán los comandos de construcción.
WORKDIR /app

# Copia los archivos de definición de dependencias del proyecto (package.json y yarn.lock/package-lock.json).
# Hacemos esto primero para aprovechar el caché de capas de Docker. Si estos archivos no cambian,
# Docker no reinstalará las dependencias en futuras construcciones, lo que acelera el proceso.
COPY package.json package-lock.json ./
# Si usas npm, usa: COPY package.json package-lock.json ./

# Instala las dependencias de Node.js.
# Usamos 'yarn install --frozen-lockfile' para instalaciones limpias y consistentes.
# Si usas npm, usa: RUN npm ci --prefer-offline --no-audit
RUN npm install --frozen-lockfile

# Copia el resto del código fuente de tu aplicación Next.js al directorio de trabajo.
COPY . .

# Genera la construcción de producción de tu aplicación Next.js.
# Es CRUCIAL que tu next.config.js tenga `output: 'standalone'` para que esta etapa funcione correctamente.
# Esto genera una carpeta '.next/standalone' que es autocontenida y optimizada para Docker.
RUN npm run build
# Si usas npm, usa: RUN npm run build

# Etapa 2: Runner (para servir la aplicación construida en producción)
# Usamos una imagen Node.js más ligera para el entorno de producción, ya que solo necesitamos ejecutar el build.
FROM node:20-alpine AS runner

# Establece el directorio de trabajo dentro del contenedor.
WORKDIR /app

# Copia los archivos de la construcción 'standalone' desde la etapa 'builder'.
# Next.js en modo 'standalone' incluye su propio servidor, por lo que no necesitas copiar node_modules completo.
COPY --from=builder /app/.next/standalone ./
# Copia los archivos estáticos generados por Next.js.
COPY --from=builder /app/.next/static ./.next/static
# Copia los archivos públicos (imágenes, favicons, etc.).
COPY --from=builder /app/public ./public

# Expone el puerto en el que la aplicación Next.js escuchará.
EXPOSE 3000

# Establece la variable de entorno para indicar que la aplicación está en producción.
ENV NODE_ENV production

# Comando por defecto que se ejecuta cuando el contenedor se inicia.
# El archivo 'server.js' es generado por Next.js en el modo 'standalone'.
CMD ["node", "server.js"]

# Nota importante:
# Si no estás usando `output: 'standalone'` en tu next.config.js,
# el Dockerfile sería diferente, requiriendo copiar todo `node_modules`
# y ejecutar `npm start` o `yarn start`. Sin embargo, 'standalone'
# es la forma recomendada y más eficiente para Docker.
