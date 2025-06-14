# Etapa de desarrollo
FROM node:18-alpine AS development

WORKDIR /app

# Copiar archivos de configuración
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar el servidor en desarrollo
CMD ["npm", "run", "dev"]